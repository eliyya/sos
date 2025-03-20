import { JWT_SECRET } from '../env/server.ts'

export const ENCODED_JWT_SECRET = new TextEncoder().encode(JWT_SECRET)
