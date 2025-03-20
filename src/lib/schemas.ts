import { z } from 'zod'

export const UserSchema = z.object({
    id: z.string(),
    name: z.string(),
    roles: z.preprocess(
        i => (typeof i === 'string' ? BigInt(i) : i),
        z.bigint(),
    ),
    created_at: z.preprocess(
        i => (typeof i === 'string' || typeof i === 'number' ? new Date(i) : i),
        z.date(),
    ),
    username: z.string(),
})
