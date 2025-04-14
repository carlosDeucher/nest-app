import { createError } from '@fastify/error'

export const InvalidLoginMethodException = createError(
  'ERR_INVALID_LOGIN_METHOD',
  'Método de Login inválido',
  401,
)
