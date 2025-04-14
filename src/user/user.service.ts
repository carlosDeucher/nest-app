import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from 'src/database/prisma.service';
import TokenService from 'src/shared/services/token.service';
import { hashSync } from 'bcryptjs';
import { User } from '@prisma/client';

type CreateUserResponse = {
    accessToken: string;
    refreshToken: string;
    user: User;
}

@Injectable()
export class UserService {
    constructor(private readonly prisma: PrismaService) { }
    async create(createUserDto: CreateUserDto): Promise<CreateUserResponse> {
        const { email, fullName, password } = createUserDto

        const saltRounds = 10
        const passwordHash = hashSync(password, saltRounds)

        const createdUser = await this.prisma.user.create({
            data: {
                email,
                fullName,
                passwordHash
            },
        });

        const accessToken = TokenService.generateAccessToken(createdUser.id)
        const refreshToken = TokenService.generateRefreshToken(createdUser.id)

        return { accessToken, refreshToken, user: createdUser }
    }
}
