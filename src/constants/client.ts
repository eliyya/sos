export const APP_NAME = 'SOS'

export const IDB_NAME = APP_NAME + '_idb'

export const HEADERS = {
    PATHNAME: 'pathname',
} as const

export const LOCAL_STORAGE = {
    DEVICE_ID: 'device-id',
} as const

export const DEFAULT_ROLES = {
    ADMIN: 'Admin',
    USER: 'User',
    DELETED: 'Deleted',
} as const
