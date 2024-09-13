"use client";

import {
  Button,
  Flex,
  Heading,
  Image,
  Stack,
  Text,
  useBreakpointValue,
} from "@chakra-ui/react";

import NextLink from "next/link";

export default function HomePage() {
  return (
    <Stack minH={"100vh"} direction={{ base: "column", md: "row" }}>
      <Flex p={8} flex={1} align={"center"} justify={"center"}>
        <Stack spacing={6} w={"full"} maxW={"lg"}>
          <Heading fontSize={{ base: "3xl", md: "5xl", lg: "7xl" }}>
            <Text
              as={"span"}
              position={"relative"}
              zIndex={1}
              _after={{
                content: "''",
                width: "full",
                height: useBreakpointValue({ base: "20%", md: "30%" }),
                position: "absolute",
                bottom: 1,
                left: 0,
                bg: "purple.500",
                zIndex: -1,
              }}
            >
              Secure
            </Text>{" "}
            <Text color={"purple.500"} as={"span"}>
              Social Share
            </Text>{" "}
          </Heading>
          <Text fontSize={{ base: "md", lg: "lg" }} color={"gray.700"}>
            Encrypt, store, & share sensitive data with your social circle.
            Guardrailed by strict access-control using trust-minimized
            technologies.
          </Text>
          <Stack direction={{ base: "column", md: "row" }} spacing={4}>
            <Button
              as={NextLink}
              href={"/citizen"}
              rounded={"full"}
              bg={"purple.500"}
              color={"white"}
              _hover={{
                bg: "purple.700",
              }}
            >
              Secure my data
            </Button>
            <Button
              rounded={"full"}
              as={NextLink}
              href="/consumer"
              variant="ghost"
              colorScheme="purple"
              _hover={{ bg: "purple.100" }}
            >
              Access encrypted data
            </Button>
          </Stack>
        </Stack>
      </Flex>
      <Flex flex={1}>
        <Image alt={"Security image"} objectFit={"cover"} src="/hero.jpg" />
      </Flex>
    </Stack>
  );
}
