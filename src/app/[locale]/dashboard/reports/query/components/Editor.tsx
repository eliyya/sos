'use client'

import Editor, { loader } from '@monaco-editor/react'
import { useAtom, useAtomValue } from 'jotai'
import { useEffect, useState } from 'react'
import getSchema from '@/actions/reports'
import { MessageError } from '@/components/Error'
import { queryAtom, queryErrorAtom } from '@/global/reports'

export function SQLEditor() {
    const [schema, setSchema] = useState<Awaited<ReturnType<typeof getSchema>>>(
        [],
    )
    const [query, setQuery] = useAtom(queryAtom)
    const queryError = useAtomValue(queryErrorAtom)

    useEffect(() => {
        getSchema().then(setSchema)
    }, [])

    useEffect(() => {
        loader.init().then(monaco => {
            monaco.languages.registerCompletionItemProvider('sql', {
                provideCompletionItems: (model: any, position: any) => {
                    const word = model.getWordUntilPosition(position)
                    const range = {
                        startLineNumber: position.lineNumber,
                        endLineNumber: position.lineNumber,
                        startColumn: word.startColumn,
                        endColumn: word.endColumn,
                    }

                    // Texto antes del cursor
                    const textUntilPosition = model
                        .getValueInRange({
                            startLineNumber: 1,
                            startColumn: 1,
                            endLineNumber: position.lineNumber,
                            endColumn: position.column,
                        })
                        .toUpperCase()

                    // Ver si está después de "FROM" o "JOIN"
                    const isAfterFrom = /\b(FROM|JOIN)\s+[A-Z0-9_]*$/.test(
                        textUntilPosition,
                    )
                    const isSelectContext =
                        /\b(SELECT|WHERE)\s+[A-Z0-9_,.\s]*$/.test(
                            textUntilPosition,
                        )

                    let suggestions: {
                        label: string
                        kind: number
                        insertText: string
                        range: typeof range
                    }[] = []

                    if (isAfterFrom) {
                        // Sugerencias de tablas
                        const uniqueTables = [
                            ...new Set(schema.map(item => item.table_name)),
                        ]

                        suggestions = uniqueTables.map(tableName => ({
                            label: tableName,
                            kind: monaco.languages.CompletionItemKind.Struct,
                            insertText: tableName,
                            range,
                        }))
                    } else if (isSelectContext) {
                        // Sugerencias de columnas: tabla.columna
                        suggestions = schema.map(item => ({
                            label: `${item.table_name}.${item.column_name}`,
                            kind: monaco.languages.CompletionItemKind.Field,
                            insertText: `${item.table_name}.${item.column_name}`,
                            range,
                        }))
                    } else {
                        // Sugerencias generales de SQL
                        const sqlKeywords = [
                            'SELECT',
                            'FROM',
                            'WHERE',
                            'INSERT INTO',
                            'VALUES',
                            'UPDATE',
                            'SET',
                            'DELETE',
                            'JOIN',
                            'LEFT JOIN',
                            'RIGHT JOIN',
                            'INNER JOIN',
                            'ON',
                            'GROUP BY',
                            'ORDER BY',
                            'LIMIT',
                            'OFFSET',
                            'CREATE TABLE',
                            'ALTER TABLE',
                            'DROP TABLE',
                            'TRUNCATE',
                            'AND',
                            'OR',
                            'NOT',
                        ]

                        suggestions = sqlKeywords.map(keyword => ({
                            label: keyword,
                            kind: monaco.languages.CompletionItemKind.Keyword,
                            insertText: keyword,
                            range,
                        }))
                    }

                    return { suggestions }
                },
            })
        })
    }, [schema])

    return (
        <>
            <Editor
                className='max-w-full'
                height='300px'
                defaultLanguage='sql'
                value={query}
                options={{ fontSize: 20 }}
                onChange={value => setQuery(value ?? '')}
                theme='vs-dark'
            />
            <MessageError>{queryError}</MessageError>
        </>
    )
}
