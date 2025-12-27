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
import { startTransition, use, useEffect, useState } from 'react'
import { CurrentLaboratoryContext } from '@/contexts/laboratories.context'
import {
    ChevronDownIcon,
    Clock8Icon,
    ClockFading,
    PencilIcon,
    SquarePenIcon,
    UsersIcon,
} from 'lucide-react'
import { CompletField } from '@/components/ui/complet-field'
import { CLOCK_ICONS, ClockIcons, Hours } from '@/lib/clock'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover'
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command'
import { getClassName } from './InfoDialog'
import { searchClassesAction } from '@/actions/search.actions'
import { authClient } from '@/lib/auth-client'
import { Field, FieldLabel } from '@/components/ui/field'

export function ReserveDialog() {
    const date = useFormReserveStore(s => s.date)
    const setDate = useFormReserveStore(s => s.setDate)
    const { laboratory } = use(CurrentLaboratoryContext)

    return (
        <Dialog
            open={!!date}
            onOpenChange={open => {
                if (!open) setDate(null)
            }}
        >
            <form>
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
                        <Button type='submit'>Reservar</Button>
                    </DialogFooter>
                </DialogContent>
            </form>
        </Dialog>
    )
}

function ClassInput() {
    const [value, setValue] = useState<{ id: string; label: string } | null>(
        null,
    )
    const [open, setOpen] = useState(false)
    const [search, setSearch] = useState('')
    const { data: session } = authClient.useSession()
    const [items, setItems] = useState<{ id: string; label: string }[]>([])

    useEffect(() => {
        if (!session) return
        const timeout = setTimeout(() => {
            startTransition(async () => {
                const classes = await searchClassesAction({
                    teacher_id: session.userId,
                    query: search,
                })
                setItems(
                    classes.classes.map(c => ({
                        id: c.id,
                        label: getClassName({
                            career: c.career,
                            group: c.group,
                            semester: c.semester,
                            subject: c.subject,
                        }),
                    })),
                )
            })
        }, 500)
        return () => clearTimeout(timeout)
    }, [search, session])

    return (
        <Field>
            <Popover open={open} onOpenChange={setOpen}>
                <FieldLabel onClick={() => setOpen(true)} htmlFor='class'>
                    Clase
                </FieldLabel>
                <PopoverTrigger
                    render={
                        <Button
                            variant='outline'
                            role='combobox'
                            className='w-50 justify-between'
                            aria-expanded={open}
                        >
                            {value ? value.label : 'Seleccionar Clase'}
                            <ChevronDownIcon className='opacity-50' />
                        </Button>
                    }
                />
                <PopoverContent className='w-75 p-0'>
                    <Command>
                        <CommandInput
                            id='class'
                            placeholder='Buscar clase...'
                            onValueChange={setSearch}
                        />
                        <CommandList>
                            <CommandEmpty>No hay resultados</CommandEmpty>
                            <CommandGroup>
                                {items.map(item => (
                                    <CommandItem
                                        key={item.id}
                                        value={item.label}
                                        onSelect={() => {
                                            setValue(item)
                                            setOpen(false)
                                        }}
                                    >
                                        {item.label}
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
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
            id='duration'
            autoComplete='off'
            value={rest}
            disabled
        />
    )
}
