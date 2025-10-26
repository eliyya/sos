'use client'

import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { TransitionStartFunction } from 'react'
import { getRemainingHours } from '@/actions/classes.actions'
import { CompletSelect } from '@/components/Select'
import {
    classesAtom,
    createDayAtom,
    remainingHoursAtom,
    selectedClassAtom,
    selectedUserAtom,
} from '@/global/management-practices'
import { useClasses } from '@/hooks/classes.hooks'

interface DocenteSelectProps {
    options: { label: string; value: string }[]
    startLoadingClasses: TransitionStartFunction
    startLoadingHours: TransitionStartFunction
}
export function DocenteSelect({
    options,
    startLoadingClasses,
    startLoadingHours,
}: DocenteSelectProps) {
    const [selectedUser, setSelecctedUser] = useAtom(selectedUserAtom)
    const setClasses = useSetAtom(classesAtom)
    const setSelectedClass = useSetAtom(selectedClassAtom)
    const setRemainingHours = useSetAtom(remainingHoursAtom)
    const timestampStartHour = useAtomValue(createDayAtom)
    const { classes } = useClasses()

    return (
        <CompletSelect
            label='Docente'
            name='teacher_id'
            options={options}
            isClearable={false}
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
                startLoadingClasses(async () => {
                    setClasses(classes.filter(c => c.teacher_id === o.value))
                    const [firstClass] = classes.filter(
                        c => c.teacher_id === o.value,
                    )
                    if (firstClass) {
                        setSelectedClass(firstClass)
                        startLoadingHours(async () => {
                            const remainingHours = await getRemainingHours({
                                classId: firstClass.id,
                                day: timestampStartHour,
                            })
                            setRemainingHours(remainingHours)
                        })
                    }
                })
            }}
        />
    )
}
