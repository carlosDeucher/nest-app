import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CustomerController } from './customer.controller';
import { PrismaService } from 'src/database/prisma.service';
import { UserService } from 'src/user/user.service';
import { CustomerUsersService } from 'src/customerUsers/customerUsers.service';
import { CustomerAuthorizationMiddleware } from 'src/shared/middlewares/CustomerAuthorizationMiddleware';

@Module({
  controllers: [CustomerController],
  providers: [CustomerService, PrismaService, UserService, CustomerUsersService],
})
export class CustomerModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CustomerAuthorizationMiddleware).forRoutes({ path: "/customer/:customerId", method: RequestMethod.POST })
  }
}
