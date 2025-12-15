'use client'

import { useAtom } from 'jotai'
import { useEffect, useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/Dialog'
import {
    modeAtom,
    eventInfoAtom,
    DialogMode,
} from '@/global/management-practices'
import { cn } from '@/lib/utils'
import { CompletInput } from '@/components/Inputs'
import { Temporal } from '@js-temporal/polyfill'
import { UserIcon } from 'lucide-react'
import { getReservationAction } from '@/actions/reservations.actions'

type ReservationInfo = Awaited<ReturnType<typeof getReservationAction>>
export function InfoDialog() {
    const [mode, setMode] = useAtom(modeAtom)
    const [currentEvent, setCurrentEvent] = useAtom(eventInfoAtom)
    const [practice, setPractice] = useState<ReservationInfo>()

    useEffect(() => {
        if (!currentEvent) return
        getReservationAction({
            id: currentEvent.id,
        }).then(setPractice)
    }, [currentEvent, setPractice])

    if (!currentEvent) return null
    if (!practice) return null
    return (
        <Dialog
            open={!!currentEvent}
            onOpenChange={op =>
                (op === false && setCurrentEvent(null)) ||
                setMode(DialogMode.INFO)
            }
        >
            <DialogContent
                className={cn({
                    'w-full max-w-4xl': mode === DialogMode.EDIT,
                })}
            >
                <DialogHeader className='flex flex-col gap-4'>
                    <DialogTitle className='w-full text-center text-3xl'>
                        Info
                    </DialogTitle>
                </DialogHeader>
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
                        practice.starts_at.getTime(),
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
            </DialogContent>
        </Dialog>
    )
}

interface getClassNameProps {
    subject: { name: string }
    career: { alias?: string | null; name: string }
    group: number
    semester: number
}
export function getClassName({
    subject,
    career,
    group,
    semester,
}: getClassNameProps) {
    return `${subject.name} - ${career.alias ?? career.name}${group}-${semester}`
}
