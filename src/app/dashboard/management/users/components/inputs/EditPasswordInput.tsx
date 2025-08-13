import { KeyIcon } from 'lucide-react'
import { RetornableCompletInput } from '@/components/Inputs'
import { useAtom } from 'jotai'
import {
    editPasswordAtom,
    editPasswordErrorAtom,
} from '@/global/management-users'

interface EditPasswordInputProps {
    className?: string
}

export function EditPasswordInput({ className }: EditPasswordInputProps) {
    const [password, setPassword] = useAtom(editPasswordAtom)
    const [error, setError] = useAtom(editPasswordErrorAtom)

    return (
        <RetornableCompletInput
            originalValue=''
            required
            label='Nueva contraseña'
            type='password'
            name='password'
            icon={KeyIcon}
            className={className}
            value={password}
            onChange={e => {
                const password = e.target.value
                setPassword(password)
                setError('')
                if (!password) return
                if (!/[A-Z]/.test(password))
                    setError(
                        'La contraseña debe contener al menos una mayúscula',
                    )
                if (!/[0-9]/.test(password))
                    setError('La contraseña debe contener al menos un número')
                if (!/[!@#$%^&*]/.test(password))
                    setError(
                        'La contraseña debe contener al menos un carácter especial como !@#$%^&*',
                    )
                if (password.length < 10)
                    setError('La contraseña debe tener al menos 10 caracteres')
            }}
            error={error}
        />
    )
}
