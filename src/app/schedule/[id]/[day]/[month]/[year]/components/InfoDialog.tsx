'use client'

import { findFirstPractice } from '@/actions/practices'
import { Button } from '@/components/Button'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/Dialog'
import { MessageError } from '@/components/Error'
import { openInfoAtom, selectedEventAtom } from '@/global/management-practices'
import { cn, secondsToTime } from '@/lib/utils'
import FullCalendar from '@fullcalendar/react'
import { useAtom } from 'jotai'
import { Save, UserIcon } from 'lucide-react'
import { useEffect, useState, useTransition } from 'react'
import interactionPlugin from '@fullcalendar/interaction'
import timeGridPlugin from '@fullcalendar/timegrid'
import { JWTPayload } from 'jose'
import { CompletInput } from '@/components/Inputs'
import { getRemainingHours } from '@/actions/class'
import { ScheduleEvent } from '@/types/schedule'
import { Temporal } from '@js-temporal/polyfill'

interface InfoDialogProps {
    lab: {
        name: string
        id: string
        close_hour: number
        open_hour: number
    }
    user: JWTPayload | null
    isAdmin?: boolean
}

export function InfoDialog({ lab, isAdmin, user }: InfoDialogProps) {
    const [open, setOpen] = useAtom(openInfoAtom)
    const [message] = useState('')
    const [editMode, setEditMode] = useState(false)
    const [currentEvent] = useAtom(selectedEventAtom)
    const [isLoadingHours, startLoadingHours] = useTransition()
    const [practice, setPractice] = useState<Awaited<
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
    > | null>()

    const [remainingHours, setRemainingHours] = useState({
        leftHours: Infinity,
        allowedHours: 0,
        usedHours: 0,
    })
    useEffect(() => {
        startLoadingHours(async () => {
            if (!practice?.class)
                return setRemainingHours({
                    leftHours: Infinity,
                    allowedHours: 0,
                    usedHours: 0,
                })
            const remainingHours = await getRemainingHours({
                classId: practice.class.id,
                day: practice.starts_at.getTime(),
            })
            setRemainingHours(remainingHours)
        })
    }, [practice])

    useEffect(() => {
        findFirstPractice({
            where: {
                id: currentEvent?.id,
            },
            include: {
                teacher: true,
                class: {
                    include: {
                        subject: true,
                        career: true,
                    },
                },
            },
        })
            .then(p => {
                if (p) {
                    setPractice(p)
                }
            })
            .catch(error => {
                console.error('Error fetching practice:', error)
            })
    }, [currentEvent, setPractice])

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Info</DialogTitle>
                </DialogHeader>
                <div className='flex gap-8'>
                    <form
                        className='flex w-full max-w-md flex-1/2 flex-col justify-center gap-6'
                        action={() => {}}
                    >
                        {message && <MessageError>{message}</MessageError>}
                        <input
                            type='hidden'
                            value={lab.id}
                            name='laboratory_id'
                        />
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
                        {editMode && (
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
                        )}
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
                            value={practice?.students ?? 1}
                            icon={UserIcon}
                        />
                        {editMode && (
                            <CompletInput
                                required
                                label='Contraseña'
                                type='password'
                                placeholder='* * * * * * * *'
                                icon={UserIcon}
                            />
                        )}
                        {editMode ?
                            <div className='flex gap-2'>
                                <Button
                                    variant='outline'
                                    onClick={e => {
                                        e.preventDefault()
                                        setEditMode(false)
                                    }}
                                >
                                    <Save className='mr-2 h-5 w-5' />
                                    Cancelar
                                </Button>
                                <Button
                                    type='submit'
                                    disabled={
                                        // inTransition ||
                                        isLoadingHours ||
                                        // isLoadingClasses ||
                                        // (remainingHours.leftHours < 1 && !isAdmin)
                                        false
                                    }
                                >
                                    <Save className='mr-2 h-5 w-5' />
                                    Guardar
                                </Button>
                            </div>
                        : isAdmin || isOwner(user, currentEvent) ?
                            <Button
                                type='submit'
                                disabled={
                                    // inTransition ||
                                    // isLoadingHours ||
                                    // isLoadingClasses ||
                                    // (remainingHours.leftHours < 1 && !isAdmin)
                                    false
                                }
                                onClick={e => {
                                    e.preventDefault()
                                    setEditMode(true)
                                }}
                            >
                                <Save className='mr-2 h-5 w-5' />
                                Editar
                            </Button>
                        :   null}
                    </form>
                    <div className={cn('flex-1/2', { hidden: !editMode })}>
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
                            initialDate={currentEvent?.start}
                            // events={[...events, actualEvent]}
                        />
                    </div>
                </div>
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

function getClassName({ subject, career, group, semester }: getClassNameProps) {
    return `${subject.name} - ${career.alias ?? career.name}${group}-${semester}`
}
function isOwner(user: JWTPayload | null, currentEvent: ScheduleEvent | null) {
    return !!(user && currentEvent && user.sub === currentEvent.ownerId)
}
