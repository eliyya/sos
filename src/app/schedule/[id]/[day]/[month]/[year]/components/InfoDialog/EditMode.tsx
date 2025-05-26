'use client'

import { modeAtom, eventsAtom, DialogMode } from '@/global/management-practices'
import interactionPlugin from '@fullcalendar/interaction'
import { findFirstPractice } from '@/actions/practices'
import timeGridPlugin from '@fullcalendar/timegrid'
import { CompletInput, RetornableCompletInput } from '@/components/Inputs'
import { MessageError } from '@/components/Error'
import { SaveIcon, UserIcon } from 'lucide-react'
import { Temporal } from '@js-temporal/polyfill'
import FullCalendar from '@fullcalendar/react'
import { Button } from '@/components/Button'
import { secondsToTime, setTime } from '@/lib/utils'
import { getClassName } from './InfoDialog'
import { useAtomValue, useSetAtom } from 'jotai'
import { useEffect, useState } from 'react'

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
    const setEditMode = useSetAtom(modeAtom)
    const [newPracticeName, setNewPracticeName] = useState(practice.name)
    const events = useAtomValue(eventsAtom)
    const [startHourError, setStartHourError] = useState('')
    const [endHourError, setEndHourError] = useState('')
    const [disponibleHours] = useState(
        () =>
            remainingHours.leftHours +
            (practice.ends_at.getTime() - practice.starts_at.getTime()) /
                1000 /
                60 /
                60,
    )
    const [newDuration, setNewDuration] = useState(() =>
        Temporal.Instant.fromEpochMilliseconds(practice.ends_at.getTime())
            .since(
                Temporal.Instant.fromEpochMilliseconds(
                    practice.starts_at.getTime(),
                ),
            )
            .total('hours'),
    )
    const [newStart, setNewStart] = useState(
        () =>
            `${Temporal.Instant.fromEpochMilliseconds(
                practice.starts_at.getTime(),
            )
                .toZonedDateTimeISO('America/Monterrey')
                .hour.toString()
                .padStart(2, '0')}:00`,
    )

    useEffect(() => {
        const start = setTime(
            Temporal.Instant.fromEpochMilliseconds(
                practice.starts_at.getTime(),
            ).toZonedDateTimeISO('America/Monterrey'),
            newStart,
        )
        const end = start.add({
            hours: newDuration,
        })
        const openHourDate = setTime(
            Temporal.Instant.fromEpochMilliseconds(
                practice.starts_at.getTime(),
            ).toZonedDateTimeISO('America/Monterrey'),
            secondsToTime(lab.open_hour * 60),
        )
        const closeHourDate = setTime(
            Temporal.Instant.fromEpochMilliseconds(
                practice.starts_at.getTime(),
            ).toZonedDateTimeISO('America/Monterrey'),
            secondsToTime(lab.close_hour * 60),
        )
        const hasEmpalmInStartHour = events
            .filter(e => e.id !== practice.id)
            .some(
                e =>
                    start.epochMilliseconds >= e.start &&
                    start.epochMilliseconds < e.end,
            )
        if (start.epochMilliseconds < openHourDate.epochMilliseconds)
            setStartHourError(
                'La hora de inicio debe ser mayor que la de apertura.',
            )
        else if (
            start.epochMilliseconds >
            closeHourDate.subtract({ hours: 1 }).epochMilliseconds
        )
            setStartHourError(
                'La hora de inicio debe ser menor que la de cierre.',
            )
        else if (hasEmpalmInStartHour)
            setStartHourError(
                'El laboratorio ya tiene_ un evento en el mismo horario.',
            )
        else setStartHourError('')
        // validate end hour
        const hasEmpalmInEndHour = events
            .filter(e => e.id !== practice.id)
            .some(
                e =>
                    end.epochMilliseconds > e.start &&
                    end.epochMilliseconds <= e.end,
            )
        const wrapsExistingEvent = events
            .filter(e => e.id !== practice.id)
            .some(
                e =>
                    start.epochMilliseconds <= e.start &&
                    end.epochMilliseconds >= e.end,
            )

        if (end.epochMilliseconds > closeHourDate.epochMilliseconds)
            setEndHourError(
                'La hora de cierre debe ser menor que la de cierre.',
            )
        else if (hasEmpalmInEndHour)
            setEndHourError(
                'El laboratorio ya tiene un evento en el mismo horario.',
            )
        else if (wrapsExistingEvent)
            setEndHourError(
                'El laboratorio ya tiene un evento en el mismo horario.',
            )
        else if (disponibleHours < newDuration)
            setEndHourError('No hay suficientes horas restantes.')
        else setEndHourError('')
    }, [newDuration, newStart, events, lab, practice, disponibleHours])

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
                    onChange={e => setNewPracticeName(e.target.value)}
                    value={newPracticeName}
                    icon={UserIcon}
                />
                <RetornableCompletInput
                    label='Tema'
                    type='text'
                    defaultValue={practice?.topic}
                    icon={UserIcon}
                />
                <RetornableCompletInput
                    label='Inicio'
                    type='time'
                    error={startHourError}
                    defaultValue={`${Temporal.Instant.fromEpochMilliseconds(
                        practice.starts_at.getTime(),
                    )
                        .toZonedDateTimeISO('America/Monterrey')
                        .hour.toString()
                        .padStart(2, '0')}:00`}
                    value={newStart}
                    onChange={e => setNewStart(e.currentTarget.value)}
                    icon={UserIcon}
                />
                <RetornableCompletInput
                    required
                    label='Duración en horas'
                    type='number'
                    error={endHourError}
                    defaultValue={Temporal.Instant.fromEpochMilliseconds(
                        practice?.ends_at.getTime() ?? 0,
                    )
                        .since(
                            Temporal.Instant.fromEpochMilliseconds(
                                practice?.starts_at.getTime() ?? 0,
                            ),
                        )
                        .total('hours')}
                    value={newDuration.toString()}
                    min={1}
                    onChange={e =>
                        setNewDuration(parseInt(e.currentTarget.value))
                    }
                    icon={UserIcon}
                />
                <RetornableCompletInput
                    required
                    label='Cantidad de estudiantes'
                    type='number'
                    defaultValue={practice?.students ?? 1}
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
                        color: '#1f086e',
                        start: setTime(
                            Temporal.Instant.fromEpochMilliseconds(
                                practice.starts_at.getTime(),
                            ).toZonedDateTimeISO('America/Monterrey'),
                            newStart,
                        ).epochMilliseconds,
                        end:
                            setTime(
                                Temporal.Instant.fromEpochMilliseconds(
                                    practice.starts_at.getTime(),
                                ).toZonedDateTimeISO('America/Monterrey'),
                                newStart,
                            ).epochMilliseconds +
                            newDuration * 60 * 60 * 1000,
                    },
                    ...events.filter(e => e.id !== practice.id),
                ]}
            />
            <Button
                variant='outline'
                onClick={e => {
                    e.preventDefault()
                    setEditMode(DialogMode.INFO)
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
