export const API_ERRORS = {
    DATABASE_INITIALIZATION_ERROR: 'Database initialization error',
} as const

export type ApiError = (typeof API_ERRORS)[keyof typeof API_ERRORS]

export const GET_DEFAULT_LAB_ID_ERROR = {
    DATABASE_INITIALIZATION_ERROR: API_ERRORS.DATABASE_INITIALIZATION_ERROR,
    GENERIC_ERROR: 'Failed to fetch default lab ID',
} as const
export type GetDefaultLabIdError =
    (typeof GET_DEFAULT_LAB_ID_ERROR)[keyof typeof GET_DEFAULT_LAB_ID_ERROR]

export const GET_DEFAULT_CC_ID_ERROR = {
    DATABASE_INITIALIZATION_ERROR: API_ERRORS.DATABASE_INITIALIZATION_ERROR,
    GENERIC_ERROR: 'Failed to fetch default CC ID',
} as const
