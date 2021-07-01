import { Text } from "@chakra-ui/react";

import { Hero } from "../components/Hero";
import { Container } from "../components/Container";
import { Main } from "../components/Main";
import { DarkModeSwitch } from "../components/DarkModeSwitch";
import { Header } from "../components/Header";

const Index = () => {
  return (
    <Container height="100vh">
      <Main>
        <Hero />
        <Header />
        <Text>
          Ring Fit
          Diaryはリングフィットアドベンチャーのプレイ記録をPCやスマホ上で分かりやすく可視化するアプリです．Twitterアカウントがあれば始められます．
        </Text>
      </Main>
      <DarkModeSwitch />
    </Container>
  );
};

export default Index;
