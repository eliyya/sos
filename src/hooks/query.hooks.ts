'use client'
import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'

export function useQueryParam<T extends string | boolean | number>(
    key: string,
    defaultValue: T,
) {
    const router = useRouter()
    const searchParams = useSearchParams()

    const getValueFromParams = useCallback(() => {
        const raw = searchParams.get(key)

        if (typeof defaultValue === 'boolean') {
            return (raw !== null && raw !== '0') as any
        }

        if (typeof defaultValue === 'number') {
            return Number(raw ?? defaultValue)
        }

        return (raw ?? defaultValue ?? '') as any
    }, [key, defaultValue])

    const [value, setValue] = useState<T>(() => getValueFromParams())

    // Solo ejecutarse si el valor REAL cambia, no si "searchParams" cambia de referencia
    useEffect(() => {
        const newValue = getValueFromParams()
        if (newValue !== value) {
            setValue(newValue)
        }
    }, [getValueFromParams, value])

    const setQueryParam = useCallback(
        (newValue: any) => {
            const resolved =
                typeof newValue === 'function' ? newValue(value) : newValue

            const params = new URLSearchParams(window.location.search)

            if (typeof resolved === 'boolean') {
                if (resolved) params.set(key, '1')
                else params.delete(key)
            } else if (typeof resolved === 'number') {
                params.set(key, resolved.toString())
            } else {
                if (resolved) params.set(key, resolved)
                else params.delete(key)
            }

            router.replace(`?${params}`)
            setValue(resolved)
        },
        [value, key, router],
    )

    return [value, setQueryParam] as const
}
