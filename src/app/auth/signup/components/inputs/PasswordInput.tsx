'use client'

import { useAtom, useSetAtom } from 'jotai'
import { RectangleEllipsisIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { CompletInput } from '@/components/Inputs'
import {
    passwordAtom,
    passwordErrorAtom,
    passwordFocusAtom,
} from '@/global/signup'

export function PasswordInput() {
    const t = useTranslations('app.auth.login.components.loginForm')
    const [pass, setUsername] = useAtom(passwordAtom)
    const [error, setError] = useAtom(passwordErrorAtom)
    const setFocus = useSetAtom(passwordFocusAtom)

    return (
        <CompletInput
            required
            label={t('pass')}
            type='password'
            name='password'
            placeholder={t('username-placeholder')}
            onFocus={() => setFocus(true)}
            onBlur={() => setFocus(false)}
            value={pass}
            error={error}
            onChange={e => {
                const password = e.target.value
                setUsername(e.target.value)
                setError('')
                if (!password) return
                if (!/[A-Z]/.test(password))
                    return {
                        password:
                            'La contraseña debe contener al menos una mayúscula',
                    }
                if (!/[0-9]/.test(password))
                    return {
                        password:
                            'La contraseña debe contener al menos un número',
                    }
                if (!/[!@#$%^&*]/.test(password))
                    return {
                        password:
                            'La contraseña debe contener al menos un carácter especial como !@#$%^&*',
                    }
                if (password.length < 10)
                    return {
                        password:
                            'La contraseña debe tener al menos 10 caracteres',
                    }
            }}
            icon={RectangleEllipsisIcon}
        />
    )
}
