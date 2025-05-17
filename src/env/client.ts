if (!process.env.NEXT_PUBLIC_SNOWFLAKE_DATE)
    throw new Error('NEXT_PUBLIC_SNOWFLAKE_DATE in .env is required')
export const NEXT_PUBLIC_SNOWFLAKE_DATE = process.env.NEXT_PUBLIC_SNOWFLAKE_DATE
