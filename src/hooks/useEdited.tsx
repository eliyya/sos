import { useCallback, useRef, useState } from 'react'

export function useEdited() {
    const [isSomethingEdited, setSomethingEdited] = useState(false)

    const dicRef = useRef<Record<symbol, boolean>>({})

    const setEdit = useCallback((id: symbol, state: boolean) => {
        if (dicRef.current[id] === !!state) return
        dicRef.current[id] = !!state
        if (state) return setSomethingEdited(true)
        if (!Object.values(dicRef.current).some(v => v))
            setSomethingEdited(false)
    }, [])

    const register = useCallback(() => {
        const id = Symbol()

        return (state: boolean) => setEdit(id, state)
    }, [setEdit])

    return [isSomethingEdited, register] as [
        isSomethingEdited: boolean,
        register: typeof register,
    ]
}
