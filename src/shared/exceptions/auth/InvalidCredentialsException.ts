import { createError } from '@fastify/error'

export const InvalidCredentialsException = createError(
  'ERR_INVALID_CREDENTIALS',
  'Credenciais inválidas',
  401,
)
