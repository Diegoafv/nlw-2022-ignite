import cors from "@fastify/cors";
import { PrismaClient } from "@prisma/client";
import Fastify from "fastify";
import ShortUniqueId from "short-unique-id";
import { z } from "zod";

const prisma = new PrismaClient({
  log: ["query"],
});

async function bootstrap() {
  const fastify = Fastify({
    logger: true,
  });

  await fastify.register(cors, {
    origin: true,
    //in production:
    //origin: 'www.appsy.com',
  });

  //http://localhost:3333/polls/count

  //Route to get the polls count
  fastify.get("/polls/count", async () => {
    const count = await prisma.poll.count();

    return { count };
  });

  //Route to get the users count
  fastify.get("/users/count", async () => {
    const count = await prisma.user.count();

    return { count };
  });

  //Route to get the guesses count
  fastify.get("/guesses/count", async () => {
    const count = await prisma.guess.count();

    return { count };
  });

  //Route to create a poll
  fastify.post("/polls", async (request, reply) => {
    const createPollBody = z.object({
      title: z.string(),
    });

    //Parse to avoid type problems
    const { title } = createPollBody.parse(request.body);

    const generate = new ShortUniqueId({ length: 6 });
    const code = String(generate()).toUpperCase();

    await prisma.poll.create({
      data: {
        title,
        code,
      },
    });

    return reply.status(201).send({ code });
  });

  await fastify.listen({ port: 3333 /*host: "0.0.0.0"*/ });
}

bootstrap();
