import type { IVerifyTokenParams } from '../@types/IVerifyTokenParams.js'
import type { IGetUserIdFromTokenParams } from '../@types/IGetUserIdFromTokenParams.js'
import { sign as jwtSign, verify as jwtVerify } from 'jsonwebtoken'
import { InvalidCredentialsException } from '../../shared/exceptions/auth/InvalidCredentialsException.js'
import { EnvVarNotFoundException } from 'src/shared/exceptions/config/EnvVarNotFoundException'
import { StringValue } from "ms"

class TokenService {
  /**
   * Gera um token de autenticação com durabilidade curta
   * Utilizado para autenticar o usuário em cada requisição
   */
  static generateAccessToken(userId: string) {
    const accessTokenSecret = process.env.JWT_ACCESS_TOKEN_SECRET
    const accessTokenExpiresIn = process.env.JWT_ACCESS_TOKEN_EXPIRES_IN

    if (!accessTokenSecret)
      throw new EnvVarNotFoundException('JWT_ACCESS_TOKEN_SECRET')
    if (!accessTokenExpiresIn)
      throw new EnvVarNotFoundException('JWT_ACCESS_TOKEN_EXPIRES_IN')

    const accessToken = jwtSign(
      {
        id: userId,
      },
      accessTokenSecret,
      {
        subject: userId,
        // expiresIn: accessTokenExpiresIn as StringValue,
        expiresIn: "1y"
      },
    )

    return accessToken
  }

  /**
   * Gera um token de autenticação com durabilidade longa
   * Utilizado para trocar por um novo access token quando o atual expirar
   */
  static generateRefreshToken(userId: string) {
    const refreshTokenSecret = process.env.JWT_REFRESH_TOKEN_SECRET
    const refreshTokenExpiresIn = process.env.JWT_REFRESH_TOKEN_EXPIRES_IN

    if (!refreshTokenSecret)
      throw new EnvVarNotFoundException('JWT_REFRESH_TOKEN_SECRET')
    if (!refreshTokenExpiresIn)
      throw new EnvVarNotFoundException('JWT_REFRESH_TOKEN_EXPIRES_IN')

    const refreshToken = jwtSign(
      {
        id: userId,
      },
      refreshTokenSecret,
      {
        subject: userId,
        expiresIn: refreshTokenExpiresIn as StringValue,
      },
    )

    return refreshToken
  }

  /**
   * Verifica se o token é válido e retorna a payload dele
   */
  static verify({ token, type = 'access', customSecret }: IVerifyTokenParams) {
    let tokenSecret: string | undefined = ''

    if (customSecret) {
      tokenSecret = customSecret
    } else if (type === 'access') {
      tokenSecret = process.env.JWT_ACCESS_TOKEN_SECRET
    } else if (type === 'refresh') {
      tokenSecret = process.env.JWT_REFRESH_TOKEN_SECRET
    }

    if (!tokenSecret)
      throw new EnvVarNotFoundException(
        'JWT_ACCESS_TOKEN_SECRET | JWT_REFRESH_TOKEN_SECRET',
      )

    try {
      const payload = jwtVerify(token, tokenSecret)
      return payload
    } catch (error) {
      throw new InvalidCredentialsException()
    }
  }

  /**
   * Verifica se é válido e pega o id do usuário a partir do token de autenticação
   */
  static getUserIdFromToken({
    request,
    isRefreshToken = false,
  }: IGetUserIdFromTokenParams) {
    const authHeader = request.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer '))
      throw new InvalidCredentialsException()

    const token = authHeader.split(' ')[1]

    if (!token) throw new InvalidCredentialsException()

    try {
      const jwtPayload = TokenService.verify({
        token,
        type: isRefreshToken ? 'refresh' : 'access',
      })

      return jwtPayload.sub as string
    } catch (error) {
      throw new InvalidCredentialsException()
    }
  }
}

export default TokenService
