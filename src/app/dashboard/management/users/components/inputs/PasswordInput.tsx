import { KeyIcon } from 'lucide-react'
import { CompletInput } from '@/components/Inputs'
import { useAtom, useSetAtom } from 'jotai'
import {
    passwordAtom,
    passwordErrorAtom,
    passwordFocusAtom,
} from '@/global/management-users'

export function PasswordInput() {
    const [pass, setUsername] = useAtom(passwordAtom)
    const [error, setError] = useAtom(passwordErrorAtom)
    const setFocus = useSetAtom(passwordFocusAtom)

    return (
        <CompletInput
            label='Contraseña'
            type='password'
            name='password'
            icon={KeyIcon}
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
        />
    )
}
