import { Controller, Get, Post, Body, Patch, Param, Delete, Res } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCompanyDto } from './dto/update-customer.dto';
import { UserService } from 'src/user/user.service';
import { CustomerUsersService } from 'src/customerUsers/customerUsers.service';
import { ONE_YEAR_IN_SECONDS } from 'src/shared/utils/constants';
import ResponseService from 'src/shared/services/response.service';
import type { FastifyReply } from 'fastify'
import PaymentService from 'src/shared/services/payment.service';
import { CreatePaymentAccountDto } from './dto/create-payment-account.dto';
import { Customer } from '@prisma/client';

@Controller('customer')
export class CustomerController {
  constructor(private readonly customerService: CustomerService, private readonly userService: UserService, private readonly customerUsers: CustomerUsersService) { }

  @Post()
  async create(@Res({ passthrough: true }) res: FastifyReply, @Body() createCustomerDto: CreateCustomerDto) {
    const customer = await this.customerService.create(createCustomerDto);

    const { accessToken, refreshToken, user: createdUser } = await this.userService.create(createCustomerDto);

    await this.customerUsers.create({
      userId: createdUser.id,
      customerId: customer.id,
    })

    res.setCookie('jwt_token', accessToken, {
      maxAge: ONE_YEAR_IN_SECONDS,
      sameSite: 'none',
      secure: true,
      path: "/",
      httpOnly: false
    })

    res.setCookie('jwt_refresh_token', refreshToken, {
      maxAge: ONE_YEAR_IN_SECONDS,
      sameSite: 'none',
      secure: true,
      path: "/",
      httpOnly: false
    })

    ResponseService.send({
      reply: res,
      data: customer,
      message: 'Customer criado',
      statusCode: 201
    })

    // TO-DO Email de boas vindas após 30 minutos
  }

  @Post("create-payment-account/:customerId")
  async createAsaasSubaccount(@Param('customerId') customerId: string, @Res({ passthrough: true }) res: FastifyReply, @Body() params: CreatePaymentAccountDto) {
    const customer = await this.customerService.findOne(customerId) as Customer

    const createAccountParams = {
      ...params,
      cpfCnpj: customer.cpfCnpj,
      name: customer.name,
      email: customer.email
    }

    const { id } = await PaymentService.createAccount(createAccountParams)

    await this.customerService.update(customerId, {
      paymentPlatformId: id
    })

    ResponseService.send({
      reply: res,
      message: 'Conta de pagamentos criada',
      statusCode: 201
    })
  }

  @Get()
  async findAll(@Res({ passthrough: true }) res: FastifyReply) {
    const customers = await this.customerService.findAll();

    ResponseService.send({
      reply: res,
      data: customers,
    })
  }

  @Get(':id')
  findOne(@Res({ passthrough: true }) res: FastifyReply, @Param('id') id: string) {
    const customer = this.customerService.findOne(id);

    if (!customer) {
      return ResponseService.send({
        reply: res,
        message: 'Customer não encontrado',
        statusCode: 404
      })
    }

    return ResponseService.send({
      reply: res,
      data: {
        customer
      }
    })
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCompanyDto: UpdateCompanyDto) {
    return this.customerService.update(id, updateCompanyDto);
  }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.customerService.block(id);
  // }
}
