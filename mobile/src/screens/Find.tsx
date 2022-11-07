import { Heading, useToast, VStack } from "native-base";
import { useState } from "react";

import { api } from "../services/api";

import { Button } from "../components/Button";
import { Header } from "../components/Header";
import { Input } from "../components/Input";

import { useNavigation } from "@react-navigation/native";

export function Find() {
  const [isLoading, setIsLoading] = useState(false);
  const [code, setCode] = useState("");

  const toast = useToast();

  const { navigate } = useNavigation();

  async function handleJoinPoll() {
    try {
      setIsLoading(true);

      if (!code.trim()) {
        return toast.show({
          title: "Enter the code.",
          placement: "top",
          bgColor: "red.500",
        });
      }
      await api.post("/polls/join", { code });

      toast.show({
        title: "You are now participating in this poll!",
        placement: "top",
        bgColor: "green.500",
      });

      navigate("polls");
    } catch (error) {
      console.log(error);
      setIsLoading(false);
      if (error.response?.data?.message === "Poll not found.") {
        return toast.show({
          title: "Poll not found.",
          placement: "top",
          bgColor: "red.500",
        });
      }

      if (
        error.response?.data?.message === "You have already joined this poll!"
      ) {
        return toast.show({
          title: "You have already joined this poll!",
          placement: "top",
          bgColor: "red.500",
        });
      }

      toast.show({
        title: "We couldn't find any poll with that code!",
        placement: "top",
        bgColor: "red.500",
      });
    }
  }

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
        <Input
          mb={2}
          placeholder="Enter the code..."
          onChangeText={setCode}
          autoCapitalize="characters"
        />

        <Button
          title="SEARCH POLL"
          isLoading={isLoading}
          onPress={handleJoinPoll}
        />
      </VStack>
    </VStack>
  );
}
