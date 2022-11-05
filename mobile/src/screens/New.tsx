import { Heading, Text, VStack } from "native-base";

import { Button } from "../components/Button";
import { Header } from "../components/Header";
import { Input } from "../components/Input";

import Logo from "../assets/logo.svg";

export function New() {
  return (
    <VStack flex={1} bgColor="gray.900">
      <Header title="Create new poll" />

      <VStack mt={8} mx={5} alignItems="center">
        <Logo />
        <Heading
          fontFamily="heading"
          color="white"
          fontSize="xl"
          my={8}
          textAlign="center"
        >
          Create your own World Cup poll and share with your friends!
        </Heading>
        <Input mb={2} placeholder="Name your poll..." />

        <Button title="Create Poll" />
        <Text color="gray.200" fontSize="sm" textAlign="center" px={10} mt={4}>
          After creating your poll, you will receive a unique code that you can
          use to invite others! 🚀
        </Text>
      </VStack>
    </VStack>
  );
}
