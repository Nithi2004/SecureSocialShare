import { Box, Flex, Link, Spacer, Text } from "@chakra-ui/react";
import NextLink from "next/link";

const Navbar: React.FC = () => {
  return (
    <Flex
      bg="purple.500"
      p={4}
      color="white"
      justify="space-between"
      textTransform="uppercase"
      alignItems="center"
    >
      <Link
        as={NextLink}
        href="/"
        flex={2}
        fontWeight={600}
        fontSize={24}
        fontFamily={"heading"}
      >
        Secure Social Share
      </Link>
      <Flex flex={1} justify="space-around" fontSize={18} fontWeight={500}>
        <Link as={NextLink} href="/citizen">
          Citizens
        </Link>
        <Link as={NextLink} href="/consumer">
          Data Utilizers
        </Link>
      </Flex>
    </Flex>
  );
};

export default Navbar;
