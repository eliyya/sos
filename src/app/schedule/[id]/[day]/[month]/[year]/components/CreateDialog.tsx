'use client'

import {
    actualEventAtom,
    createDayAtom,
    eventsAtom,
    newEventSignalAtom,
    openCreateAtom,
} from '@/global/management-practices'
import { Dialog, DialogContent, DialogTitle } from '@/components/Dialog'
import interactionPlugin from '@fullcalendar/interaction'
import timeGridPlugin from '@fullcalendar/timegrid'
import { CompletSelect } from '@/components/Select'
import { CompletInput } from '@/components/Inputs'
import { useEffect, useState, useTransition } from 'react'
import FullCalendar from '@fullcalendar/react'
import { Button } from '@/components/Button'
import { User, Save } from 'lucide-react'
import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { secondsToTime } from '@/lib/utils'
import { getClassesWithDataFromUser, getRemainingHours } from '@/actions/class'
import { MessageError } from '@/components/Error'
import { setAsideLaboratory } from '@/actions/laboratory'
import { Temporal } from '@js-temporal/polyfill'
import { UserTokenPayload } from '@/lib/types'

type ClassForSelect = Awaited<
    ReturnType<typeof getClassesWithDataFromUser<['subject', 'career']>>
>[number]
interface CreateDialogProps {
    users: {
        id: string
        name: string
    }[]
    lab: {
        name: string
        id: string
        /**
         * * The end hour of the laboratory in minutes from 00:00
         */
        close_hour: number
        /**
         * * The start hour of the laboratory in minutes from 00:00
         */
        open_hour: number
    }
    isAdmin?: boolean
    user: UserTokenPayload | null
}
export function CreateDialog({ users, lab, isAdmin, user }: CreateDialogProps) {
    console.log([
        {
            value: user?.sub ?? '',
            label: user?.name ?? '',
        },
        ...users.map(u => ({
            value: u.id,
            label: u.name,
        })),
    ])

    const [open, setOpen] = useAtom(openCreateAtom)
    const [message, setMessage] = useState('')
    const [inTransition, startTransition] = useTransition()
    const [timestampStartHour, setTimestampStartHour] = useAtom(createDayAtom)
    const [actualEvent, setActualEvent] = useAtom(actualEventAtom)
    const [endTime, setEndTime] = useState('1')
    const [title, setTitle] = useState('')
    const [topic, setTopic] = useState('')
    const [classes, setClasses] = useState<ClassForSelect[]>([])
    const [selectedUser, setSelecctedUser] = useState({
        name: user?.name ?? '',
        id: user?.sub ?? '',
    })
    const sendEventSignal = useSetAtom(newEventSignalAtom)
    const [selectedClass, setSelectedClass] = useState<ClassForSelect | null>(
        null,
    )
    const [startHourError, setStartHourError] = useState('')
    const [endHourError, setEndHourError] = useState('')
    const events = useAtomValue(eventsAtom)
    const [isLoadingClasses, startLoadingClasses] = useTransition()
    const [isLoadingHours, startLoadingHours] = useTransition()
    const [remainingHours, setRemainingHours] = useState({
        leftHours: Infinity,
        allowedHours: 0,
        usedHours: 0,
    })

    useEffect(() => {
        startLoadingClasses(async () => {
            const classes = await getClassesWithDataFromUser(
                selectedUser?.id ?? '',
                ['subject', 'career'],
            )
            setClasses(classes)
            const [firstClass] = classes
            if (firstClass) setSelectedClass(firstClass)
        })
    }, [selectedUser, user, isAdmin])

    useEffect(() => {
        startLoadingHours(async () => {
            if (!selectedClass)
                return setRemainingHours({
                    leftHours: Infinity,
                    allowedHours: 0,
                    usedHours: 0,
                })
            const remainingHours = await getRemainingHours({
                classId: selectedClass.id,
                day: timestampStartHour,
            })
            setRemainingHours(remainingHours)
        })
    }, [selectedClass, timestampStartHour])

    useEffect(() => {
        const start =
            Temporal.Instant.fromEpochMilliseconds(
                timestampStartHour,
            ).toZonedDateTimeISO('America/Monterrey')
        const end = start.add({
            hours: parseInt(endTime) || 1,
        })
        setActualEvent(a => ({
            ...a,
            start: start.epochMilliseconds,
            end: end.epochMilliseconds,
            ownerId: selectedUser?.id ?? '',
        }))
        // validate start hour
        const openHourDate = start.with({
            hour: Math.floor(lab.open_hour / 60),
        })
        const closeHourDate = start.with({
            hour: Math.floor(lab.close_hour / 60),
        })
        const hasEmpalmInStartHour = events.some(
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
                'El laboratorio ya tiene un evento en el mismo horario.',
            )
        else setStartHourError('')
        // validate end hour
        const hasEmpalmInEndHour = events.some(
            e =>
                end.epochMilliseconds > e.start &&
                end.epochMilliseconds <= e.end,
        )
        const wrapsExistingEvent = events.some(
            e =>
                start.epochMilliseconds <= e.start &&
                end.epochMilliseconds >= e.end,
        )

        if (end.epochMilliseconds > closeHourDate.epochMilliseconds)
            setEndHourError(
                'La hora de salida de la practica debe ser menor que la de cierre del laboratorio.',
            )
        else if (hasEmpalmInEndHour)
            setEndHourError(
                'El laboratorio ya tiene un evento en el mismo horario.',
            )
        else if (wrapsExistingEvent)
            setEndHourError(
                'El laboratorio ya tiene un evento en el mismo horario.',
            )
        else if (remainingHours.leftHours < (parseInt(endTime) || 1))
            setEndHourError('No hay suficientes horas restantes.')
        else setEndHourError('')
    }, [
        timestampStartHour,
        setActualEvent,
        endTime,
        lab,
        events,
        selectedUser,
        remainingHours,
    ])

    useEffect(() => {
        // modify actual event
        setActualEvent(a => ({ ...a, title }))
    }, [setActualEvent, title])

    return (
        <Dialog open={open && !!user} onOpenChange={setOpen}>
            <DialogContent className='w-full max-w-4xl'>
                <DialogTitle className='flex flex-col gap-4'>
                    <span className='w-full text-center text-3xl'>
                        Apartar el laboratorio &quot;{lab.name}&quot;
                    </span>
                </DialogTitle>
                <div className='flex gap-8'>
                    <form
                        className='flex w-full max-w-md flex-1/2 flex-col justify-center gap-6'
                        action={data => {
                            startTransition(async () => {
                                const { message } =
                                    await setAsideLaboratory(data)
                                if (message) setMessage(message)
                                else {
                                    setOpen(false)
                                    sendEventSignal(Symbol())
                                }
                                setTimeout(() => {
                                    setMessage('')
                                }, 5_000)
                            })
                        }}
                    >
                        {message && <MessageError>{message}</MessageError>}
                        <input
                            type='hidden'
                            value={lab.id}
                            name='laboratory_id'
                        />
                        <input
                            type='hidden'
                            value={timestampStartHour}
                            name='starts_at'
                        />
                        <CompletSelect
                            label='Docente'
                            name='teacher_id'
                            options={[
                                {
                                    value: user?.sub ?? '',
                                    label: user?.name ?? '',
                                },
                                ...users.map(u => ({
                                    value: u.id,
                                    label: u.name,
                                })),
                            ]}
                            isClearable={false}
                            isDisabled={users.length === 1}
                            value={{
                                label: selectedUser.name,
                                value: selectedUser.id,
                            }}
                            onChange={async o => {
                                if (!o) return
                                setSelecctedUser({
                                    name: o.label,
                                    id: o.value,
                                })
                            }}
                        />
                        <CompletSelect
                            label='Clase'
                            name='class_id'
                            required={!isAdmin}
                            isClearable={isAdmin}
                            isDisabled={
                                (users.length === 1 && !isAdmin) ||
                                isLoadingClasses
                            }
                            options={classes.map(c => ({
                                value: c.id,
                                label:
                                    c.subject.name +
                                    ' - ' +
                                    (c.career.alias ?? c.career.name) +
                                    c.group,
                            }))}
                            value={
                                !selectedClass ? null : (
                                    {
                                        /**
                                         * @description The value of the selected class in format
                                         * `{subject.name} - {career.name}{group}`
                                         * @example 'Matematicas - ISC1'
                                         */
                                        label:
                                            selectedClass.subject.name +
                                            ' - ' +
                                            (selectedClass.career.alias ??
                                                selectedClass.career.name) +
                                            selectedClass.group,
                                        value: selectedClass?.id ?? '',
                                    }
                                )
                            }
                            onChange={async o => {
                                if (!o) return setSelectedClass(null)
                                const selected = classes.find(
                                    c => c.id === o.value,
                                )
                                if (selected) setSelectedClass(selected)
                            }}
                        />
                        <CompletInput
                            label='Horas restantes'
                            type='text'
                            disabled
                            value={
                                remainingHours.leftHours === Infinity ?
                                    'Infinitas'
                                :   `${remainingHours.leftHours}/${remainingHours.allowedHours}`
                            }
                            icon={User}
                        />
                        <CompletInput
                            required
                            label='Practica'
                            type='text'
                            name='name'
                            value={title}
                            onChange={e => {
                                setTitle(e.target.value)
                            }}
                            icon={User}
                        />
                        <CompletInput
                            required
                            label='Tema'
                            type='text'
                            name='topic'
                            value={topic}
                            onChange={e => {
                                setTopic(e.target.value)
                            }}
                            icon={User}
                        />
                        <CompletInput
                            required
                            label='Inicio'
                            type='time'
                            error={startHourError}
                            value={`${Temporal.Instant.fromEpochMilliseconds(
                                timestampStartHour,
                            )
                                .toZonedDateTimeISO('America/Monterrey')
                                .hour.toString()
                                .padStart(2, '0')}:00`}
                            onChange={e => {
                                const actual =
                                    Temporal.Instant.fromEpochMilliseconds(
                                        timestampStartHour,
                                    ).toZonedDateTimeISO('America/Monterrey')
                                const changed = actual.add({
                                    hours:
                                        parseInt(e.target.value.split(':')[0]) -
                                        actual.hour,
                                })
                                setTimestampStartHour(changed.epochMilliseconds)
                            }}
                            min={secondsToTime(lab.open_hour * 60)}
                            icon={User}
                        />
                        <CompletInput
                            required
                            label='Tiempo en horas'
                            type='number'
                            name='time'
                            min={1}
                            value={endTime}
                            error={endHourError}
                            onChange={e => {
                                setEndTime(e.target.value)
                            }}
                            icon={User}
                        />
                        <CompletInput
                            required
                            label='Cantidad de estudiantes'
                            type='number'
                            name='students'
                            min={1}
                            defaultValue={1}
                            icon={User}
                        />
                        <CompletInput
                            required
                            label='Contraseña'
                            type='password'
                            name='password'
                            placeholder='* * * * * * * *'
                            icon={User}
                        />
                        <Button
                            type='submit'
                            disabled={
                                inTransition ||
                                isLoadingHours ||
                                isLoadingClasses ||
                                (remainingHours.leftHours < 1 && !isAdmin)
                            }
                        >
                            <Save className='mr-2 h-5 w-5' />
                            Apartar
                        </Button>
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
                            slotMinTime={secondsToTime(
                                lab.open_hour * 60,
                                'HH:mm:ss',
                            )}
                            slotMaxTime={secondsToTime(
                                lab.close_hour * 60,
                                'HH:mm:ss',
                            )}
                            height='auto'
                            initialDate={timestampStartHour}
                            events={[...events, actualEvent]}
                        />
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
