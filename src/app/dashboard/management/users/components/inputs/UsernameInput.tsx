import { AtSignIcon } from 'lucide-react'
import { CompletInput } from '@/components/Inputs'
import {
    usernameAtom,
    usernameErrorAtom,
    canSuggestUsernameAtom,
} from '@/global/management-users'
import { useAtom, useSetAtom } from 'jotai'
import { useState } from 'react'

export function UsernameInput() {
    const [username, setUsername] = useAtom(usernameAtom)
    const [error, setError] = useAtom(usernameErrorAtom)
    const setCanSuggestUsername = useSetAtom(canSuggestUsernameAtom)
    const [focus, setFocus] = useState(false)

    return (
        <CompletInput
            required
            label='Username'
            type='text'
            name='username'
            icon={AtSignIcon}
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
        />
    )
}
