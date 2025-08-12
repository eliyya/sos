'use client'

import { RectangleEllipsisIcon } from 'lucide-react'
import { CompletInput } from '@/components/Inputs'
import { useTranslations } from 'next-intl'
import { useAtom } from 'jotai'
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
