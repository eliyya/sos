'use client'

import { CompletSelect } from '@/components/Select'
import {
    classesAtom,
    createDayAtom,
    remainingHoursAtom,
    selectedClassAtom,
    selectedUserAtom,
} from '@/global/management-practices'
import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { TransitionStartFunction } from 'react'
import { getClassesWithDataFromUser, getRemainingHours } from '@/actions/class'

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
                    const classes = await getClassesWithDataFromUser(o.value, [
                        'subject',
                        'career',
                    ])
                    setClasses(classes)
                    const [firstClass] = classes
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
