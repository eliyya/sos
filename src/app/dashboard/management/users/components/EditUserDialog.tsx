'use client'

import { RoleBitField } from '@/bitfields/RoleBitField'
import { Button } from '@/components/Button'
import { Dialog, DialogContent, DialogTitle } from '@/components/Dialog'
import { RetornableCompletInput } from '@/components/Inputs'
import { RetornableCompletSelect } from '@/components/Select'
import { EditUserDialogAtom, userToEditAtom } from '@/global/management-users'
import { cn } from '@/lib/utils'
import { DialogDescription } from '@radix-ui/react-dialog'
import { useAtom, useAtomValue } from 'jotai'
import { Save, User, AtSign, Triangle } from 'lucide-react'
import { useTransition } from 'react'

export function EditUserDialog() {
    const [open, setOpen] = useAtom(EditUserDialogAtom)
    const [inTransition, startTransition] = useTransition()
    const oldUser = useAtomValue(userToEditAtom)

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
                            console.log(data)
                        })
                    }}
                    className='flex w-full max-w-md flex-col justify-center gap-6'
                >
                    <RetornableCompletInput
                        defaultValue={oldUser.name}
                        required
                        label='Name'
                        type='text'
                        name='username'
                    >
                        <User className='absolute top-2.5 left-3 h-5 w-5 text-gray-500 dark:text-gray-400' />
                    </RetornableCompletInput>
                    <RetornableCompletInput
                        defaultValue={oldUser.username}
                        required
                        label='Ussername'
                        type='text'
                        name='username'
                    >
                        <AtSign className='absolute top-2.5 left-3 h-5 w-5 text-gray-500 dark:text-gray-400' />
                    </RetornableCompletInput>
                    <RetornableCompletSelect
                        isMulti
                        label='Roles'
                        name='roles'
                        defaultValue={{ label: 'Admin', value: 1n }}
                        options={Object.entries(RoleBitField.Flags).map(
                            ([k, v]) => ({
                                label: k,
                                value: v,
                            }),
                        )}
                    >
                        <Triangle className='absolute top-2.5 left-3 z-50 h-5 w-5 text-gray-500 dark:text-gray-400' />
                    </RetornableCompletSelect>
                    <Button type='submit' disabled={inTransition}>
                        <Save className='mr-2 h-5 w-5' />
                        Save
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}
