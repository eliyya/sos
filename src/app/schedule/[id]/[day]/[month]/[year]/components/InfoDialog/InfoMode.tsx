'use client'

import { DialogMode, modeAtom } from '@/global/management-practices'
import { findFirstPractice } from '@/actions/practices'
import { CompletInput } from '@/components/Inputs'
import { Temporal } from '@js-temporal/polyfill'
import { Save, Trash, UserIcon } from 'lucide-react'
import { Button } from '@/components/Button'
import { getClassName } from './InfoDialog'
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
export function InfoMode({ lab, practice, isAdmin, isOwner }: InfoModeProps) {
    const setEditMode = useSetAtom(modeAtom)
    return (
        <>
            <input type='hidden' value={lab.id} name='laboratory_id' />
            <CompletInput
                label='Docente'
                disabled
                value={practice.teacher.name}
                icon={UserIcon}
            />
            {practice.class && (
                <CompletInput
                    label='Clase'
                    disabled
                    value={getClassName(practice.class)}
                    icon={UserIcon}
                />
            )}
            <CompletInput
                label='Practica'
                type='text'
                disabled
                value={practice.name}
                icon={UserIcon}
            />
            <CompletInput
                label='Tema'
                type='text'
                disabled
                value={practice.topic}
                icon={UserIcon}
            />
            <CompletInput
                label='Inicio'
                type='time'
                disabled
                value={`${Temporal.Instant.fromEpochMilliseconds(
                    practice.starts_at.getTime() ?? 0,
                )
                    .toZonedDateTimeISO('America/Monterrey')
                    .hour.toString()
                    .padStart(2, '0')}:00`}
                icon={UserIcon}
            />
            <CompletInput
                required
                label='Duración en horas'
                type='number'
                disabled
                value={Temporal.Instant.fromEpochMilliseconds(
                    practice.ends_at.getTime() ?? 0,
                )
                    .since(
                        Temporal.Instant.fromEpochMilliseconds(
                            practice.starts_at.getTime() ?? 0,
                        ),
                    )
                    .total('hours')}
                icon={UserIcon}
            />
            <CompletInput
                required
                label='Cantidad de estudiantes'
                type='number'
                disabled
                value={practice.students ?? 1}
                icon={UserIcon}
            />
            {(isAdmin || isOwner) && (
                <>
                    <Button onClick={() => setEditMode(DialogMode.EDIT)}>
                        <Save className='mr-2 h-5 w-5' />
                        Editar
                    </Button>
                    <Button
                        variant='destructive'
                        onClick={() => setEditMode(DialogMode.DELETE)}
                    >
                        <Trash className='mr-2 h-5 w-5' />
                        Borrar
                    </Button>
                </>
            )}
        </>
    )
}
