import axios from "axios"
import { ICreatePaymentAccountResponse } from "../@types/ICreatePaymentAccountResponse"
import { EnvVarNotFoundException } from "../exceptions/config/EnvVarNotFoundException"
import { ICreatePaymentAccountParams } from "../@types/ICreatePaymentAccountParams"

interface PaymentService {
    paymentApiKey: string
    paymentApiBaseUrl: string
}

class PaymentService {
    constructor() {
        const paymentApiKey = process.env.ASAAS_API_KEY
        const paymentApiBaseUrl = process.env.ASAAS_BASE_URL

        if (!paymentApiKey) throw new EnvVarNotFoundException('ASAAS_API_KEY')
        if (!paymentApiBaseUrl) throw new EnvVarNotFoundException('ASAAS_BASE_URL')

        this.paymentApiKey = paymentApiKey
        this.paymentApiBaseUrl = paymentApiBaseUrl
    }

    async createAccount(params: ICreatePaymentAccountParams) {
        // Cria no ASAAS
        const response: { data: ICreatePaymentAccountResponse } = await axios.post(`${this.paymentApiBaseUrl}/accounts/`, params, {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                access_token: this.paymentApiKey,
            },
        })

        return { id: response.data.id }
    }
}


export default new PaymentService()