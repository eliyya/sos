'use client'

import { CompletInput } from '@/components/Inputs'
import {
    canSuggestUsernameAtom,
    nameAtom,
    nameErrorAtom,
    usernameAtom,
} from '@/global/signup'
import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { UserIcon } from 'lucide-react'

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
            placeholder='Nombre'
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
            icon={UserIcon}
        />
    )
}

function truncateByUnderscore(str: string, maxLength = 30) {
    const parts = str.split('_')
    let result = ''

    for (const part of parts) {
        if (result.length === 0) {
            if (part.length > maxLength) {
                return part.slice(0, maxLength)
            }
            result = part
        } else {
            if (result.length + 1 + part.length <= maxLength)
                result += '_' + part
            else break
        }
    }

    return result
}
