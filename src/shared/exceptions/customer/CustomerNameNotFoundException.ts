import { createError } from '@fastify/error'

export const CustomerNameNotFoundException = createError(
    'ERR_CUSTOMER_NAME_NOT_FOUND',
    'Nome do cliente não encontrado',
    400,
)
