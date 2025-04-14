import { IsEnum, IsNumber, IsOptional, IsPositive, IsString } from "class-validator"

export class CreatePaymentAccountDto {
    @IsString()
    mobilePhone: string

    @IsPositive()
    incomeValue: number

    @IsString()
    address: string

    @IsNumber()
    adressNumber: number

    @IsString()
    province: string

    @IsString()
    postalCode: string

    @IsOptional()
    @IsString()
    birthDate?: string

    @IsOptional()
    @IsEnum(['MEI', 'LIMITED', 'INDIVIDUAL', 'ASSOCIATION'])
    companyType?: 'MEI' | 'LIMITED' | 'INDIVIDUAL' | 'ASSOCIATION'

    @IsOptional()
    @IsString()
    complement?: string

}