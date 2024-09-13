import { Box, Flex, Text } from "@chakra-ui/react";

const Footer: React.FC = () => {
    return (
        <Box bg="purple.500" py={4} mt="auto" color="white">
            <Flex justifyContent="center">
                <Text fontSize="sm">
                    © 2024 Secure Share. Made with ❤️ at ETHBoston.
                </Text>
            </Flex>
        </Box>
    );
};

export default Footer;