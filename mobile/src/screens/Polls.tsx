import { Octicons } from "@expo/vector-icons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { FlatList, Icon, useToast, VStack } from "native-base";
import { useCallback, useEffect, useState } from "react";

import { api } from "../services/api";

import { Button } from "../components/Button";
import { EmptyPollList } from "../components/EmptyPollList";
import { Header } from "../components/Header";
import { Loading } from "../components/Loading";
import { PollCard, PollCardProps } from "../components/PollCard";

export function Polls() {
  const [isLoading, setIsLoading] = useState(true);
  const [polls, setPolls] = useState([]);

  const { navigate } = useNavigation();
  const toast = useToast();

  async function fetchPolls() {
    try {
      setIsLoading(true);
      const response = await api.get("/polls");
      setPolls(response.data.polls);
    } catch (error) {
      console.log(error);
      toast.show({
        title: "We were not able to load your polls, try again!",
        placement: "top",
        bgColor: "red.500",
      });
    } finally {
      setIsLoading(false);
    }
  }

  //executes every time the interface receives the focus
  //useCallback guarantees that the function will not be executed multiple times (performance)
  useFocusEffect(
    useCallback(() => {
      fetchPolls();
    }, [])
  );

  return (
    <VStack flex={1} bgColor="gray.900">
      <Header title="My polls" onShare={() => {}}/>

      <VStack
        mt={6}
        mx={5}
        borderBottomWidth={1}
        borderBottomColor="gray.600"
        pb={4}
        mb={4}
      >
        <Button
          title="SEARCH POLL"
          leftIcon={
            <Icon as={Octicons} name="search" color="black" size="md" />
          }
          onPress={() => navigate("find")}
        />
      </VStack>

      {isLoading ? (
        <Loading />
      ) : (
        <FlatList
          data={polls}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <PollCard
              data={item}
              onPress={() => navigate("details", { id: item.id })}
            />
          )}
          px={5}
          showsVerticalScrollIndicator={false}
          _contentContainerStyle={{ pb: 10 }}
          ListEmptyComponent={() => <EmptyPollList />}
        />
      )}
    </VStack>
  );
}
