'use client'

import { getRoles } from '@/actions/roles'
import { editUser } from '@/actions/users'
import { Button } from '@/components/Button'
import { Dialog, DialogContent, DialogTitle } from '@/components/Dialog'
import { MessageError } from '@/components/Error'
import { RetornableCompletInput } from '@/components/Inputs'
import { RetornableCompletSelect } from '@/components/Select'
import {
    EditUserDialogAtom,
    updateUsersAtom,
    userToEditAtom,
} from '@/global/management-users'
import { DialogDescription } from '@radix-ui/react-dialog'
import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { UserIcon, TriangleIcon, AtSignIcon, SaveIcon } from 'lucide-react'
import { useEffect, useState, useTransition } from 'react'

export function EditUserDialog() {
    const [open, setOpen] = useAtom(EditUserDialogAtom)
    const [inTransition, startTransition] = useTransition()
    const oldUser = useAtomValue(userToEditAtom)
    const [message, setMessage] = useState('')
    const updateUsersTable = useSetAtom(updateUsersAtom)
    const [roles, setRoles] = useState<Awaited<ReturnType<typeof getRoles>>>([])

    useEffect(() => {
        startTransition(async () => {
            const roles = await getRoles()
            setRoles(roles)
        })
    }, [])

    if (!oldUser) return null

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <DialogTitle>
                    <span className='text-3xl'>Edit @{oldUser.username}</span>
                </DialogTitle>
                <DialogDescription>
                    Edit the user&apos;s information
                </DialogDescription>
                <form
                    action={data => {
                        startTransition(async () => {
                            const { error } = await editUser(data)
                            if (error) {
                                setMessage(error)
                                setTimeout(() => {
                                    setMessage('')
                                }, 5_000)
                            } else {
                                setTimeout(
                                    () => updateUsersTable(Symbol()),
                                    500,
                                )
                                setOpen(false)
                            }
                        })
                    }}
                    className='flex w-full max-w-md flex-col justify-center gap-6'
                >
                    {message && <MessageError>{message}</MessageError>}
                    <input type='hidden' value={oldUser.id} name='user_id' />
                    <RetornableCompletInput
                        originalValue={oldUser.name}
                        required
                        label='Name'
                        type='text'
                        name='name'
                        icon={UserIcon}
                    ></RetornableCompletInput>
                    <RetornableCompletInput
                        originalValue={oldUser.username}
                        required
                        label='Ussername'
                        type='text'
                        name='username'
                        icon={AtSignIcon}
                    ></RetornableCompletInput>
                    <RetornableCompletSelect
                        label='Rol'
                        name='role_id'
                        originalValue={{
                            label:
                                roles.find(r => r.id === oldUser.role_id)
                                    ?.name ?? oldUser.role_id,
                            value: oldUser.role_id,
                        }}
                        options={roles.map(r => ({
                            label: r.name,
                            value: r.id,
                        }))}
                        icon={TriangleIcon}
                    />
                    <Button type='submit' disabled={inTransition}>
                        <SaveIcon className='mr-2 h-5 w-5' />
                        Save
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}
