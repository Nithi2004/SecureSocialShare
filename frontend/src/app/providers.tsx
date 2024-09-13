"use client";

import theme from "@/components/theme";
import { ChakraProvider } from "@chakra-ui/react";
import { PropsWithChildren } from "react";

export const Providers = (props: PropsWithChildren) => {
  return <ChakraProvider theme={theme}>{props.children}</ChakraProvider>;
};
