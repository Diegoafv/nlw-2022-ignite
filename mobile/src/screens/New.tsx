import { Heading, Text, useToast, VStack } from "native-base";
import { useState } from "react";
import { api } from "../services/api";
//import { Alert } from "react-native";

import { Button } from "../components/Button";
import { Header } from "../components/Header";
import { Input } from "../components/Input";

import Logo from "../assets/logo.svg";

export function New() {
  const [title, setTitle] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const toast = useToast();

  async function handlePollCreate() {
    if (!title.trim()) {
      return toast.show({
        title: "Choose a name for your poll!",
        placement: "top",
        bgColor: "red.500",
      });
      //Alert.alert("Oops!", "Choose a name for your poll!");
    }
    try {
      setIsLoading(true);
      await api.post("/polls", { title: title.toUpperCase() });

      toast.show({
        title: "Your poll was successfully created!",
        placement: "top",
        bgColor: "green.500",
      });

      setTitle("");
    } catch (error) {
      console.log(error);
      toast.show({
        title: "We were not able to create your poll, try again!",
        placement: "top",
        bgColor: "red.500",
      });
    } finally {
      setIsLoading(false);
    }
  }
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
        <Input
          mb={2}
          placeholder="Name your poll..."
          onChangeText={setTitle}
          value={title}
        />

        <Button
          title="CREATE POLL"
          onPress={handlePollCreate}
          isLoading={isLoading}
        />
        <Text color="gray.200" fontSize="sm" textAlign="center" px={10} mt={4}>
          After creating your poll, you will receive a unique code that you can
          use to invite others! 🚀
        </Text>
      </VStack>
    </VStack>
  );
}
