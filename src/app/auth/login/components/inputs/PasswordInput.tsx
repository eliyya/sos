'use client'

import { useAtom } from 'jotai'
import { RectangleEllipsisIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { CompletInput } from '@/components/Inputs'
import { passwordAtom } from '@/global/login'

export function PasswordInput() {
    const t = useTranslations('app.auth.login.components.loginForm')
    const [password, setPassword] = useAtom(passwordAtom)
    return (
        <CompletInput
            required
            label={t('pass')}
            type='password'
            name='password'
            placeholder='* * * * * * * *'
            icon={RectangleEllipsisIcon}
            value={password}
            onChange={e => setPassword(e.target.value)}
        />
    )
}
