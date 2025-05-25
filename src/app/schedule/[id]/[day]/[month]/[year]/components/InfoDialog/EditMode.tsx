'use client'

import { editModeAtom } from '@/global/management-practices'
import interactionPlugin from '@fullcalendar/interaction'
import { findFirstPractice } from '@/actions/practices'
import timeGridPlugin from '@fullcalendar/timegrid'
import { CompletInput, RetornableCompletInput } from '@/components/Inputs'
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
    const [newPracticeName, setNewPracticeName] = useState(practice.name)

    return (
        <form className='grid grid-cols-2 gap-8' action={() => {}}>
            <div className='flex w-full max-w-md flex-col justify-center gap-6'>
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
                <RetornableCompletInput
                    label='Practica'
                    type='text'
                    defaultValue={practice?.name}
                    onChange={e => {
                        console.log('eve', e, e.target.value)
                        setNewPracticeName(e.target.value)
                    }}
                    value={newPracticeName}
                    icon={UserIcon}
                />
                <RetornableCompletInput
                    label='Tema'
                    type='text'
                    defaultValue={practice?.topic}
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
            </div>
            <FullCalendar
                plugins={[timeGridPlugin, interactionPlugin]}
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
                initialDate={practice.starts_at.getTime()}
                events={[
                    {
                        id: practice.id,
                        title: newPracticeName,
                        start: practice.starts_at.getTime(),
                        end: practice.ends_at.getTime(),
                    },
                ]}
            />
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
        </form>
    )
}
