import { Category, Condition, Employee, Property } from '@prisma/client'
import type { JWTPayload as JoseJWTPayload } from 'jose'

export type LoginFormState = {
    errors?: {
        email?: 'Email is required'
        password?: 'Password is required'
        token?: 'Token is not valid' | 'Token is required'
    }
    message?: string
    status: LoginFormStatus
    refreshToken?: string
}

export enum LoginFormStatus {
    pending,
    auth,
    success,
    error,
}

export interface JWTPayload extends JoseJWTPayload {
    /**
     * Id of the user
     */
    sub: Exclude<JoseJWTPayload['sub'], undefined>
    /**
     * Role as numeric string
     */
    role: string
    name: string
    type: AuthTypes
}
export interface RefreshTokenPayload extends JoseJWTPayload {
    /**
     * Id of the user
     */
    sub: Exclude<JoseJWTPayload['sub'], undefined>
    type: AuthTypes
    /**
     * Id of the device
     */
    device_id: string
}

export enum AuthTypes {
    /**
     * Significa que ya esta autenticado
     */
    session = 'session',
    /**
     * Es el Refresh Token
     */
    refresh = 'refresh',
}
export type ValidationPasswordMessageErrors =
    | 'Password must contain at least one capital letter'
    | 'Password must contain at least one number'
    | 'Password must contain at least one special character like a !@#$%^&*'
    | 'Password must be at least 10 characters long'

export type CreateEmployeeFormState = {
    errors?: {
        email?: 'Email is required' | 'Invalid email'
        name?: 'Name is required' | 'Invalid name'
        phone?: 'Phone is required' | 'Invalid phone'
        role?: 'Role is required' | 'Invalid role'
        address?: 'Invalid address'
        confirmPassword?:
            | 'Confirm password is required'
            | 'Passwords do not match'
        password?:
            | 'Password is required'
            | 'Invalid password'
            | ValidationPasswordMessageErrors
        root?: 'Password is incorrect' | 'Needs Root authorization'
    }
    message?: string
    status: CreateEmployeeFormStatus
    step: 1 | 2 | 3 | 4
    states: {
        email: string
        name: string
        phone: string
        role: string
        address?: string
        password: string
        confirmPassword: string
        root: string
    }
}

export enum CreateEmployeeFormStatus {
    /**
     * Estado por defecto en el formulario
     */
    pending,
    /**
     * Estado finalizado correctamente
     */
    success,
    /**
     * Estado de error, algo paso mal
     */
    error,
}

export type ChangePasswordFormState = {
    message?: 'You do not have permissions for this' | 'Something went wrong'
    errors?: {
        'current-password'?: 'Password is required' | 'Invalid password'
        'new-password'?:
            | 'Invalid password'
            | 'Password is required'
            | ValidationPasswordMessageErrors
        'confirm-password'?: 'Passwords do not match'
        totp?: 'TOTP is required' | 'Invalid TOTP code'
    }
    states: {
        'current-password': string
        'new-password': string
        'confirm-password': string
        totp: string
    }
    status: ChangePasswordFormStatus
}

export enum ChangePasswordFormStatus {
    /**
     * Estado por defecto en el formulario
     */
    pending,
    /**
     * Estado finalizado correctamente
     */
    success,
    /**
     * Estado de error, algo paso mal
     */
    error,
    /**
     * Estado de autenticacion, necesita totp
     */
    auth,
}

export type Setup2FAFormState = {
    message?: 'Something went wrong'
    errors?: {
        token?: 'Token is required' | 'Invalid Token code'
    }
    states: {
        token: string
        secret: string
    }
    status: Setup2FAFormStatus
}

export enum Setup2FAFormStatus {
    /**
     * Estado por defecto en el formulario
     */
    pending,
    /**
     * Estado finalizado correctamente
     */
    success,
    /**
     * Estado de error, algo paso mal
     */
    error,
}

export type ValidationResult<
    Errors extends Record<string, string> | undefined,
> = {
    errors?: Partial<Errors>
    isValid: boolean
}

export type PropertyForPropertyPage = Pick<
    Property,
    | 'title'
    | 'description'
    | 'bathrooms'
    | 'rooms'
    | 'parkings'
    | 'terrain_area'
    | 'construction_area'
    | 'private_area'
    | 'created_at'
    | 'category_id'
    | 'condition_id'
>

export type PropertyForIDB = SanitizeForIDB<
    PropertyForPropertyPage &
        Pick<
            Omit<Property, keyof PropertyForPropertyPage>,
            'id' | 'agent_id' | 'public_property_registry' | 'publish_status'
        >
>

export type EmployeeForIDB = SanitizeForIDB<
    Pick<Employee, 'id' | 'name' | 'email' | 'phone' | 'role'>
>

type SanitizeForIDB<T extends object> = {
    [K in keyof T]: T[K] extends bigint ? string
    : T[K] extends Date ? number
    : T[K] extends object ? SanitizeForIDB<T[K]>
    : T[K]
}

export type CategoryForIDB = SanitizeForIDB<
    Category & {
        sync: boolean
    }
>

export type ConditionForIDB = SanitizeForIDB<
    Condition & {
        sync: boolean
    }
>
