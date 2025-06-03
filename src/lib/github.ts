export interface User {
  login: string;
  id: number;
  avatar_url: string;
}

export interface Repo {
  id: number;
  name: string;
  description: string | null;
  stargazers_count: number;
}

export class GitHubApiError extends Error {
  public status: number;
  public url: string;

  constructor(status: number, url: string, message: string) {
    super(message);
    this.status = status;
    this.url = url;
    this.name = "GitHubApiError";
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

const GH = "https://api.github.com";

const HEADERS: HeadersInit = {
  Accept: "application/vnd.github+json",
  "X-GitHub-Api-Version": "2022-11-28",
  ...(import.meta.env.VITE_GH_TOKEN && {
    Authorization: `Bearer ${import.meta.env.VITE_GH_TOKEN}`,
  }),
};

async function fetchJSON<T>(url: string, init?: RequestInit): Promise<T> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 10_000);

  try {
    const res = await fetch(url, {
      ...init,
      headers: { ...HEADERS, ...(init?.headers ?? {}) },
      signal: controller.signal,
    });

    if (!res.ok) {
      const data = (await res.json().catch(() => ({}))) as { message?: string };
      throw new GitHubApiError(res.status, url, data.message ?? res.statusText);
    }

    return (await res.json()) as T;
  } catch (err) {
    if (err instanceof DOMException && err.name === "AbortError") {
      throw new Error("Network timeout. Please try again.");
    }
    throw err;
  } finally {
    clearTimeout(timer);
  }
}

export async function listPublicUsers(
  since = 0,
  perPage = 10
): Promise<User[]> {
  const url = `${GH}/users?since=${since}&per_page=${perPage}`;
  return fetchJSON<User[]>(url);
}

export async function searchUsers(q: string, perPage = 5): Promise<User[]> {
  const url = `${GH}/search/users?q=${encodeURIComponent(
    q
  )}+type:user&per_page=${perPage}`;
  const { items } = await fetchJSON<{ items: User[] }>(url);
  return items;
}

export async function listRepos(user: string): Promise<Repo[]> {
  const url = `${GH}/users/${user}/repos?per_page=100&sort=updated`;
  return fetchJSON<Repo[]>(url);
}

export async function getUserStat(login: string): Promise<number> {
  const url = `${GH}/users/${login}`;
  const { public_repos } = await fetchJSON<{ public_repos: number }>(url);
  return public_repos;
}
