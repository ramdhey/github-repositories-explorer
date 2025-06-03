import {
  Box,
  Container,
  Stack,
  HStack,
  Heading,
  Text,
  Input,
  InputGroup,
  Icon,
  Badge,
  Spinner,
  Avatar,
  Accordion,
  Card,
  useBreakpointValue,
} from "@chakra-ui/react";
import { Github, Search, ExternalLink, Star } from "lucide-react";
import { Link as RouterLink } from "react-router-dom";
import { useEffect, memo } from "react";
import { useGithub } from "../../store/useGithub";
import FireworksBg from "../../components/ui/FireworksBg";

const truncate = (text: string, limit = 100) =>
  text.length <= limit
    ? text
    : `${text.slice(0, limit)}… (${text.length - limit} more)`;

const TinySpinner = () => <Spinner size="xs" />;

const SearchBar = memo(
  ({ query, onChange }: { query: string; onChange: (v: string) => void }) => (
    <InputGroup
      startElement={<Icon as={Search} boxSize={5} color="gray.400" />}
    >
      <Input
        variant="subtle"
        placeholder="Cari username…"
        value={query}
        onChange={(e) => onChange(e.target.value)}
      />
    </InputGroup>
  )
);
SearchBar.displayName = "SearchBar";

interface RepoItemProps {
  owner: string;
  repo: {
    id: number;
    name: string;
    description: string | null;
    stargazers_count: number;
  };
  isLast: boolean;
}

const RepoItem = memo(({ repo, isLast }: RepoItemProps) => (
  <Card.Root
    asChild
    bg="gray.700"
    _hover={{ bg: "gray.600" }}
    transition="background .15s"
    borderRadius={0}
    borderBottom={isLast ? undefined : "1px"}
    borderColor="gray.600"
  >
    <RouterLink to={``}>
      <Card.Header px={6} py={3} display="flex" gap={2} alignItems="start">
        <Box flex="1">
          <Heading
            size="xs"
            _groupHover={{ textDecoration: "underline" }}
            color="blue.200"
          >
            {repo.name}
          </Heading>
          <Text fontSize="sm" color="gray.400" lineClamp={2}>
            {repo.description ?? "—"}
          </Text>
        </Box>
        <Badge colorScheme="yellow" display="flex" alignItems="center" gap={1}>
          <Icon as={Star} boxSize={3} />
          {repo.stargazers_count}
        </Badge>
        <Icon as={ExternalLink} boxSize={4} />
      </Card.Header>
    </RouterLink>
  </Card.Root>
));
RepoItem.displayName = "RepoItem";

interface UserCardProps {
  login: string;
  avatar_url: string;
}

const UserCard = ({ login, avatar_url }: UserCardProps) => {
  const { repoCount, reposLoading, reposByUser, fetchRepos } = useGithub();

  const count = repoCount[login];
  const isLoading = reposLoading[login];
  const repos = reposByUser[login] ?? [];
  const isMobile = useBreakpointValue({ base: true, md: false });

  return (
    <Accordion.Item value={login}>
      <Card.Root
        bg="gray.800"
        borderRadius="xl"
        _hover={{ shadow: "lg", transform: "translateY(-4px)" }}
        transition="all .15s ease"
      >
        <Card.Header
          as={Accordion.ItemTrigger}
          px={6}
          py={4}
          borderRadius="xl"
          _hover={{ bg: "gray.700" }}
          onClick={() => fetchRepos(login)}
        >
          <HStack w="full" gap={4}>
            <Avatar.Root size="2xl">
              <Avatar.Image src={avatar_url} alt={login} />
            </Avatar.Root>
            <Heading size="sm" color="blue.200" flex="1">
              {isMobile ? truncate(login, 12) : login}
            </Heading>
            <Badge
              colorScheme="blue"
              variant="subtle"
              minW="40px"
              justifyContent="center"
            >
              {count !== undefined ? count : <TinySpinner />} Repositories
            </Badge>
          </HStack>
        </Card.Header>

        <Accordion.ItemContent>
          {isLoading ? (
            <Stack py={6} align="center">
              <Spinner />
            </Stack>
          ) : (
            <Stack as="ul" p={0} gap={0}>
              {repos.map((r, i) => (
                <RepoItem
                  key={r.id}
                  owner={login}
                  repo={r}
                  isLast={i === repos.length - 1}
                />
              ))}
            </Stack>
          )}
        </Accordion.ItemContent>
      </Card.Root>
    </Accordion.Item>
  );
};

export default function ListPage() {
  const { query, users, loading, setQuery, search } = useGithub();

  //   useEffect(() => {
  //     init();
  //   }, []);

  useEffect(() => {
    if (!query) return;
    const id = setTimeout(search, 300);
    return () => clearTimeout(id);
  }, [query]);

  return (
    <Box
      minH="100vh"
      position="relative"
      bgGradient="linear(to-b, gray.900, gray.800)"
      color="gray.200"
      pt={{ base: 8, md: 14 }}
      pb={16}
    >
      <FireworksBg />
      <Container maxW="4xl">
        <Stack gap={8}>
          <HStack justify="center" gap={3}>
            <Icon as={Github} boxSize={7} color="white" />
            <Heading size="lg" color="white">
              GitHub Repositories Explorer
            </Heading>
          </HStack>

          <SearchBar query={query} onChange={setQuery} />

          {loading && <Spinner alignSelf="center" />}

          <Accordion.Root multiple gap={4}>
            {query && !loading && users.length === 0 && (
              <Card.Root
                bg="gray.800"
                borderRadius="xl"
                px={6}
                py={8}
                textAlign="center"
                shadow="md"
              >
                <Heading size="md" color="gray.200" mb={2}>
                  No results found
                </Heading>
                <Text fontSize="sm" color="gray.400">
                  Please try a different username.
                </Text>
              </Card.Root>
            )}

            {users.map((u) => (
              <UserCard
                key={u.login}
                login={u.login}
                avatar_url={u.avatar_url}
              />
            ))}
          </Accordion.Root>
        </Stack>
      </Container>
    </Box>
  );
}
