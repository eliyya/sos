import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'

type SetValue<T> = T | ((prev: T) => T)

export function useQueryParam<T extends string | boolean | number>(
    key: string,
    defaultValue: T,
): [
    T extends boolean ? boolean
    : T extends number ? number
    : string,
    (
        value: SetValue<
            T extends boolean ? boolean
            : T extends number ? number
            : string
        >,
    ) => void,
] {
    const router = useRouter()
    const searchParams = useSearchParams()

    // TODO: Fix this
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const getInitialValue = useCallback((): any => {
        const raw = searchParams.get(key)
        if (typeof defaultValue === 'boolean') {
            return (raw !== null && raw !== '0') as boolean
        }
        if (typeof defaultValue === 'number') {
            return Number(raw ?? defaultValue)
        }
        return (raw ?? defaultValue ?? '') as string
    }, [key, defaultValue, searchParams])

    const [value, setValue] = useState<
        T extends boolean ? boolean
        : T extends number ? number
        : string
    >(getInitialValue)

    useEffect(() => {
        setValue(getInitialValue())
    }, [getInitialValue])

    const setQueryParam = useCallback(
        (
            newValue: SetValue<
                T extends boolean ? boolean
                : T extends number ? number
                : string
            >,
        ) => {
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

            router.replace(`?${params.toString()}`)
            setValue(resolved)
        },
        [key, router, value],
    )

    return [value, setQueryParam]
}
