'use client'

import { CompletInput } from '@/components/Inputs'
import { useAtom } from 'jotai'
import {
    openHourAtom,
    errorOpenHourAtom,
    ClockIcons,
    CLOCK_ICONS,
    Hours,
} from '@/global/managment-laboratory'
import { useState } from 'react'
import { Clock8Icon } from 'lucide-react'

export function OpenHourInput() {
    const [value, setValue] = useAtom(openHourAtom)
    const [error, setError] = useAtom(errorOpenHourAtom)
    const [Icon, setIcon] = useState<ClockIcons>(Clock8Icon)

    return (
        <CompletInput
            required
            label='Apertura'
            type='time'
            name='open_hour'
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
