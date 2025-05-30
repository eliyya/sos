'use client'

import { runQuery } from '@/actions/reports'
import { Button } from '@/components/Button'
import { queryAtom, queryErrorAtom, queryResultAtom } from '@/global/reports'
import { useAtomValue, useSetAtom } from 'jotai'
import { useTransition } from 'react'

export function RunButton() {
    const query = useAtomValue(queryAtom)
    const queryResult = useSetAtom(queryResultAtom)
    const queryError = useSetAtom(queryErrorAtom)
    const [loading, startTransition] = useTransition()
    return (
        <Button
            disabled={loading}
            onClick={() => {
                startTransition(async () => {
                    try {
                        const result = await runQuery(query)
                        queryResult(result as object[])
                    } catch (error) {
                        queryError(`${error}`)
                    }
                })
            }}
        >
            Ejecutar
        </Button>
    )
}
