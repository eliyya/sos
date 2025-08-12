'use client'

import { Button } from '@/components/Button'
import { CompletInput } from '@/components/Inputs'
import { CompletSelect } from '@/components/Select'
import { openCreateUserAtom, updateUsersAtom } from '@/global/management-users'
import { Dialog, DialogContent, DialogTitle } from '@/components/Dialog'
import { useAtom, useSetAtom } from 'jotai'
import {
    SaveIcon,
    KeyIcon,
    TriangleIcon,
    AtSignIcon,
    UserIcon,
} from 'lucide-react'
import { useEffect, useState, useTransition } from 'react'
import { authClient } from '@/lib/auth-client'
import { getRoles } from '@/actions/roles'
import { Role } from '@prisma/client'

export function CreateUserDialog() {
    const [open, setOpen] = useAtom(openCreateUserAtom)
    const [message, setMessage] = useState('')
    const [inTransition, startTransition] = useTransition()
    const updateUsersTable = useSetAtom(updateUsersAtom)
    const [roles, setRoles] = useState<Role[]>([])
    // TODO: Add validation

    useEffect(() => {
        getRoles().then(setRoles)
    }, [])

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <DialogTitle>
                    <span className='text-3xl'>Crear Usuario</span>
                </DialogTitle>
                <form
                    action={data => {
                        startTransition(async () => {
                            const name = data.get('name') as string
                            const username = data.get('username') as string
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
                                    1_000,
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
                    <CompletInput
                        required
                        label='Name'
                        type='text'
                        name='name'
                        icon={UserIcon}
                    />
                    <CompletInput
                        required
                        label='Username'
                        type='text'
                        name='username'
                        icon={AtSignIcon}
                    />
                    <CompletSelect
                        required
                        label='Rol'
                        name='role_id'
                        options={roles.map(r => ({
                            label: r.name,
                            value: r.id,
                        }))}
                        icon={TriangleIcon}
                    />
                    <CompletInput
                        label='Password'
                        type='password'
                        name='password'
                        icon={KeyIcon}
                    />
                    <CompletInput
                        label='Confirm Password'
                        type='password'
                        name='password-confirm'
                        icon={KeyIcon}
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
