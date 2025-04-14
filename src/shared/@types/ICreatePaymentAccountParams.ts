export interface ICreatePaymentAccountParams {
    cpfCnpj: string
    name: string
    mobilePhone: string
    incomeValue: number
    address: string
    adressNumber: number
    province: string
    postalCode: string
    birthDate?: string
    companyType?: 'MEI' | 'LIMITED' | 'INDIVIDUAL' | 'ASSOCIATION'
    complement?: string
    email: string
}