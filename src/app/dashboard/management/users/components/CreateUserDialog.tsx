'use client'

import { Button } from '@/components/Button'
import { openCreateUserAtom, updateUsersAtom } from '@/global/management-users'
import { Dialog, DialogContent, DialogTitle } from '@/components/Dialog'
import { useAtom, useSetAtom } from 'jotai'
import { SaveIcon } from 'lucide-react'
import { useEffect, useState, useTransition } from 'react'
import { authClient } from '@/lib/auth-client'
import { getRoles } from '@/actions/roles'
import { Role } from '@prisma/client'
import { ConfirmPasswordInput } from './inputs/ConfirmPasswordInput'
import { NameInput } from './inputs/NameInput'
import { PasswordInput } from './inputs/PasswordInput'
import { RoleSelect } from './inputs/RoleSelect'
import { UsernameInput } from './inputs/UsernameInput'
import { capitalize } from '@/lib/utils'

export function CreateUserDialog() {
    const [open, setOpen] = useAtom(openCreateUserAtom)
    const [message, setMessage] = useState('')
    const [inTransition, startTransition] = useTransition()
    const updateUsersTable = useSetAtom(updateUsersAtom)

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <DialogTitle>
                    <span className='text-3xl'>Crear Usuario</span>
                </DialogTitle>
                <form
                    action={data => {
                        startTransition(async () => {
                            const name = capitalize(
                                (data.get('name') as string).trim(),
                            )
                            const username = (
                                data.get('username') as string
                            ).trim()
                            const password = data.get('password') as string
                            const role_id = data.get('role_id') as string
                            const { error } = await authClient.signUp.email({
                                email: `${username}@noemail.local`,
                                password,
                                name,
                                username,
                                role_id,
                            })

                            if (error) setMessage('Algo salio mal')
                            else {
                                setTimeout(
                                    () => updateUsersTable(Symbol()),
                                    500,
                                )
                                setOpen(false)
                            }
                            setTimeout(() => {
                                setMessage('')
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
                    <NameInput />
                    <UsernameInput />
                    <RoleSelect />
                    <PasswordInput />
                    <ConfirmPasswordInput />
                    <Button type='submit' disabled={inTransition}>
                        <SaveIcon className='mr-2 h-5 w-5' />
                        Save
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}
