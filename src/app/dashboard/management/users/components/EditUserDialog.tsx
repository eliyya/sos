'use client'

import { editUser } from '@/actions/users'
import { RoleBitField, RoleFlags } from '@/bitfields/RoleBitField'
import { Button } from '@/components/Button'
import { Dialog, DialogContent, DialogTitle } from '@/components/Dialog'
import { RetornableCompletInput } from '@/components/Inputs'
import { RetornableCompletSelect } from '@/components/Select'
import {
    EditUserDialogAtom,
    updateUsersAtom,
    userToEditAtom,
} from '@/global/management-users'
import { DialogDescription } from '@radix-ui/react-dialog'
import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { Save, User, AtSign, Triangle } from 'lucide-react'
import { useState, useTransition } from 'react'

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
                    <span className='text-3xl'>Edit User</span>
                </DialogTitle>
                <DialogDescription>
                    Edit the user&apos;s information
                </DialogDescription>
                <form
                    action={data => {
                        startTransition(async () => {
                            const { error } = await editUser(data)
                            if (error) setMessage(error)
                            else {
                                setTimeout(
                                    () => updateUsersTable(Symbol()),
                                    1_000,
                                )
                                setOpen(false)
                            }
                        })
                    }}
                    className='flex w-full max-w-md flex-col justify-center gap-6'
                >
                    {message && (
                        <span className='animate-slide-in mt-1 block rounded-lg bg-red-100 px-3 py-1 text-sm text-red-600 shadow-md'>
                            {message}
                        </span>
                    )}
                    <input type='hidden' value={oldUser.id} name='id' />
                    <RetornableCompletInput
                        defaultValue={oldUser.name}
                        required
                        label='Name'
                        type='text'
                        name='name'
                        icon={User}
                    ></RetornableCompletInput>
                    <RetornableCompletInput
                        defaultValue={oldUser.username}
                        required
                        label='Ussername'
                        type='text'
                        name='username'
                        icon={AtSign}
                    ></RetornableCompletInput>
                    <RetornableCompletSelect
                        isMulti
                        label='Roles'
                        name='roles'
                        defaultValue={Object.entries(
                            new RoleBitField(oldUser.role).serialize(),
                        )
                            .filter(([, v]) => v)
                            .map(([k]) => ({
                                label: k,
                                value: RoleFlags[k as keyof typeof RoleFlags],
                            }))}
                        options={Object.entries(RoleBitField.Flags).map(
                            ([k, v]) => ({
                                label: k,
                                value: v,
                            }),
                        )}
                        icon={Triangle}
                    />
                    <Button type='submit' disabled={inTransition}>
                        <Save className='mr-2 h-5 w-5' />
                        Save
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}
