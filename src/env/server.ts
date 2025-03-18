const {
    JWT_SECRET = '',
    ENCRYPTION_KEY = '',
    MANAGER_EMAIL = '',
    MANAGER_PASSWORD = '',
    MANAGER_PHONE = '',
    MANAGER_NAME = '',
    NODE_ENV = 'development',
} = process.env

if (!JWT_SECRET) throw new Error('JWT_SECRET in .env is required')
if (!ENCRYPTION_KEY) throw new Error('ENCRYPTION_KEY in .env is required')
if (!/^[0-9a-fA-F]{64}$/i.test(ENCRYPTION_KEY))
    throw new Error(
        'ENCRYPTION_KEY in .env must be a valid 64 characters hexadecimal string',
    )
if (!MANAGER_EMAIL) throw new Error('MANAGER_EMAIL in .env is required')
if (!MANAGER_PASSWORD) throw new Error('MANAGER_PASSWORD in .env is required')
if (!MANAGER_PHONE) throw new Error('MANAGER_PHONE in .env is required')
if (!MANAGER_NAME) throw new Error('MANAGER_NAME in .env is required')

export {
    JWT_SECRET,
    ENCRYPTION_KEY,
    MANAGER_EMAIL,
    MANAGER_PASSWORD,
    MANAGER_PHONE,
    MANAGER_NAME,
    NODE_ENV,
}
