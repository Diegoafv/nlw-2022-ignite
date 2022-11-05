import { Heading, VStack } from "native-base";

import { Button } from "../components/Button";
import { Header } from "../components/Header";
import { Input } from "../components/Input";

export function Find() {
  return (
    <VStack flex={1} bgColor="gray.900">
      <Header title="Search poll" showBackButton />

      <VStack mt={8} mx={5} alignItems="center">
        <Heading
          fontFamily="heading"
          color="white"
          fontSize="xl"
          mb={8}
          textAlign="center"
        >
          Find a poll using its unique code...
        </Heading>
        <Input mb={2} placeholder="Enter the code..." />

        <Button title="SEARCH POLL" />
      </VStack>
    </VStack>
  );
}
