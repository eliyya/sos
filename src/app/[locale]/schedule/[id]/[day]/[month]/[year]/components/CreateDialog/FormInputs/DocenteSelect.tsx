'use client'

import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { TransitionStartFunction, useCallback, useState } from 'react'
import { getRemainingHours } from '@/actions/classes.actions'
import { CompletAsyncSelect } from '@/components/Select'
import {
    classesAtom,
    createDayAtom,
    remainingHoursAtom,
    selectedClassAtom,
    selectedUserAtom,
} from '@/global/management-practices'
import { classesSelectOptionsAtom } from '@/global/management.globals'
import { searchClasses } from '@/actions/search.actions'

interface DocenteSelectProps {
    startLoadingClasses: TransitionStartFunction
    startLoadingHours: TransitionStartFunction
}
export function DocenteSelect({
    startLoadingClasses,
    startLoadingHours,
}: DocenteSelectProps) {
    const [selectedUser, setSelecctedUser] = useAtom(selectedUserAtom)
    const setClasses = useSetAtom(classesAtom)
    const setSelectedClass = useSetAtom(selectedClassAtom)
    const setRemainingHours = useSetAtom(remainingHoursAtom)
    const timestampStartHour = useAtomValue(createDayAtom)
    const [defaultClassesOptions, setDefaultClassesOptions] = useAtom(
        classesSelectOptionsAtom,
    )
    // TODO: fix type
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [completeClasses, setCompleteClasses] = useState<any[]>([])

    const loadOptions = useCallback(
        (
            inputValue: string,
            callback: (options: { label: string; value: string }[]) => void,
        ) => {
            searchClasses({
                query: inputValue,
            }).then(res => {
                const options = res.classes.map(c => ({
                    label: `${c.teacher.name} - ${c.teacher_id}`,
                    value: c.id,
                }))
                setDefaultClassesOptions(options)
                setCompleteClasses(res.classes)
                callback(options)
            })
        },
        [setDefaultClassesOptions],
    )

    return (
        <CompletAsyncSelect
            label='Docente'
            name='teacher_id'
            defaultOptions={defaultClassesOptions}
            loadOptions={loadOptions}
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
                    setClasses(
                        completeClasses.filter(c => c.teacher_id === o.value),
                    )
                    const [firstClass] = completeClasses.filter(
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
