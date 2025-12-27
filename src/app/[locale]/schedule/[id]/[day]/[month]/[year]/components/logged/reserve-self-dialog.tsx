'use client'

import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useFormReserveStore } from '@/global/schedule.globals'
import { startTransition, use, useEffect, useState, useTransition } from 'react'
import { CurrentLaboratoryContext } from '@/contexts/laboratories.context'
import {
    Clock8Icon,
    ClockFading,
    PencilIcon,
    SquarePenIcon,
    UsersIcon,
} from 'lucide-react'
import { CompletField } from '@/components/ui/complet-field'
import { CLOCK_ICONS, ClockIcons, Hours } from '@/lib/clock'
import { getClassName } from './InfoDialog'
import { searchClassesAction } from '@/actions/search.actions'
import { authClient } from '@/lib/auth-client'
import { Field, FieldLabel } from '@/components/ui/field'
import { reserveLaboratoryAction } from '@/actions/reservations.actions'
import { Temporal } from '@js-temporal/polyfill'
import {
    AsyncCombobox,
    AsyncComboboxItem,
} from '@/components/ui/async-combobox'

interface ReserveDialogProps {
    laboratory_id: string
}
export function ReserveDialog({ laboratory_id }: ReserveDialogProps) {
    const date = useFormReserveStore(s => s.date)
    const setDate = useFormReserveStore(s => s.setDate)
    const { laboratory } = use(CurrentLaboratoryContext)
    const [loading, startTransition] = useTransition()

    return (
        <Dialog
            open={!!date}
            onOpenChange={open => {
                if (!open) setDate(null)
            }}
        >
            <form
                action={data => {
                    const class_id = data.get('class_id') as string
                    const name = data.get('name') as string
                    const topic = data.get('topic') as string
                    const students = data.get('students') as string
                    const start = data.get('start') as string
                    const duration = data.get('duration') as string

                    const starts_at = Temporal.Instant.fromEpochMilliseconds(
                        date ?? 0,
                    )
                        .toZonedDateTimeISO('America/Monterrey')
                        .with({
                            hour: parseInt(start.substring(0, 2), 10),
                            minute: 0,
                            second: 0,
                            microsecond: 0,
                            nanosecond: 0,
                        })
                    const ends_at = starts_at.add({
                        hours: parseInt(duration),
                    })
                    startTransition(async () => {
                        const res = await reserveLaboratoryAction({
                            class_id,
                            name,
                            topic,
                            students: parseInt(students),
                            starts_at: starts_at.epochMilliseconds,
                            ends_at: ends_at.epochMilliseconds,
                            laboratory_id,
                        })
                    })
                }}
            >
                <DialogContent className='sm:max-w-106.25'>
                    <DialogHeader>
                        <DialogTitle>Reserve {laboratory?.name}</DialogTitle>
                        <DialogDescription>
                            Completa la información para reservar un laboratorio
                            en el horario seleccionado
                        </DialogDescription>
                    </DialogHeader>
                    <div className='grid gap-4'>
                        <ClassInput />
                        <NameInput />
                        <TopicInput />
                        <div className='grid grid-cols-2 gap-4'>
                            <StartInput />
                            <DurationInput />
                        </div>
                        <div className='grid grid-cols-2 gap-4'>
                            <StudentsInput />
                            <RestInfo />
                        </div>
                    </div>
                    <DialogFooter>
                        <DialogClose
                            render={<Button variant='outline'>Cancel</Button>}
                        />
                        <Button type='submit' disabled={loading}>
                            Reservar
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </form>
        </Dialog>
    )
}

function ClassInput() {
    const { data: session } = authClient.useSession()
    const [value, setValue] = useState<AsyncComboboxItem | null>(null)

    return (
        <Field>
            <FieldLabel>Clase</FieldLabel>
            <AsyncCombobox
                name='class_id'
                value={value}
                placeholder='Seleccionar clase'
                searchPlaceholder='Buscar clase...'
                disabled={!session}
                onChange={setValue}
                onSearch={async query => {
                    if (!session) return []

                    const classes = await searchClassesAction({
                        teacher_id: session.userId,
                        query,
                    })

                    return classes.classes.map(c => ({
                        value: c.id,
                        label: getClassName({
                            career: c.career,
                            group: c.group,
                            semester: c.semester,
                            subject: c.subject,
                        }),
                    }))
                }}
            />
        </Field>
    )
}

function NameInput() {
    const name = useFormReserveStore(s => s.name)
    const set = useFormReserveStore(s => s.set)

    return (
        <CompletField
            label='Práctica'
            icon={PencilIcon}
            tooltip='Especifica el nombre de la práctica a realizar'
            id='name'
            autoComplete='off'
            required
            value={name}
            onChange={e => set({ name: e.target.value })}
        />
    )
}

function TopicInput() {
    const topic = useFormReserveStore(s => s.topic)
    const set = useFormReserveStore(s => s.set)

    return (
        <CompletField
            label='Tema'
            icon={SquarePenIcon}
            tooltip='Especifica el nombre del tema a realizar'
            id='topic'
            autoComplete='off'
            required
            value={topic}
            onChange={e => set({ topic: e.target.value })}
        />
    )
}

function StartInput() {
    const set = useFormReserveStore(s => s.set)
    const start = useFormReserveStore(s => s.start)
    const [Icon, setIcon] = useState<ClockIcons>(Clock8Icon)

    return (
        <CompletField
            label='Inicio'
            icon={Icon}
            tooltip='La hora de inicio de la reserva'
            id='start'
            autoComplete='off'
            type='time'
            step={3600}
            required
            value={start}
            onChange={e => {
                if (!e.target.value) return
                const time = `${e.target.value.substring(0, 2)}:00`
                set({ start: time })
                setIcon(CLOCK_ICONS[time as Hours])
            }}
        />
    )
}

function DurationInput() {
    const set = useFormReserveStore(s => s.set)
    const duration = useFormReserveStore(s => s.duration)

    return (
        <CompletField
            label='Duración'
            icon={ClockFading}
            tooltip='La duración de la reserva en horas'
            id='duration'
            autoComplete='off'
            type='number'
            min={1}
            required
            value={duration}
            onChange={e => {
                set({ duration: e.target.value })
            }}
        />
    )
}

function StudentsInput() {
    const set = useFormReserveStore(s => s.set)
    const students = useFormReserveStore(s => s.students)

    return (
        <CompletField
            label='Estudiantes'
            icon={UsersIcon}
            tooltip='La cantidad de estudiantes que asistirán'
            id='students'
            autoComplete='off'
            type='number'
            min={1}
            required
            value={students}
            onChange={e => {
                set({ students: e.target.value })
            }}
        />
    )
}

function RestInfo() {
    const [rest] = useState('')

    useEffect(() => {
        startTransition(async () => {})
    }, [])

    return (
        <CompletField
            label='Restante'
            icon={ClockFading}
            tooltip='Las horas de práctica restantes en la actual materia'
            autoComplete='off'
            value={rest}
            disabled
        />
    )
}
