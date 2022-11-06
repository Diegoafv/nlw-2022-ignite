import { Octicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Icon, VStack } from "native-base";

import { Button } from "../components/Button";
import { Header } from "../components/Header";

export function Polls() {
  const { navigate } = useNavigation();

  return (
    <VStack flex={1} bgColor="gray.900">
      <Header title="My polls" />
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
    </VStack>
  );
}
