import { Pressable, Row, Text } from "native-base";
import { Share } from "react-native";

interface Props {
  code: string;
}

export function EmptyMyPollList({ code }: Props) {
  async function handleCodeShare() {
    await Share.share({
      message: code,
    });
  }

  return (
    <Row flexWrap="wrap" justifyContent="center" p={4}>
      <Text color="gray.200" fontSize="sm">
        This poll has no participants yet, do you want to
      </Text>

      <Pressable onPress={() => {}}>
        <Text
          textDecorationLine="underline"
          color="yellow.500"
          textDecoration="underline"
        >
          share its unique code
        </Text>
      </Pressable>

      <Text color="gray.200" fontSize="sm" mx={1}>
        with others?
      </Text>

      <Text color="gray.200" mr={1}>
        Use the code
      </Text>

      <Text
        color="gray.200"
        fontSize="sm"
        textAlign="center"
        fontFamily="heading"
      >
        {code}
      </Text>
    </Row>
  );
}
