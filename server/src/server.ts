import cors from "@fastify/cors";
import jwt from "@fastify/jwt";
import Fastify from "fastify";

import ShortUniqueId from "short-unique-id";
import { z } from "zod";
import { authRoutes } from "./routes/auth";
import { gameRoutes } from "./routes/game";
import { guessRoutes } from "./routes/guess";
import { pollRoutes } from "./routes/poll";
import { userRoutes } from "./routes/user";

async function bootstrap() {
  const fastify = Fastify({
    logger: true,
  });

  await fastify.register(cors, {
    origin: true,
    //in production:
    //origin: 'www.appsy.com',
  });

  await fastify.register(jwt, {
    secret: "nlwcopa",
    //in production: THIS SHOULD BE A TOKEN AS AN ENVIRONMENT VARIABLE
  });

  //http://localhost:3333/polls/count

  await fastify.register(pollRoutes);
  await fastify.register(authRoutes);
  await fastify.register(gameRoutes);
  await fastify.register(guessRoutes);
  await fastify.register(userRoutes);

  await fastify.listen({ port: 3333, host: "0.0.0.0" });
}

bootstrap();
