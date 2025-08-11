import type { JWTPayload as JoseJWTPayload } from 'jose'
import { auth } from '@/lib/auth'

export type LoginFormState = {
    errors?: {
        username?: 'Username is required'
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

export type CompleteSession = typeof auth.$Infer.Session
export type UserSession = CompleteSession['user']
export interface UserTokenPayload extends JoseJWTPayload {
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
