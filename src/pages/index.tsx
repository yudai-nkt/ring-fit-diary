import { Button, Text } from "@chakra-ui/react";
import { signIn, useSession } from "next-auth/client";

import { Hero } from "../components/Hero";
import { Container } from "../components/Container";
import { Main } from "../components/Main";
import { DarkModeSwitch } from "../components/DarkModeSwitch";

const Index = () => {
  const [session] = useSession();
  return (
    <Container height="100vh">
      <Hero />
      <Main>
        <Text>Under construction.</Text>
        {!session && (
          <>
            <Text>You are not signed in.</Text>
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
      </Main>
      <DarkModeSwitch />
    </Container>
  );
};

export default Index;
