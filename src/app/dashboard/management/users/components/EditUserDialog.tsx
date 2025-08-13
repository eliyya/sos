'use client'

import { editUser } from '@/actions/users'
import { Button } from '@/components/Button'
import { Dialog, DialogContent, DialogTitle } from '@/components/Dialog'
import { MessageError } from '@/components/Error'
import {
    EditUserDialogAtom,
    updateUsersAtom,
    userToEditAtom,
} from '@/global/management-users'
import { DialogDescription } from '@radix-ui/react-dialog'
import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { SaveIcon } from 'lucide-react'
import { useState, useTransition } from 'react'
import { EditNameInput } from './inputs/EditNameInput'
import { EditRoleSelect } from './inputs/EditRoleSelect'
import { EditUsernameInput } from './inputs/EditUsernameInput'
import { EditPasswordInput } from './inputs/EditPasswordInput'
import { ConfirmEditPasswordInput } from './inputs/ConfirmEditPasswordInput'

export function EditUserDialog() {
    const [open, setOpen] = useAtom(EditUserDialogAtom)
    const [inTransition, startTransition] = useTransition()
    const oldUser = useAtomValue(userToEditAtom)
    const [message, setMessage] = useState('')
    const updateUsersTable = useSetAtom(updateUsersAtom)

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
                    <EditNameInput />
                    <EditUsernameInput />
                    <EditRoleSelect />
                    <EditPasswordInput />
                    <ConfirmEditPasswordInput />

                    <Button type='submit' disabled={inTransition}>
                        <SaveIcon className='mr-2 h-5 w-5' />
                        Save
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}
