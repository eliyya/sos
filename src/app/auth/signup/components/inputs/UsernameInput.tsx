'use client'

import { useAtom, useSetAtom } from 'jotai'
import { AtSignIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'
import { CompletInput } from '@/components/Inputs'
import {
    usernameAtom,
    usernameErrorAtom,
    canSuggestUsernameAtom,
} from '@/global/signup'
import { authClient } from '@/lib/auth-client'


export function UsernameInput() {
    const t = useTranslations('app.auth.login.components.loginForm')
    const [username, setUsername] = useAtom(usernameAtom)
    const [error, setError] = useAtom(usernameErrorAtom)
    const setCanSuggestUsername = useSetAtom(canSuggestUsernameAtom)
    const [focus, setFocus] = useState(false)

    useEffect(() => {
        const handler = setTimeout(async () => {
            if (!username) return
            const isAv = await authClient.isUsernameAvailable({ username })
            if (!isAv) setError('El usuario no esta disponible')
        }, 500)

        return () => clearTimeout(handler)
    }, [username, setError])

    return (
        <CompletInput
            required
            label={t('username')}
            type='text'
            name='username'
            placeholder={t('username-placeholder')}
            min={3}
            max={30}
            pattern='^[a-z0-9_]+$'
            onFocus={() => setFocus(true)}
            onBlur={() => setFocus(false)}
            value={username}
            error={error}
            onChange={e => {
                const username = e.target.value
                setUsername(username)
                setError('')
                if (!username) return setCanSuggestUsername(true)
                if (username && focus) setCanSuggestUsername(false)
                if (username.length < 3)
                    setError(
                        'El nombre de usuario debe tener al menos 3 caracteres',
                    )
                if (username.length > 30)
                    setError(
                        'El nombre de usuario puede tener hasta 30 caracteres',
                    )
                if (!/^[a-z0-9_]+$/.test(username))
                    setError(
                        'El nombre de usuario debe contener solo minusculas, numeros y guiones bajos',
                    )
                if (username.includes(' '))
                    setError('El nombre de usuario no debe contener espacios')
            }}
            icon={AtSignIcon}
        />
    )
}
