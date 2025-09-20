'use client'

import { useAtom } from 'jotai'
import { AtSignIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { CompletInput } from '@/components/Inputs'
import { usernameAtom } from '@/global/login'

export function UsernameInput() {
    const t = useTranslations('app.auth.login.components.loginForm')
    const [username, setUsername] = useAtom(usernameAtom)
    return (
        <CompletInput
            required
            label={t('username')}
            type='text'
            name='username'
            placeholder={t('username-placeholder')}
            icon={AtSignIcon}
            value={username}
            onChange={e => setUsername(e.target.value)}
        />
    )
}
