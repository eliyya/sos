'use client'

import { Clock8Icon } from 'lucide-react'
import { CompletInput } from '@/components/Inputs'
import { useAtom } from 'jotai'
import {
    CLOCK_ICONS,
    ClockIcons,
    closeHourAtom,
    errorCloseHourAtom,
    Hours,
} from '@/global/managment-laboratory'
import { useState } from 'react'

export function CloseHourInput() {
    const [value, setValue] = useAtom(closeHourAtom)
    const [error, setError] = useAtom(errorCloseHourAtom)
    const [Icon, setIcon] = useState<ClockIcons>(Clock8Icon)

    return (
        <CompletInput
            required
            label='Cierre'
            type='time'
            name='close_hour'
            icon={Icon}
            value={value}
            onChange={e => {
                setValue(e.target.value)
                setError('')
                const hour = e.target.value.split(':')[0]
                setIcon(CLOCK_ICONS[`${hour}:00` as Hours])
            }}
            error={error}
        />
    )
}
