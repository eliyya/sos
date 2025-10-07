import {
    PermissionsBitField,
    PERMISSIONS_FLAGS,
} from '../bitfields/PermissionsBitField.ts'

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

export const DEFAULT_PERMISSIONS = {
    ADMIN: PermissionsBitField.getMask(),
    USER: PERMISSIONS_FLAGS.SESSION_SELF | PERMISSIONS_FLAGS.CAN_LOGIN,
    DELETED: 0n,
} as const

export const DB_STATES = {
    ROLES_COUNT: 'roles_count',
} as const
