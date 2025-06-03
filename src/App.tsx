import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Container } from "@chakra-ui/react";
import ListPage from "./pages/List/page";

export default function App() {
  return (
    <BrowserRouter>
      <Container maxW="4xl">
        <Routes>
          <Route path="/" element={<ListPage />} />
        </Routes>
      </Container>
    </BrowserRouter>
  );
}
