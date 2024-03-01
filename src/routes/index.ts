import { FastifyInstance } from 'fastify'
import { usersRoutes } from './users'

export const routes = async (app: FastifyInstance) => {
  app.register(usersRoutes)
}
