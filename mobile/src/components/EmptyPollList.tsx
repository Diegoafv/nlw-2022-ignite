import { useNavigation } from "@react-navigation/native";
import { Pressable, Row, Text } from "native-base";

export function EmptyPollList() {
  const { navigate } = useNavigation();

  return (
    <Row flexWrap="wrap" justifyContent="center">
      <Text color="white" fontSize="sm" textAlign="center">
        You're still not participating in any polls, do you want to
      </Text>

      <Pressable onPress={() => navigate("find")}>
        <Text
          textDecorationLine="underline"
          color="yellow.500"
          textDecoration="underline"
        >
          search for a code
        </Text>
      </Pressable>

      <Text color="white" fontSize="sm" textAlign="center" mx={1}>
        or
      </Text>

      <Pressable onPress={() => navigate("new")}>
        <Text textDecorationLine="underline" color="yellow.500">
          create a new poll
        </Text>
      </Pressable>

      <Text color="white" fontSize="sm" textAlign="center">
        ?
      </Text>
    </Row>
  );
}
