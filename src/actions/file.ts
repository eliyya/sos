'use server'

import { Effect } from 'effect'
import { insertFile } from '@/services/FileService'
import {
    InvalidInputError,
    AlreadyArchivedError,
    AlreadyExistsError,
    UnexpectedError,
} from '@/errors'
import { PrismaLive } from '@/prisma/db'

export async function createFileAction(name: string) {
    // Insertar archivo con Layer
    const program = Effect.provide(insertFile(name), PrismaLive).pipe(
        Effect.match({
            onFailure: error => {
                if (error instanceof InvalidInputError)
                    return {
                        status: 'error' as const,
                        type: 'invalid-input' as const,
                        message: error.message,
                    }
                if (error instanceof AlreadyArchivedError)
                    return {
                        status: 'error' as const,
                        type: 'already-archived' as const,
                        id: error.id,
                    }
                if (error instanceof AlreadyExistsError)
                    return {
                        status: 'error' as const,
                        type: 'already-exists' as const,
                        id: error.id,
                    }
                if (error instanceof UnexpectedError)
                    return {
                        status: 'error' as const,
                        type: 'unexpected' as const,
                        message: String(error.cause),
                    }
                return {
                    status: 'error' as const,
                    type: 'unknown' as const,
                    message: String(error),
                }
            },
            onSuccess: file => ({ status: 'success' as const, file }),
        }),
    )

    // Ejecutar y mapear errores a respuestas
    return await Effect.runPromise(Effect.scoped(program))
}
