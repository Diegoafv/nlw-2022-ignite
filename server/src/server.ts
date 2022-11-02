import cors from "@fastify/cors";
import { PrismaClient } from "@prisma/client";
import Fastify from "fastify";

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

  fastify.get("/polls/count", async () => {
    const count = await prisma.poll.count();

    return { count };
  });

  /*fastify.get("/polls/D", async () => {
    const polls = await prisma.poll.findMany({
      where: {
        code: {
          startsWith: "D",
        },
      },
    });

    return { polls };
  });*/

  await fastify.listen({ port: 3333 /*host: "0.0.0.0"*/ });
}

bootstrap();
