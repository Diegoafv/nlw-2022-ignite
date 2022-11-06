import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { authenticate } from "../plugins/authenticate";

export async function guessRoutes(fastify: FastifyInstance) {
  //Route to get the guesses count
  fastify.get("/guesses/count", async () => {
    const count = await prisma.guess.count();

    return { count };
  });

  fastify.post(
    "/polls/:pollId/games/:gameId/guesses",
    {
      onRequest: [authenticate],
    },
    async (request, reply) => {
      const createGuessParams = z.object({
        pollId: z.string(),
        gameId: z.string(),
      });

      const createGuessBody = z.object({
        firstTeamPoints: z.number(),
        secondTeamPoints: z.number(),
      });

      const { pollId, gameId } = createGuessParams.parse(request.params);
      const { firstTeamPoints, secondTeamPoints } = createGuessBody.parse(
        request.body
      );

      //-----------------VALIDATING----------------------

      const participant = await prisma.participant.findUnique({
        where: {
          //union userid and pollid
          userId_pollId: {
            pollId,
            userId: request.user.sub,
          },
        },
      });

      if (!participant) {
        return reply.status(400).send({
          message: "You're not allowed to send a guess to this poll.",
        });
      }

      //Check if there's already a guess for this poll sent by this user
      const guess = await prisma.guess.findUnique({
        where: {
          participantId_gameId: {
            participantId: participant.id,
            gameId,
          },
        },
      });

      //if it finds a guess, it means the user already submitted their guess
      if (guess) {
        return reply.status(400).send({
          message:
            "You've already submitted your guess for this game in this poll.",
        });
      }

      const game = await prisma.game.findUnique({
        where: {
          id: gameId,
        },
      });

      if (!game) {
        return reply.status(400).send({
          message: "Game not found.",
        });
      }

      if (game.date < new Date()) {
        return reply.status(400).send({
          message: "You cannot send your guess passed the game date.",
        });
      }

      //If the code gets here, then it's ok for the user to submit the guess
      await prisma.guess.create({
        data: {
          gameId,
          participantId: participant.id,
          firstTeamPoints,
          secondTeamPoints,
        },
      });

      return reply.status(201).send();
    }
  );
}
