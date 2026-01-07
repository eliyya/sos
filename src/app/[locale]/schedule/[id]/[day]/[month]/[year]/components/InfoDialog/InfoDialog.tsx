'use client'

import { useAtom } from 'jotai'
import { useEffect, useState } from 'react'
import { getRemainingHours } from '@/actions/classes.actions'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import {
    modeAtom,
    eventInfoAtom,
    DialogMode,
} from '@/global/management-practices'
import { cn } from '@/lib/utils'
import { DeleteMode } from './DeleteMode'
import { EditMode } from './EditMode'
import { InfoMode } from './InfoMode'
import { getReservationAction } from '@/actions/reservations.actions'

interface InfoDialogProps {
    lab: {
        name: string
        id: string
        close_hour: number
        open_hour: number
    }
}
export function InfoDialog({ lab }: InfoDialogProps) {
    const [mode, setMode] = useAtom(modeAtom)
    const [currentEvent, setCurrentEvent] = useAtom(eventInfoAtom)
    const [practice, setPractice] = useState<Awaited<
        ReturnType<typeof getReservationAction>
    > | null>()
    const [remainingHours, setRemainingHours] = useState({
        leftHours: Infinity,
        allowedHours: 0,
        usedHours: 0,
    })

    useEffect(() => {
        getReservationAction({ id: currentEvent?.id ?? '' })
            .then(p => {
                if (p) {
                    setPractice(p)
                    if (p.class)
                        getRemainingHours({
                            classId: p.class.id,
                            day: p.starts_at.getTime(),
                        }).then(remainingHours =>
                            setRemainingHours(remainingHours),
                        )
                }
            })
            .catch(error => {
                console.error('Error fetching practice:', error)
            })
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
                        {mode === DialogMode.EDIT ?
                            'Editar'
                        : mode === DialogMode.INFO ?
                            'Info'
                        :   'Eliminar'}
                    </DialogTitle>
                    {mode === DialogMode.DELETE && (
                        <DialogDescription>
                            ¿Estas seguro de eliminar la practica? esta accion
                            es irreversible
                        </DialogDescription>
                    )}
                </DialogHeader>
                {mode === DialogMode.EDIT ?
                    <EditMode
                        lab={lab}
                        practice={practice}
                        remainingHours={remainingHours}
                    />
                : mode === DialogMode.INFO ?
                    <InfoMode practice={practice} />
                : mode === DialogMode.DELETE ?
                    <DeleteMode practice={practice} />
                :   null}
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
