import { env } from '@/env.mjs'
import { createHash, randomBytes } from 'crypto'

export const hashToken = (token: string) => {
  return createHash('sha256').update(`${token}${env.TOKEN_SECRET}`).digest('hex')
}

export { randomBytes }
