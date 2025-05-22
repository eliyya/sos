'use client'

import { createUser } from '@/actions/users'
import { RoleBitField } from '@/bitfields/RoleBitField'
import { Button } from '@/components/Button'
import { CompletInput } from '@/components/Inputs'
import { CompletSelect } from '@/components/Select'
import { openCreateUserAtom, updateUsersAtom } from '@/global/management-users'
import {
    Dialog,
    DialogContent,
    // DialogDescription,
    DialogTitle,
} from '@/components/Dialog'
import { useAtom, useSetAtom } from 'jotai'
import { User, AtSign, Triangle, Save, Key } from 'lucide-react'
import { useState, useTransition } from 'react'

export function CreateUserDialog() {
    const [open, setOpen] = useAtom(openCreateUserAtom)
    const [message, setMessage] = useState('')
    const [passError, setPassError] = useState('')
    const [passConfirmError, setPassConfirmError] = useState('')
    const [inTransition, startTransition] = useTransition()
    const updateUsersTable = useSetAtom(updateUsersAtom)

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <DialogTitle>
                    <span className='text-3xl'>Crear Usuario</span>
                </DialogTitle>
                {/* <DialogDescription>
                    Edit the user&apos;s information
                </DialogDescription> */}
                <form
                    action={data => {
                        console.log(Object.fromEntries(data.entries()))

                        startTransition(async () => {
                            const { error, password, confirm } =
                                await createUser(data)

                            if (error) setMessage(error)
                            else if (password) setPassError(password)
                            else if (confirm) setPassConfirmError(confirm)
                            else {
                                setTimeout(
                                    () => updateUsersTable(Symbol()),
                                    1_000,
                                )
                                setOpen(false)
                            }
                            setTimeout(() => {
                                setMessage('')
                                setPassError('')
                                setPassConfirmError('')
                            }, 5_000)
                        })
                    }}
                    className='flex w-full max-w-md flex-col justify-center gap-6'
                >
                    {message && (
                        <span className='animate-slide-in mt-1 block rounded-lg bg-red-100 px-3 py-1 text-sm text-red-600 shadow-md'>
                            {message}
                        </span>
                    )}
                    <CompletInput
                        required
                        label='Name'
                        type='text'
                        name='name'
                        icon={User}
                    />
                    <CompletInput
                        required
                        label='Username'
                        type='text'
                        name='username'
                        icon={AtSign}
                    />
                    <CompletSelect
                        isMulti
                        label='Roles'
                        name='roles'
                        options={Object.entries(RoleBitField.Flags).map(
                            ([k, v]) => ({
                                label: k,
                                value: v,
                            }),
                        )}
                        icon={Triangle}
                    />
                    <CompletInput
                        label='Password'
                        type='password'
                        name='password'
                        error={passError}
                        icon={Key}
                    />
                    <CompletInput
                        label='Confirm Password'
                        type='password'
                        name='password-confirm'
                        error={passConfirmError}
                        icon={Key}
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
