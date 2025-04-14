import type { FastifyRequest } from 'fastify'
import { Injectable, NestMiddleware, Param, Req } from '@nestjs/common'
import { AuthenticationMiddleware } from './AuthenticationMiddleware'
import { UserMissingCustomerPermissionsException } from '../exceptions/auth/UserMissingCustomerPermissionsException'
import { CustomerUsersService } from 'src/customerUsers/customerUsers.service'
import { PrismaService } from 'src/database/prisma.service'

/**
 * Verifica se o usuário está autenticado através do token JWT enviado no Bearer Authorization
 */
@Injectable()
export class CustomerAuthorizationMiddleware implements NestMiddleware {
    constructor(private readonly prisma: PrismaService, private readonly customerUsers: CustomerUsersService) { }

    async use(@Req() request: FastifyRequest) {
        const user = await new AuthenticationMiddleware(this.prisma).use(request)
        const params = request.params as Record<string, any>
        const customerId = params?.customerId

        if (!customerId) {
            throw new Error("Param not found")
        }


        const customerUser = await this.customerUsers.get(user.id, customerId)

        console.log("customerUser", customerUser)

        if (!customerUser) throw new UserMissingCustomerPermissionsException

        return user
    }
}
