export const HEADERS = {
    PATHNAME: 'pathname',
}
export const COOKIES = {
    SESSION: 'sos-session',
    REFRESH: 'sos-refresh',
}
export const LOCAL_STORAGE = {
    DEVICE_ID: 'device-id',
}

export const JWT_SECRET = new TextEncoder().encode(process.env.NEXT_JWT_SECRET)

export const ALGORITHM = 'aes-256-cbc'
