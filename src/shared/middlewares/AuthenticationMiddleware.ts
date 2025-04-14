import type { FastifyRequest } from 'fastify'
import { EnvVarNotFoundException } from '../exceptions/config/EnvVarNotFoundException'
import { InvalidCredentialsException } from '../exceptions/auth/InvalidCredentialsException'
import TokenService from '../services/token.service'
import { PrismaClient } from '@prisma/client'
import { Injectable, NestMiddleware } from '@nestjs/common'

/**
 * Verifica se o usuário está autenticado através do token JWT enviado no Bearer Authorization
 */
@Injectable()
export class AuthenticationMiddleware implements NestMiddleware {
  constructor(private readonly prisma: PrismaClient) { }
  async use(request: FastifyRequest) {
    const authHeader = request.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer '))
      throw new InvalidCredentialsException()

    const token = authHeader.split(' ')[1]

    const accessTokenSecret = process.env.JWT_ACCESS_TOKEN_SECRET

    if (!accessTokenSecret)
      throw new EnvVarNotFoundException('JWT_ACCESS_TOKEN_SECRET')

    try {
      const payload = TokenService.verify({
        token,
        customSecret: accessTokenSecret,
      })

      if (!payload.sub) throw new InvalidCredentialsException()

      const user = await this.prisma.user.findUnique({
        where: {
          id: payload.sub as string,
        },
      })

      if (!user) throw new InvalidCredentialsException()

      request.headers.userId = user.id

      return user
    } catch (err) {
      throw new InvalidCredentialsException()
    }
  }
}
