import { Injectable } from '@nestjs/common';
import { CreateCustomerUsersDto } from './dto/create-customer-users.dto';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class CustomerUsersService {
    constructor(private readonly prisma: PrismaService) { }
    async create(createCustomerUsersDto: CreateCustomerUsersDto) {
        const { userId, customerId } = createCustomerUsersDto

        await this.prisma.customerUser.create({
            data: {
                userId,
                customerId,
            },
        });
    }

    async get(userId: string, customerId: string) {
        return this.prisma.customerUser.findFirst({
            where: {
                userId,
                customerId,
            },
        })
    }
}
