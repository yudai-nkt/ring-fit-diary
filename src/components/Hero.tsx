import { Flex, Heading } from "@chakra-ui/react";
import type { VFC } from "react";

export const Hero: VFC<{ title?: string }> = ({ title }) => (
  <Flex
    justifyContent="center"
    alignItems="center"
    height="100vh"
    bgGradient="linear(to-r, #f82303, #fcd701)"
    bgClip="text"
  >
    <Heading fontSize="6vw">{title}</Heading>
  </Flex>
);

Hero.defaultProps = {
  title: "Ring Fit Diary",
};
