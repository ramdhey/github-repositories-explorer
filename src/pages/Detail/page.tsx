import { useParams, Link as RouterLink } from "react-router-dom";
import { Box, Heading, Text, Button, Container, Stack } from "@chakra-ui/react";

export default function DetailPage() {
  const { id } = useParams<{ id: string }>();

  return (
    <Box
      minH="100vh"
      bgGradient="linear(to-b, gray.900, gray.800)"
      color="gray.200"
      py={{ base: 10, md: 16 }}
    >
      <Container maxW="2xl"></Container>
    </Box>
  );
}

function Center404() {
  return (
    <Box
      minH="100vh"
      bg="gray.900"
      display="flex"
      alignItems="center"
      justifyContent="center"
      flexDir="column"
      gap={6}
    ></Box>
  );
}
