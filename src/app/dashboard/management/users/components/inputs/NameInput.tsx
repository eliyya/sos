import { UserIcon } from 'lucide-react'
import { CompletInput } from '@/components/Inputs'
import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import {
    canSuggestUsernameAtom,
    nameAtom,
    nameErrorAtom,
    usernameAtom,
} from '@/global/management-users'
import { truncateByUnderscore } from '@/lib/utils'

export function NameInput() {
    const [name, setName] = useAtom(nameAtom)
    const [error, setError] = useAtom(nameErrorAtom)
    const setUsername = useSetAtom(usernameAtom)
    const canSuggestUsername = useAtomValue(canSuggestUsernameAtom)

    return (
        <CompletInput
            required
            label='Nombre'
            type='text'
            name='name'
            icon={UserIcon}
            value={name}
            error={error}
            onChange={e => {
                const name = e.target.value
                setName(name)
                setError('')
                if (!canSuggestUsername) return
                if (name.length < 3) return
                setUsername(
                    truncateByUnderscore(
                        name.toLowerCase().replace(/\s+/g, '_'),
                    ),
                )
            }}
        />
    )
}
