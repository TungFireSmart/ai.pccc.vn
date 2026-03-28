import jwt from 'jsonwebtoken'
import { env } from './env.js'

export type AuthTokenPayload = {
  userId: string
  workspaceId: string
  role: string
}

export function signAuthToken(payload: AuthTokenPayload) {
  return jwt.sign(payload, env.jwtSecret, { expiresIn: '7d' })
}

export function verifyAuthToken(token: string) {
  return jwt.verify(token, env.jwtSecret) as AuthTokenPayload
}
