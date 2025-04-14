import { createError } from '@fastify/error'

export const UserMissingCustomerPermissionsException = createError(
  'ERR_NO_AUTHO',
  'Usuário sem permissões no customer',
  403,
)
