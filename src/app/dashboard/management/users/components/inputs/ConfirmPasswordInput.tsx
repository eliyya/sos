import { KeyIcon } from 'lucide-react'
import { CompletInput } from '@/components/Inputs'
import {
    passwordFocusAtom,
    passwordAtom,
    confirmPasswordAtom,
    confirmPasswordErrorAtom,
} from '@/global/management-users'
import { useAtom, useAtomValue } from 'jotai'
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
            label='Confirm Password'
            type='password'
            name='password-confirm'
            icon={KeyIcon}
            value={confirmPassword}
            error={error}
            onChange={e => {
                setConfirmPassword(e.target.value)
                setError('')
            }}
        />
    )
}
