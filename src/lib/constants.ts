import { Snowflake } from '@sapphire/snowflake'

export const HEADERS = {
    PATHNAME: 'pathname',
}
export const COOKIES = {
    SESSION: 'sos-session',
}
export const snowflake = new Snowflake(new Date(2024, 11, 20))

export const JWT_SECRET = new TextEncoder().encode(process.env.NEXT_JWT_SECRET)
