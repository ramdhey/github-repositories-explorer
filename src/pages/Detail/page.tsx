import { Box, Container } from "@chakra-ui/react";

export default function DetailPage() {
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
