import { FlatList, useToast } from "native-base";
import { useEffect, useState } from "react";
import { api } from "../services/api";

import { EmptyMyPollList } from "../components/EmptyMyPollList";
import { Game, GameProps } from "../components/Game";
import { Loading } from "./Loading";

interface Props {
  pollId: string;
  code: string;
}

export function Guesses({ pollId, code }: Props) {
  const [games, setGames] = useState<GameProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [firstTeamPoints, setFirstTeamPoints] = useState("");
  const [secondTeamPoints, setSecondTeamPoints] = useState("");

  const toast = useToast();

  async function fetchGames() {
    try {
      setIsLoading(true);

      const response = await api.get(`/polls/${pollId}/games`);
      setGames(response.data.games);
    } catch (error) {
      console.log(error);
      toast.show({
        title: "We were not able to load your games, try again!",
        placement: "top",
        bgColor: "red.500",
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function handleGuessConfirm(gameId: string) {
    try {
      if (!firstTeamPoints.trim() || !secondTeamPoints.trim) {
        return toast.show({
          title: "Please enter a valid score and try again!",
          placement: "top",
          bgColor: "red.500",
        });
      }

      await api.post(`/polls/${pollId}/games/${gameId}/guesses`, {
        firstTeamPoints: Number(firstTeamPoints),
        secondTeamPoints: Number(secondTeamPoints),
      });

      toast.show({
        title: "Your guess has been successfully submitted!",
        placement: "top",
        bgColor: "green.500",
      });
      fetchGames();
    } catch (error) {
      console.log(error);
      toast.show({
        title: "We were not able to register your guess, please try again!",
        placement: "top",
        bgColor: "red.500",
      });
    } finally {
    }
  }

  useEffect(() => {
    fetchGames();
  }, [pollId]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <FlatList
      data={games}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <Game
          data={item}
          setFirstTeamPoints={setFirstTeamPoints}
          setSecondTeamPoints={setSecondTeamPoints}
          onGuessConfirm={() => handleGuessConfirm(item.id)}
        />
      )}
      _contentContainerStyle={{ pb: 10 }}
      ListEmptyComponent={() => <EmptyMyPollList code={code} />}
    />
  );
}
