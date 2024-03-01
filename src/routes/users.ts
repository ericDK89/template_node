import { register } from '@/http/controllers/register'
import { FastifyInstance } from 'fastify'

export const usersRoutes = async (app: FastifyInstance) => {
  app.post('/users', register)
}
