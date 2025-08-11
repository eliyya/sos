'use client'

import { CompletInput } from '@/components/Inputs'
import {
    confirmPasswordAtom,
    confirmPasswordErrorAtom,
    passwordAtom,
    passwordFocusAtom,
} from '../../global/login'
import { useAtom, useAtomValue } from 'jotai'
import { RectangleEllipsisIcon } from 'lucide-react'
import { useEffect } from 'react'

export function ConfirmPasswordInput() {
    const [confirmPassword, setConfirmPassword] = useAtom(confirmPasswordAtom)
    const [error, setError] = useAtom(confirmPasswordErrorAtom)
    const focus = useAtomValue(passwordFocusAtom)
    const password = useAtomValue(passwordAtom)

    useEffect(() => {
        const handler = setTimeout(async () => {
            if (focus) return
            if (confirmPassword !== password)
                setError('Las contraseñas no coinciden')
        }, 500)

        return () => clearTimeout(handler)
    }, [confirmPassword, password, setError, focus])

    return (
        <CompletInput
            required
            label={'Confirmar contraseña'}
            type='password'
            name='confirm-password'
            placeholder='* * * * * * * *'
            value={confirmPassword}
            error={error}
            onChange={e => {
                setConfirmPassword(e.target.value)
                setError('')
            }}
            icon={RectangleEllipsisIcon}
        />
    )
}
