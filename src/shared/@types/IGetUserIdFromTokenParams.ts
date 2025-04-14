import type { FastifyRequest } from 'fastify'

export interface IGetUserIdFromTokenParams {
  request: FastifyRequest
  isRefreshToken?: boolean
}
