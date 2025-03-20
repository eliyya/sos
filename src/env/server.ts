const {
    JWT_SECRET = '',
    ENCRYPTION_KEY = '',
    NODE_ENV = 'development',
} = process.env

if (!JWT_SECRET) throw new Error('JWT_SECRET in .env is required')
if (!ENCRYPTION_KEY) throw new Error('ENCRYPTION_KEY in .env is required')
if (!/^[0-9a-fA-F]{64}$/i.test(ENCRYPTION_KEY))
    throw new Error(
        'ENCRYPTION_KEY in .env must be a valid 64 characters hexadecimal string',
    )

export { JWT_SECRET, ENCRYPTION_KEY, NODE_ENV }
