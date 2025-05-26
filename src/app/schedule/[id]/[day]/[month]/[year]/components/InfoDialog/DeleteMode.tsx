'use client'

import { DialogMode, modeAtom } from '@/global/management-practices'
import { findFirstPractice } from '@/actions/practices'
import { CompletInput } from '@/components/Inputs'
import { Save, UserIcon } from 'lucide-react'
import { Button } from '@/components/Button'
import { useSetAtom } from 'jotai'

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
    return (
        <form
            action={data => {
                console.log(data)
            }}
        >
            <input type='hidden' value={practice.id} name='practice_id' />
            <CompletInput
                label='Practica'
                type='text'
                disabled
                value={practice.name}
                icon={UserIcon}
            />
            <Button type='submit'>
                <Save className='mr-2 h-5 w-5' />
                Borrar
            </Button>
            <Button onClick={() => setEditMode(DialogMode.INFO)}>
                <Save className='mr-2 h-5 w-5' />
                Cancelar
            </Button>
        </form>
    )
}
