// if (!process.env.NEXT_PUBLIC_SENTRY_DSN)
//     throw new Error('NEXT_PUBLIC_SENTRY_DSN in .env is required')
// export const NEXT_PUBLIC_SENTRY_DSN = process.env.NEXT_PUBLIC_SENTRY_DSN

if (!process.env.NEXT_PUBLIC_VERCEL_URL)
    throw new Error('NEXT_PUBLIC_VERCEL_URL in .env is required')
export const NEXT_PUBLIC_VERCEL_URL = process.env.NEXT_PUBLIC_VERCEL_URL

if (!process.env.NEXT_PUBLIC_AGENCY)
    throw new Error('NEXT_PUBLIC_AGENCY in .env is required')
export const NEXT_PUBLIC_AGENCY = process.env.NEXT_PUBLIC_AGENCY

if (!process.env.NEXT_PUBLIC_AGENCY_EMAIL)
    throw new Error('NEXT_PUBLIC_AGENCY_EMAIL in .env is required')
export const NEXT_PUBLIC_AGENCY_EMAIL = process.env.NEXT_PUBLIC_AGENCY_EMAIL

if (!process.env.NEXT_PUBLIC_AGENCY_PHONE)
    throw new Error('NEXT_PUBLIC_AGENCY_PHONE in .env is required')
export const NEXT_PUBLIC_AGENCY_PHONE = process.env.NEXT_PUBLIC_AGENCY_PHONE

if (!process.env.NEXT_PUBLIC_AGENCY_STREET)
    throw new Error('NEXT_PUBLIC_AGENCY_STREET in .env is required')
export const NEXT_PUBLIC_AGENCY_STREET = process.env.NEXT_PUBLIC_AGENCY_STREET

if (!process.env.NEXT_PUBLIC_AGENCY_COL)
    throw new Error('NEXT_PUBLIC_AGENCY_COL in .env is required')
export const NEXT_PUBLIC_AGENCY_COL = process.env.NEXT_PUBLIC_AGENCY_COL

if (!process.env.NEXT_PUBLIC_AGENCY_CITY)
    throw new Error('NEXT_PUBLIC_AGENCY_CITY in .env is required')
export const NEXT_PUBLIC_AGENCY_CITY = process.env.NEXT_PUBLIC_AGENCY_CITY

if (!process.env.NEXT_PUBLIC_SNOWFLAKE_DATE)
    throw new Error('NEXT_PUBLIC_SNOWFLAKE_DATE in .env is required')
export const NEXT_PUBLIC_SNOWFLAKE_DATE = process.env.NEXT_PUBLIC_SNOWFLAKE_DATE

if (!process.env.NEXT_PUBLIC_SNOWFLAKE_WORKER_ID)
    throw new Error('NEXT_PUBLIC_SNOWFLAKE_WORKER_ID in .env is required')
export const NEXT_PUBLIC_SNOWFLAKE_WORKER_ID =
    process.env.NEXT_PUBLIC_SNOWFLAKE_WORKER_ID
