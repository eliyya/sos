'use client'

import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import {
    AtSignIcon,
    KeyIcon,
    SaveIcon,
    TriangleIcon,
    UserIcon,
} from 'lucide-react'
import { useEffect, useState, useTransition } from 'react'
import { editUser } from '@/actions/users'
import { Button } from '@/components/Button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/Dialog'
import { MessageError } from '@/components/Error'
import { CompletInput, RetornableCompletInput } from '@/components/Inputs'
import { RetornableCompletSelect } from '@/components/Select'
import {
    EditUserDialogAtom,
    updateAtom,
    entityToEditAtom,
    editPasswordAtom,
    editPasswordErrorAtom,
    editConfirmPasswordAtom,
    editConfirmPasswordErrorAtom,
    passwordFocusAtom,
} from '@/global/management-users'
import { rolesAtom } from '@/global/roles.globals'

export function EditUserDialog() {
    const [open, setOpen] = useAtom(EditUserDialogAtom)
    const [inTransition, startTransition] = useTransition()
    const oldUser = useAtomValue(entityToEditAtom)
    const [message, setMessage] = useState('')
    const updateUsersTable = useSetAtom(updateAtom)

    if (!oldUser) return null

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit @{oldUser.username}</DialogTitle>
                    <DialogDescription>
                        Edit the user&apos;s information
                    </DialogDescription>
                </DialogHeader>
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

export function EditUsernameInput() {
    const oldUser = useAtomValue(entityToEditAtom)

    if (!oldUser) return null

    return (
        <RetornableCompletInput
            originalValue={oldUser.username}
            required
            label='Username'
            type='text'
            name='username'
            icon={AtSignIcon}
        />
    )
}

export function EditRoleSelect() {
    const oldUser = useAtomValue(entityToEditAtom)
    const roles = useAtomValue(rolesAtom)

    if (!oldUser) return null

    return (
        <RetornableCompletSelect
            label='Rol'
            name='role_id'
            originalValue={{
                label:
                    roles.find(r => r.id === oldUser.role_id)?.name ??
                    oldUser.role_id,
                value: oldUser.role_id,
            }}
            options={roles.map(r => ({
                label: r.name,
                value: r.id,
            }))}
            icon={TriangleIcon}
        />
    )
}

export function EditPasswordInput() {
    const [password, setPassword] = useAtom(editPasswordAtom)
    const [error, setError] = useAtom(editPasswordErrorAtom)

    return (
        <RetornableCompletInput
            originalValue=''
            required
            label='Nueva contraseña'
            type='password'
            name='password'
            icon={KeyIcon}
            value={password}
            onChange={e => {
                const password = e.target.value
                setPassword(password)
                setError('')
                if (!password) return
                if (!/[A-Z]/.test(password))
                    setError(
                        'La contraseña debe contener al menos una mayúscula',
                    )
                if (!/[0-9]/.test(password))
                    setError('La contraseña debe contener al menos un número')
                if (!/[!@#$%^&*]/.test(password))
                    setError(
                        'La contraseña debe contener al menos un carácter especial como !@#$%^&*',
                    )
                if (password.length < 10)
                    setError('La contraseña debe tener al menos 10 caracteres')
            }}
            error={error}
        />
    )
}

export function EditNameInput() {
    const oldUser = useAtomValue(entityToEditAtom)

    if (!oldUser) return null

    return (
        <RetornableCompletInput
            originalValue={oldUser.name}
            required
            label='Name'
            type='text'
            name='name'
            icon={UserIcon}
        />
    )
}

export function ConfirmEditPasswordInput() {
    const [confirmPassword, setConfirmPassword] = useAtom(
        editConfirmPasswordAtom,
    )
    const [error, setError] = useAtom(editConfirmPasswordErrorAtom)
    const focus = useAtomValue(passwordFocusAtom)
    const password = useAtomValue(editPasswordAtom)

    useEffect(() => {
        const handler = setTimeout(async () => {
            if (focus) return
            if (confirmPassword !== password)
                setError('Las contraseñas no coinciden')
        }, 500)

        return () => clearTimeout(handler)
    }, [confirmPassword, password, setError, focus])
    return (
        <CompletInput
            label='Confirmar contraseña'
            type='password'
            name='confirm-password'
            icon={KeyIcon}
            value={confirmPassword}
            error={error}
            onChange={e => {
                setConfirmPassword(e.target.value)
                setError('')
            }}
        />
    )
}
