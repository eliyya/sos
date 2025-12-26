'use client'

import { Temporal } from '@js-temporal/polyfill'
import { useSetAtom } from 'jotai'
import { Save, Trash, UserIcon } from 'lucide-react'
import { Button } from '@/components/Button'
import { CompletInput } from '@/components/Inputs'
import { DialogMode, modeAtom } from '@/global/management-practices'
import { getClassName } from './InfoDialog'
import {
    PERMISSIONS_FLAGS,
    PermissionsBitField,
} from '@/bitfields/PermissionsBitField'
import { authClient } from '@/lib/auth-client'
import { useParams } from 'next/navigation'
import { getReservationAction } from '@/actions/reservations.actions'

interface InfoModeProps {
    practice: Exclude<Awaited<ReturnType<typeof getReservationAction>>, null>
}
export function InfoMode({ practice }: InfoModeProps) {
    const { id: lab_id } = useParams<{ id: string }>()
    const setEditMode = useSetAtom(modeAtom)
    const session = authClient.useSession()
    const canEdit = new PermissionsBitField(
        BigInt(session.data?.user.permissions ?? 0n),
    ).has(PERMISSIONS_FLAGS.MANAGE_RESERVE)
    const isOwner = session.data?.user.id === practice.teacher_id

    return (
        <>
            <input type='hidden' value={lab_id} name='laboratory_id' />
            <CompletInput
                label='Docente'
                disabled
                value={practice.teacher.name}
                icon={UserIcon}
            />
            {practice.class && (
                <CompletInput
                    label='Clase'
                    disabled
                    value={getClassName(practice.class)}
                    icon={UserIcon}
                />
            )}
            <CompletInput
                label='Practica'
                type='text'
                disabled
                value={practice.name}
                icon={UserIcon}
            />
            <CompletInput
                label='Tema'
                type='text'
                disabled
                value={practice.topic}
                icon={UserIcon}
            />
            <CompletInput
                label='Inicio'
                type='time'
                disabled
                value={`${Temporal.Instant.fromEpochMilliseconds(
                    practice.starts_at.getTime() ?? 0,
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
                    practice.ends_at.getTime() ?? 0,
                )
                    .since(
                        Temporal.Instant.fromEpochMilliseconds(
                            practice.starts_at.getTime() ?? 0,
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
                value={practice.students ?? 1}
                icon={UserIcon}
            />
            {(canEdit || isOwner) && (
                <>
                    <Button onClick={() => setEditMode(DialogMode.EDIT)}>
                        <Save className='mr-2 h-5 w-5' />
                        Editar
                    </Button>
                    <Button
                        variant='destructive'
                        onClick={() => setEditMode(DialogMode.DELETE)}
                    >
                        <Trash className='mr-2 h-5 w-5' />
                        Borrar
                    </Button>
                </>
            )}
        </>
    )
}
