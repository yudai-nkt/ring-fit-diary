import { Text } from "@chakra-ui/react";
import { IoIosFitness } from "react-icons/io";
import { IoLogoTwitter, IoBarChartSharp } from "react-icons/io5";

import { Hero } from "../components/Hero";
import { Container } from "../components/Container";
import { Main } from "../components/Main";
import { DarkModeSwitch } from "../components/DarkModeSwitch";
import { Header } from "../components/Header";
import { Features } from "../components/Features";

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
        <Features
          features={[
            { icon: IoIosFitness, description: "ゲームをプレイ" },
            { icon: IoLogoTwitter, description: "リザルト画面を共有" },
            { icon: IoBarChartSharp, description: "記録を可視化" },
          ]}
          vStackProps={{ spacing: 8 }}
          iconProps={{ width: 20, height: 20 }}
        />
      </Main>
      <DarkModeSwitch />
    </Container>
  );
};

export default Index;
