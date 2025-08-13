import { AtSignIcon } from 'lucide-react'
import { RetornableCompletInput } from '@/components/Inputs'
import { useAtomValue } from 'jotai'
import { userToEditAtom } from '@/global/management-users'

interface EditUsernameInputProps {
    className?: string
}

export function EditUsernameInput({ className }: EditUsernameInputProps) {
    const oldUser = useAtomValue(userToEditAtom)

    if (!oldUser) return null

    return (
        <RetornableCompletInput
            originalValue={oldUser.username}
            required
            label='Username'
            type='text'
            name='username'
            icon={AtSignIcon}
            className={className}
        />
    )
}
