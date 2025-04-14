import { PartialType } from '@nestjs/mapped-types';
import { CreateCustomerDto } from './create-customer.dto';

export class UpdateCompanyDto extends PartialType(CreateCustomerDto) {
    paymentPlatformId: string
}
