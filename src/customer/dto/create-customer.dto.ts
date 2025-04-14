import { IsString, IsEmail, IsOptional, Matches } from "class-validator";

export class CreateCustomerDto {
    @IsEmail()
    email: string;

    @IsString()
    password: string;

    @IsString()
    @Matches(/^(\d{11}|\d{14})$/)
    cpfCnpj: string;

    @IsString()
    fullName: string;

    @IsOptional()
    @IsString()
    companyName?: string;
}
