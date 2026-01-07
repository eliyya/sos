'use client'

import { useAtom, useAtomValue } from 'jotai'
import { useMemo } from 'react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { eventInfoAtom, reservationsAtom } from '@/global/management-practices'
import { CompletInput } from '@/components/Inputs'
import { Temporal } from '@js-temporal/polyfill'
import {
    ClockFadingIcon,
    ClockIcon,
    HashIcon,
    MousePointerIcon,
    PencilIcon,
    UserIcon,
    UsersIcon,
} from 'lucide-react'

export function InfoDialog() {
    const [currentEvent, setCurrentEvent] = useAtom(eventInfoAtom)
    const reservations = useAtomValue(reservationsAtom)

    const practice = useMemo(() => {
        if (!currentEvent?.id) return null
        const practice = reservations.find(r => r.id === currentEvent?.id)
        if (!practice) return null
        return practice
    }, [currentEvent, reservations])

    if (!currentEvent) return null
    if (!practice) return null
    return (
        <Dialog
            open={!!currentEvent}
            onOpenChange={op => {
                if (!op) {
                    setCurrentEvent(null)
                }
            }}
        >
            <DialogContent>
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
                        icon={UsersIcon}
                    />
                )}
                <CompletInput
                    label='Practica'
                    type='text'
                    disabled
                    value={practice.name}
                    icon={MousePointerIcon}
                />
                <CompletInput
                    label='Tema'
                    type='text'
                    disabled
                    value={practice.topic}
                    icon={PencilIcon}
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
                    icon={ClockIcon}
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
                    icon={ClockFadingIcon}
                />
                <CompletInput
                    required
                    label='Cantidad de estudiantes'
                    type='number'
                    disabled
                    value={practice.students ?? 1}
                    icon={HashIcon}
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
