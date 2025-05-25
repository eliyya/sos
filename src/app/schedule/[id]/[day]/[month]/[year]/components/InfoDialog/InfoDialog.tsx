'use client'

import { editModeAtom, eventInfoAtom } from '@/global/management-practices'
import { findFirstPractice } from '@/actions/practices'
import { getRemainingHours } from '@/actions/class'
import { useAtom } from 'jotai'
import { useEffect, useState } from 'react'
import { EditMode } from './EditMode'
import { InfoMode } from './InfoMode'
import { JWTPayload } from 'jose'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/Dialog'
import { cn } from '@/lib/utils'

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
    const [editMode, setEditMode] = useAtom(editModeAtom)
    const [currentEvent, setCurrentEvent] = useAtom(eventInfoAtom)
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
                (op === false && setCurrentEvent(null)) || setEditMode(false)
            }
        >
            <DialogContent
                className={cn({
                    'w-full max-w-4xl': editMode,
                })}
            >
                <DialogHeader className='flex flex-col gap-4'>
                    <DialogTitle className='w-full text-center text-3xl'>
                        {editMode ? 'Editar' : 'Info'}
                    </DialogTitle>
                </DialogHeader>
                {!editMode ?
                    <InfoMode
                        lab={lab}
                        practice={practice}
                        isAdmin={isAdmin}
                        isOwner={
                            !!(
                                user &&
                                currentEvent &&
                                user.sub === currentEvent.ownerId
                            )
                        }
                    />
                :   <EditMode
                        lab={lab}
                        practice={practice}
                        remainingHours={remainingHours}
                    />
                }
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
