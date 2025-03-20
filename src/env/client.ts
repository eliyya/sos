// if (!process.env.NEXT_PUBLIC_SENTRY_DSN)
//     throw new Error('NEXT_PUBLIC_SENTRY_DSN in .env is required')
// export const NEXT_PUBLIC_SENTRY_DSN = process.env.NEXT_PUBLIC_SENTRY_DSN

if (!process.env.NEXT_PUBLIC_VERCEL_URL)
    throw new Error('NEXT_PUBLIC_VERCEL_URL in .env is required')
export const NEXT_PUBLIC_VERCEL_URL = process.env.NEXT_PUBLIC_VERCEL_URL

if (!process.env.NEXT_PUBLIC_SNOWFLAKE_DATE)
    throw new Error('NEXT_PUBLIC_SNOWFLAKE_DATE in .env is required')
export const NEXT_PUBLIC_SNOWFLAKE_DATE = process.env.NEXT_PUBLIC_SNOWFLAKE_DATE
