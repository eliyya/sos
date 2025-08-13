import { UserIcon } from 'lucide-react'
import { RetornableCompletInput } from '@/components/Inputs'
import { useAtomValue } from 'jotai'
import { userToEditAtom } from '@/global/management-users'

interface EditNameInputProps {
    className?: string
}

export function EditNameInput({ className }: EditNameInputProps) {
    const oldUser = useAtomValue(userToEditAtom)

    if (!oldUser) return null

    return (
        <RetornableCompletInput
            originalValue={oldUser.name}
            required
            label='Name'
            type='text'
            name='name'
            icon={UserIcon}
            className={className}
        />
    )
}
