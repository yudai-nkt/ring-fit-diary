import { Button, Flex, Heading, Spacer } from "@chakra-ui/react";
import { signIn, useSession } from "next-auth/client";

export const Header = () => {
  const [session] = useSession();
  return (
    <Flex
      as="header"
      position={"fixed"}
      top={0}
      width={"100%"}
      maxW="inherit"
      justify={"space-between"}
    >
      <Heading fontSize="x-large">Ring Fit Diary</Heading>
      {!session && (
        <>
          <Spacer />
          <Button
            onClick={(e) => {
              e.preventDefault();
              signIn();
            }}
          >
            Sign in
          </Button>
        </>
      )}
    </Flex>
  );
};
