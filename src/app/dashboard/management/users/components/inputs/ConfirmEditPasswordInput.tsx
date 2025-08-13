import { KeyIcon } from 'lucide-react'
import { CompletInput } from '@/components/Inputs'
import {
    passwordFocusAtom,
    editPasswordAtom,
    editConfirmPasswordAtom,
    editConfirmPasswordErrorAtom,
} from '@/global/management-users'
import { useAtom, useAtomValue } from 'jotai'
import { useEffect } from 'react'

export function ConfirmEditPasswordInput() {
    const [confirmPassword, setConfirmPassword] = useAtom(
        editConfirmPasswordAtom,
    )
    const [error, setError] = useAtom(editConfirmPasswordErrorAtom)
    const focus = useAtomValue(passwordFocusAtom)
    const password = useAtomValue(editPasswordAtom)

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
            label='Confirmar contraseña'
            type='password'
            name='confirm-password'
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
