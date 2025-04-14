import { IsUUID } from "class-validator";

export class CreateCustomerUsersDto {

    @IsUUID()
    userId: string;

    @IsUUID()
    customerId: string;
}
