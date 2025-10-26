import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'

type SetValue<T> = T | ((prev: T) => T)

function removeEmptyParams(params: URLSearchParams) {
    return params.toString().replace(/([?&][^=]+)=(&|$)/g, '$1$2')
}

export function useQueryParam<T extends string | boolean>(
    key: string,
    defaultValue: T,
): [
    T extends boolean ? boolean : string,
    (value: SetValue<T extends boolean ? boolean : string>) => void,
] {
    const router = useRouter()
    const searchParams = useSearchParams()

    const getInitialValue = (): any => {
        const raw = searchParams.get(key)
        if (typeof defaultValue === 'boolean') {
            return (raw !== null && raw !== 'false') as boolean
        }
        return (raw ?? defaultValue ?? '') as string
    }

    const [value, setValue] =
        useState<T extends boolean ? boolean : string>(getInitialValue)

    useEffect(() => {
        setValue(getInitialValue())
    }, [searchParams])

    const setQueryParam = useCallback(
        (newValue: SetValue<T extends boolean ? boolean : string>) => {
            const resolved =
                typeof newValue === 'function' ?
                    (
                        newValue as (
                            prev: T extends boolean ? boolean : string,
                        ) => T extends boolean ? boolean : string
                    )(value)
                :   newValue

            const params = new URLSearchParams(searchParams.toString())

            if (typeof resolved === 'boolean') {
                if (resolved) params.set(key, '')
                else params.delete(key)
            } else {
                if (resolved) params.set(key, resolved)
                else params.delete(key)
            }
            router.replace(`?${removeEmptyParams(params)}`)

            setValue(resolved)
        },
        [key, router, searchParams, value],
    )

    return [value, setQueryParam]
}
