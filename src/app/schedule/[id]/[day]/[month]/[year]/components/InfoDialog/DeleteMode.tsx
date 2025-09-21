'use client'

import { useSetAtom } from 'jotai'
import { SaveIcon, TrashIcon, UserIcon } from 'lucide-react'
import { useState, useTransition } from 'react'
import { deletePractice, findFirstPractice } from '@/actions/practices'
import { Button } from '@/components/Button'
import { MessageError } from '@/components/Error'
import { CompletInput } from '@/components/Inputs'
import {
    DialogMode,
    eventInfoAtom,
    modeAtom,
} from '@/global/management-practices'

interface InfoModeProps {
    isAdmin?: boolean
    isOwner?: boolean
    lab: {
        name: string
        id: string
        close_hour: number
        open_hour: number
    }
    practice: Exclude<
        Awaited<
            ReturnType<
                typeof findFirstPractice<{
                    include: {
                        teacher: true
                        class: {
                            include: {
                                subject: true
                                career: true
                            }
                        }
                    }
                }>
            >
        >,
        null
    >
}
export function DeleteMode({ practice }: InfoModeProps) {
    const setEditMode = useSetAtom(modeAtom)
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useTransition()
    const setCurrentEvent = useSetAtom(eventInfoAtom)
    return (
        <form
            action={data => {
                setLoading(async () => {
                    const { error } = await deletePractice(data)
                    if (error) {
                        setError(error)
                        setTimeout(() => setError(null), 5000)
                    } else {
                        setCurrentEvent(null)
                        setEditMode(DialogMode.INFO)
                    }
                })
            }}
            className='flex flex-col gap-4'
        >
            {error && <MessageError>{error}</MessageError>}
            <input type='hidden' value={practice.id} name='practice_id' />
            <CompletInput
                label='Practica'
                type='text'
                disabled
                value={practice.name}
                icon={UserIcon}
            />
            <div className='flex gap-2 *:flex-1'>
                <Button disabled={loading} type='submit' variant='destructive'>
                    <TrashIcon className='mr-2 h-5 w-5' />
                    Borrar
                </Button>
                <Button
                    disabled={loading}
                    onClick={e => {
                        e.preventDefault()
                        setEditMode(DialogMode.INFO)
                    }}
                >
                    <SaveIcon className='mr-2 h-5 w-5' />
                    Cancelar
                </Button>
            </div>
        </form>
    )
}
