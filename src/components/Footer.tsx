import type { FlexProps } from "@chakra-ui/react";
import { Flex } from "@chakra-ui/react";
import type { VFC } from "react";

export const Footer: VFC<FlexProps> = (props) => (
  <Flex as="footer" py="8rem" {...props} />
);
