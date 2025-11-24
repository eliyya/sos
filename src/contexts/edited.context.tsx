'use client'

import { createContext, useCallback, useState } from 'react'

export const EditingContext = createContext<ReturnType<typeof useEditing>>(
    null!,
)

export const RESET_VALUE = Symbol('RESET_VALUE')

interface EditingProviderProps {
    children: React.ReactNode
}
export const EditingProvider = ({ children }: EditingProviderProps) => {
    const editing = useEditing()
    return (
        <EditingContext.Provider value={editing}>
            {children}
        </EditingContext.Provider>
    )
}

export function useEditing() {
    const [editing, updateEditing] = useState(new Map<string, unknown>())
    const [resetSignal, reset] = useState(() => Symbol('RESET_EDITING'))
    const [selected, setSelected] = useState(() => new Set<string>())
    const [selectSignal, setSelect] = useState(() => Symbol('SELECT'))
    const [deselectSignal, setDeselect] = useState(() => Symbol('SELECT'))

    const setEditing = (id: string, value: unknown | typeof RESET_VALUE) => {
        updateEditing(prev => {
            console.log({ id, value, editing, rese: value === RESET_VALUE })

            if (value === RESET_VALUE) prev.delete(id)
            else prev.set(id, value)

            return new Map(prev)
        })
    }

    const cancell = useCallback(() => {
        updateEditing(new Map())
        reset(() => Symbol('RESET_EDITING'))
        setSelected(new Set())
    }, [])

    const select = useCallback((id: string, cheked: boolean) => {
        setSelected(prev => {
            if (cheked) prev.add(id)
            else prev.delete(id)
            return new Set(prev)
        })
    }, [])

    const selectAll = useCallback(() => {
        setSelect(Symbol('SELECT'))
    }, [])

    const deselectAll = useCallback(() => {
        setDeselect(Symbol('DESELECT'))
    }, [])

    return {
        editing,
        setEditing,
        cancell,
        resetSignal,
        selected,
        select,
        selectSignal,
        deselectSignal,
        selectAll,
        deselectAll,
    }
}
