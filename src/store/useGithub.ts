import { create } from "zustand";
import {
  listPublicUsers,
  searchUsers,
  listRepos,
  getUserStat,
} from "../lib/github";

type Repo = Awaited<ReturnType<typeof listRepos>>[number];
type User = Awaited<ReturnType<typeof searchUsers>>[number];

interface GitState {
  query: string;
  users: User[];
  reposByUser: Record<string, Repo[]>;
  reposLoading: Record<string, boolean>;
  repoCount: Record<string, number>;
  loading: boolean;
  error: string | null;

  init: () => Promise<void>;
  setQuery: (q: string) => void;
  search: () => Promise<void>;
  fetchRepos: (u: string) => Promise<void>;
}

export const useGithub = create<GitState>()((set, get) => {
  const fetchRepoCount = async (login: string) => {
    try {
      const n = await getUserStat(login);
      set((s) => ({ repoCount: { ...s.repoCount, [login]: n } }));
    } catch {
      console.log("err");
    }
  };

  return {
    query: "",
    users: [],
    reposByUser: {},
    reposLoading: {},
    repoCount: {},
    loading: false,
    error: null,

    init: async () => {
      try {
        const users = await listPublicUsers(0, 5);
        set({ users, repoCount: {} });
        users.forEach((u) => fetchRepoCount(u.login));
      } catch (e) {
        console.error(e);
      }
    },

    setQuery: (q) => set({ query: q }),

    search: async () => {
      const q = get().query.trim();
      if (!q) return;
      set({ loading: true, error: null, repoCount: {} });
      try {
        const users = await searchUsers(q, 5);
        set({ users });
        users.forEach((u) => fetchRepoCount(u.login));
      } catch (e: any) {
        set({ error: e.message });
      } finally {
        set({ loading: false });
      }
    },

    fetchRepos: async (user) => {
      const { reposByUser, reposLoading } = get();
      if (reposByUser[user] || reposLoading[user]) return;

      set((s) => ({
        reposLoading: { ...s.reposLoading, [user]: true },
      }));

      try {
        const repos = await listRepos(user);
        set((s) => ({
          reposByUser: { ...s.reposByUser, [user]: repos },
        }));
      } catch (e) {
        console.error(e);
      } finally {
        set((s) => ({
          reposLoading: { ...s.reposLoading, [user]: false },
        }));
      }
    },
  };
});
