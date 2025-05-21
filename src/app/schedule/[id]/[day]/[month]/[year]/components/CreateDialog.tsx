'use client'

import {
    actualEventAtom,
    createDayAtom,
    openCreateAtom,
} from '@/global/management-practices'
import { Dialog, DialogContent, DialogTitle } from '@/components/Dialog'
import interactionPlugin from '@fullcalendar/interaction'
import { EventInput } from '@fullcalendar/core/index.js'
import timeGridPlugin from '@fullcalendar/timegrid'
import { CompletSelect } from '@/components/Select'
import { CompletInput } from '@/components/Inputs'
import { useEffect, useState, useTransition } from 'react'
import FullCalendar from '@fullcalendar/react'
import { Button } from '@/components/Button'
import { User, Save } from 'lucide-react'
import { useAtom } from 'jotai'
import { minutesToTime } from '@/lib/utils'
import { getClassesWithDataFromUser } from '@/actions/class'
import { MessageError } from '@/components/Error'
import { setAsideLaboratory } from '@/actions/laboratory'
import { Temporal } from '@js-temporal/polyfill'

type ClassForSelect = Awaited<
    ReturnType<typeof getClassesWithDataFromUser<['subject', 'career']>>
>[number]
interface CreateDialogProps {
    users: {
        id: string
        name: string
    }[]
    disabled?: boolean
    /**
     * * The start hour of the laboratory in minutes from 00:00
     */
    startHour: number
    /**
     * * The end hour of the laboratory in minutes from 00:00
     */
    endHour: number
    events: EventInput[]
    lab: {
        name: string
        id: string
    }
    isAdmin?: boolean
    user: {
        id: string
        name: string
    }
}
export function CreateDialog({
    users,
    disabled,
    events,
    endHour,
    startHour,
    lab,
    isAdmin,
    user,
}: CreateDialogProps) {
    const [open, setOpen] = useAtom(openCreateAtom)
    const [message, setMessage] = useState('')
    const [inTransition, startTransition] = useTransition()
    const [timestampStartHour, setTimestampStartHour] = useAtom(createDayAtom)
    const [actualEvent, setActualEvent] = useAtom(actualEventAtom)
    const [startHourInputValue, setStartHourInputValue] = useState('08:00')
    const [endTime, setEndTime] = useState(1)
    const [title, setTitle] = useState('')
    const [topic, setTopic] = useState('')
    const [classes, setClasses] = useState<ClassForSelect[]>([])
    const [selectedUser, setSelecctedUser] = useState({
        name: user.name,
        id: user.id,
    })

    const [selectedClass, setSelectedClass] = useState<ClassForSelect | null>(
        null,
    )

    useEffect(() => {
        getClassesWithDataFromUser(selectedUser.id, ['subject', 'career']).then(
            d => {
                setClasses(d)
                if (d.length > 0) {
                    setSelectedClass(d[0])
                }
            },
        )
    }, [selectedUser, user, isAdmin])

    useEffect(() => {
        setStartHourInputValue(
            new Date(timestampStartHour)
                .getHours()
                .toString()
                .padStart(2, '0') +
                ':' +
                new Date(timestampStartHour)
                    .getMinutes()
                    .toString()
                    .padStart(2, '0'),
        )
    }, [timestampStartHour])

    useEffect(() => {
        const start = new Date(timestampStartHour)
        start.setHours(
            parseInt(startHourInputValue.split(':')[0]),
            parseInt(startHourInputValue.split(':')[1]),
        )
        const end = new Date(start)
        end.setHours(end.getHours() + endTime)
        setActualEvent(a => ({ ...a, start, end }))
    }, [timestampStartHour, setActualEvent, startHourInputValue, endTime])

    useEffect(() => {
        setActualEvent(a => ({ ...a, title }))
    }, [setActualEvent, title])

    return (
        <Dialog open={open && !disabled} onOpenChange={setOpen}>
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
                                else setOpen(false)
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
                                { value: user.id, label: user.name },
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
                            isDisabled={users.length === 1 && !isAdmin}
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
                                const changued = actual.add({
                                    hours:
                                        parseInt(e.target.value.split(':')[0]) -
                                        actual.hour,
                                })
                                setTimestampStartHour(
                                    changued.epochMilliseconds,
                                )
                            }}
                            min={minutesToTime(startHour)}
                            icon={User}
                        />
                        <CompletInput
                            required
                            label='Tiempo en horas'
                            type='number'
                            name='time'
                            min={1}
                            value={endTime}
                            onChange={e => {
                                const value = parseInt(e.target.value)
                                setEndTime(value)
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
                        <Button type='submit' disabled={inTransition}>
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
                            headerToolbar={{
                                left: 'title',
                                center: '',
                                right: '',
                            }}
                            slotMinTime={minutesToTime(startHour) + ':00'}
                            slotMaxTime={minutesToTime(endHour) + ':00'}
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
