export interface ICreatePaymentAccountResponse {
  object: "account"
  id: string
  name: string
  email: string
  loginEmail: string
  phone: null | string
  mobilePhone: string
  address: string
  addressNumber: string
  complement: null | string
  province: string
  postalCode: string
  cpfCnpj: string
  birthDate: string
  personType: string
  companyType: null | string
  city: number
  state: string
  country: string
  site: null | string
  walletId: string
  apiKey: string
  accountNumber: {
    agency: string
    account: string
    accountDigit: string
  },
  incomeValue: number
  commercialInfoExpiration: null | string
}