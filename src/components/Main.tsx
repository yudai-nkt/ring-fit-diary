import type { StackProps } from "@chakra-ui/react";
import { VStack } from "@chakra-ui/react";
import type { VFC } from "react";

export const Main: VFC<StackProps> = (props) => (
  <VStack spacing="1.5rem" maxWidth="80rem" pt="8rem" px="1rem" {...props} />
);
