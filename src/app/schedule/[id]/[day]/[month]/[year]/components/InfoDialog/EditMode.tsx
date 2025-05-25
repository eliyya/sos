'use client'

import { editModeAtom } from '@/global/management-practices'
import interactionPlugin from '@fullcalendar/interaction'
import { findFirstPractice } from '@/actions/practices'
import timeGridPlugin from '@fullcalendar/timegrid'
import { CompletInput } from '@/components/Inputs'
import { MessageError } from '@/components/Error'
import { SaveIcon, UserIcon } from 'lucide-react'
import { Temporal } from '@js-temporal/polyfill'
import FullCalendar from '@fullcalendar/react'
import { Button } from '@/components/Button'
import { secondsToTime } from '@/lib/utils'
import { getClassName } from './InfoDialog'
import { useSetAtom } from 'jotai'
import { useState } from 'react'

interface EditModeProps {
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
    lab: {
        name: string
        id: string
        close_hour: number
        open_hour: number
    }
    remainingHours: {
        leftHours: number
        allowedHours: number
        usedHours: number
    }
}
export function EditMode({ practice, lab, remainingHours }: EditModeProps) {
    const [message] = useState('')
    const setEditMode = useSetAtom(editModeAtom)

    return (
        <div className='flex gap-8'>
            <form
                className='flex w-full max-w-md flex-1/2 flex-col justify-center gap-6'
                action={() => {}}
            >
                {message && <MessageError>{message}</MessageError>}
                <input type='hidden' value={lab.id} name='laboratory_id' />
                <CompletInput
                    label='Docente'
                    disabled
                    value={practice?.teacher.name}
                    icon={UserIcon}
                />
                {practice?.class && (
                    <CompletInput
                        label='Clase'
                        disabled
                        value={getClassName(practice.class)}
                        icon={UserIcon}
                    />
                )}
                <CompletInput
                    label='Horas restantes'
                    type='text'
                    disabled
                    value={
                        remainingHours.leftHours === Infinity ?
                            'Infinitas'
                        :   `${remainingHours.leftHours}/${remainingHours.allowedHours}`
                    }
                    icon={UserIcon}
                />
                <CompletInput
                    label='Practica'
                    type='text'
                    disabled
                    value={practice?.name}
                    icon={UserIcon}
                />
                <CompletInput
                    label='Tema'
                    type='text'
                    disabled
                    value={practice?.topic}
                    icon={UserIcon}
                />
                <CompletInput
                    label='Inicio'
                    type='time'
                    disabled
                    value={`${Temporal.Instant.fromEpochMilliseconds(
                        practice?.starts_at.getTime() ?? 0,
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
                        practice?.ends_at.getTime() ?? 0,
                    )
                        .since(
                            Temporal.Instant.fromEpochMilliseconds(
                                practice?.starts_at.getTime() ?? 0,
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
                    value={practice?.students ?? 1}
                    icon={UserIcon}
                />
                <CompletInput
                    required
                    label='Contraseña'
                    type='password'
                    placeholder='* * * * * * * *'
                    icon={UserIcon}
                />
                <div className='flex gap-2'>
                    <Button
                        variant='outline'
                        onClick={e => {
                            e.preventDefault()
                            setEditMode(false)
                        }}
                    >
                        <SaveIcon className='mr-2 h-5 w-5' />
                        Cancelar
                    </Button>
                    <Button type='submit'>
                        <SaveIcon className='mr-2 h-5 w-5' />
                        Guardar
                    </Button>
                </div>
            </form>
            <div className='flex-1/2'>
                <FullCalendar
                    eventClassNames={'cursor-pointer'}
                    plugins={[timeGridPlugin, interactionPlugin]}
                    dayHeaderClassNames={'bg-background'}
                    initialView='timeGridDay'
                    allDaySlot={false}
                    slotDuration={'01:00:00'}
                    headerToolbar={{
                        left: 'title',
                        center: '',
                        right: '',
                    }}
                    slotMinTime={secondsToTime(lab.open_hour * 60, 'HH:mm:ss')}
                    slotMaxTime={secondsToTime(lab.close_hour * 60, 'HH:mm:ss')}
                    height='auto'
                    initialDate={practice.starts_at.getTime()}
                    // events={[...events, actualEvent]}
                />
            </div>
        </div>
    )
}
