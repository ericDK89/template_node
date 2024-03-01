import z from 'zod'
import { FastifyRequest as Req, FastifyReply as Reply } from 'fastify'
import { RegisterService } from '@/services/register'
import { PrismaUsersRepository } from '@/repositories/prisma-users-repository'
import { EmailAlreadyExistsError } from '@/services/errors/email-already-exists-error'

export const register = async (request: Req, reply: Reply) => {
  const registerBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
  })

  try {
    const { name, email, password } = registerBodySchema.parse(request.body)

    const prismaRepository = new PrismaUsersRepository()
    const registerService = new RegisterService(prismaRepository)

    await registerService.execute({ name, email, password })
  } catch (error) {
    if (error instanceof EmailAlreadyExistsError) {
      return reply.status(409).send({
        message: error.message,
      })
    }

    throw error
  }

  return reply.status(201).send()
}
