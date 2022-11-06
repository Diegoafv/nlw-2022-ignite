import { FastifyInstance } from "fastify";
import ShortUniqueId from "short-unique-id";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { authenticate } from "../plugins/authenticate";

export async function pollRoutes(fastify: FastifyInstance) {
  //Route to get the polls count
  fastify.get("/polls/count", async () => {
    const count = await prisma.poll.count();
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

    try {
      await request.jwtVerify();
      //if it gets here, user is authenticated
      await prisma.poll.create({
        data: {
          title,
          code,
          ownerID: request.user.sub,

          participants: {
            create: {
              userId: request.user.sub,
            },
          },
        },
      });
    } catch {
      //user is not authenticated
      await prisma.poll.create({
        data: {
          title,
          code,
        },
      });
    }

    return reply.status(201).send({ code });
  });

  //Route to participate in a poll
  //The : in the request means we expect a dynamic information
  fastify.post("/polls/join", {
    onRequest: [authenticate]
  }, async (request, reply) => {
    const joinPollBody = z.object({
      code: z.string(),
    });
    const { code } = joinPollBody.parse(request.body);

    //Look for poll with the code received from the user
    const poll = await prisma.poll.findUnique({
      where: {
        code,
      },
      include: {
        participants: {
          where: {
            userId: request.user.sub, //If user is already participating in the poll
          }
        }
      }
    });
    if (!poll) {
      return reply.status(400).send({
        message: 'Poll not found.'
      });
    }

    //if this returns anything other than empty, it means the user was found in the 
    //   participants list
    if (poll.participants.length > 0){
      return reply.status(400).send({
        message: 'You have already joined this poll!'
      });
    }

    //If the poll has no owner, then the first user to join will be the poll owner
    if(!poll.ownerID) {
      await prisma.poll.update({
        where: {
          id: poll.id,
        },
        data: {
          ownerID: request.user.sub,
        }
      })
    }

    //If the code gets here, it means it's ok for the user to be added to the participants
    await prisma.participant.create({
      data: {
        pollId: poll.id,
        userId: request.user.sub,
      }
    });
    return reply.status(201).send();
  });
  
  //Route to get the polls the user participates in
  fastify.get('/polls', {
    onRequest: [authenticate]
  }, async (request) => {
    const polls = await prisma.poll.findMany({
      where: {
        participants: {
          some: {
            userId: request.user.sub,
          }
        }
      },
      //sends the info that wouldn't be included otherwise, like name, email and pic
      include: {
        _count: {
          select: {
            participants:true,
          }
        },
        participants:{
          select: {
            id: true,

            user: {
              select: {
                avatarUrl: true,
              }
            }
          },
          take: 4,
        },
        owner: {
          select: {
            id:true,
            name: true,
          }
        }
      }
    });
    return { polls };
  })

  //Route to get all the info/details about certain poll that the user selected
  fastify.get('/polls/:id', {
    onRequest: [authenticate],
  }, async (request) => {
    const getPollParams = z.object({
      id: z.string(),
    });
    const { id } = getPollParams.parse(request.params)

    const poll = await prisma.poll.findUnique({
      where: {
        id,
      },
      //sends the info that wouldn't be included otherwise, like name, email and pic
      include: {
        _count: {
          select: {
            participants:true,
          }
        },
        participants:{
          select: {
            id: true,

            user: {
              select: {
                avatarUrl: true,
              }
            }
          },
          take: 4,
        },
        owner: {
          select: {
            id:true,
            name: true,
          }
        }
      }
    });
    return { poll }
  });

}
