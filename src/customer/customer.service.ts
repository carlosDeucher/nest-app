import { Injectable } from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCompanyDto } from './dto/update-customer.dto';
import { PrismaService } from 'src/database/prisma.service';
import { CustomerNameNotFoundException } from 'src/shared/exceptions/customer/CustomerNameNotFoundException';

@Injectable()
export class CustomerService {
  constructor(private readonly prisma: PrismaService) { }
  async create(createCustomerDto: CreateCustomerDto) {
    const { companyName, fullName, cpfCnpj, email } = createCustomerDto;

    const isPessoaJuridica = cpfCnpj.length === 14;

    const name = isPessoaJuridica ? companyName : fullName;

    if (!name) {
      throw new CustomerNameNotFoundException;
    }

    const customerCreated = await this.prisma.customer.create({
      data: {
        isPessoaJuridica,
        name,
        email,
        cpfCnpj,
      }
    })

    return customerCreated
  }

  async findAll() {
    const customers = await this.prisma.customer.findMany()
    return customers
  }

  async findOne(id: string) {
    const customer = await this.prisma.customer.findUnique({
      where: {
        id,
      },
    })

    return customer;
  }

  update(id: string, updateCompanyDto: UpdateCompanyDto) {
    return this.prisma.customer.update({
      where: { id },
      data: updateCompanyDto
    });;
  }

  block(id: string) {
    return this.prisma.customer.update({
      where: { id },
      data: {
        status: "INACTIVE"
      }
    });
  }
}
