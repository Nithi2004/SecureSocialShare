"use client";

import ConsumerPage from "@/components/ConsumerPage";
import { Container } from "@chakra-ui/react";
import React from "react";

export default function consumer() {
  return (
    <Container maxW="7xl" as="main" p={2}>
      <ConsumerPage />
    </Container>
  );
}
