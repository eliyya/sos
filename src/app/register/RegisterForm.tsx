'use client'

import { useState } from 'react'
import { registerAdmin } from '@/actions/registro'
import { redirect } from 'next/navigation'
import { root } from '@eliyya/type-routes'

export function RegisterForm() {
    const [name, setName] = useState('')
    const [username, setUserName] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [error, setError] = useState('')

    return (
        <form
            action={async () => {
                if (password !== confirmPassword)
                    return setError('Las contraseñas no coinciden')
                const response = await registerAdmin({
                    name,
                    password,
                    username,
                })
                if (response) return alert('Hubo un error')
                else redirect(root.login())
            }}
            className="flex flex-col gap-2"
        >
            <label className="flex flex-col items-center">
                Nombre
                <input
                    type="text"
                    onChange={e => {
                        setName(e.currentTarget.value)
                    }}
                    value={name}
                    required
                />
            </label>
            <label className="flex flex-col items-center">
                usuario
                <input
                    type="text"
                    onChange={e => {
                        setUserName(e.currentTarget.value)
                    }}
                    value={username}
                    required
                />
            </label>
            <label className="flex flex-col items-center">
                contraseña
                <input
                    type="password"
                    onChange={e => {
                        setPassword(e.currentTarget.value)
                    }}
                    value={password}
                    required
                />
            </label>
            <label className="flex flex-col items-center">
                confirmar contraseña
                <input
                    type="password"
                    onChange={e => {
                        setConfirmPassword(e.currentTarget.value)
                    }}
                    value={confirmPassword}
                    required
                />
            </label>
            <span>{error}</span>
            <input type="submit" className="bg-white" />
        </form>
    )
}
