'use server'

import {
    AlreadyArchivedError,
    InvalidInputError,
    NotFoundError,
    PermissionError,
    PrismaError,
    UnauthorizedError,
    UnexpectedError,
} from '@/errors'
import { AuthLive } from '@/layers/auth.layer'
import { PrismaLive } from '@/layers/db.layer'
import { SuccessOf } from '@/lib/type-utils'
import {
    availableMachineEffect,
    createMachineEffect,
    deleteMachineEffect,
    editMachineEffect,
    getMachinesEffect,
    maintainanceMachineEffect,
    searchMachinesEffect,
} from '@/services/machines.service'
import { Effect } from 'effect'

export async function getMachines() {
    return await Effect.runPromise(
        Effect.scoped(
            getMachinesEffect()
                .pipe(Effect.provide(PrismaLive))
                .pipe(
                    Effect.match({
                        onSuccess: machines => machines,
                        onFailure: error => {
                            console.log(error)
                            return []
                        },
                    }),
                ),
        ),
    )
}

type CreateMachineProps = Parameters<typeof createMachineEffect>[0]
export async function createMachine(formData: CreateMachineProps) {
    return await Effect.runPromise(
        Effect.scoped(
            createMachineEffect(formData)
                .pipe(Effect.provide(PrismaLive))
                .pipe(Effect.provide(AuthLive))
                .pipe(
                    Effect.match({
                        onSuccess: machine => ({
                            status: 'success' as const,
                            machine,
                        }),
                        onFailure: e => {
                            if (e instanceof PrismaError) {
                                return {
                                    status: 'error' as const,
                                    type: 'unexpected' as const,
                                    message: String(e.cause),
                                }
                            }
                            if (e instanceof AlreadyArchivedError) {
                                return {
                                    status: 'error' as const,
                                    type: 'already-archived' as const,
                                    message: e.message,
                                    id: e.id,
                                }
                            }
                            if (e instanceof InvalidInputError) {
                                return {
                                    status: 'error' as const,
                                    type: 'invalid-input' as const,
                                    message: e.message,
                                    field: e.field,
                                }
                            }
                            if (e instanceof UnauthorizedError) {
                                return {
                                    status: 'error' as const,
                                    type: 'unauthorized' as const,
                                    message: e.message,
                                }
                            }
                            if (e instanceof PermissionError) {
                                return {
                                    status: 'error' as const,
                                    type: 'permission' as const,
                                    message: e.message,
                                    missings: e.missings,
                                }
                            }
                            if (e instanceof UnexpectedError) {
                                return {
                                    status: 'error' as const,
                                    type: 'unexpected' as const,
                                    message: String(e.cause),
                                }
                            }
                            return {
                                status: 'error' as const,
                                type: 'unexpected' as const,
                                message: String(e),
                            }
                        },
                    }),
                ),
        ),
    )
}

type EditMachineProps = Parameters<typeof editMachineEffect>[0]
export async function editMachine(formData: EditMachineProps) {
    return await Effect.runPromise(
        Effect.scoped(
            editMachineEffect(formData)
                .pipe(Effect.provide(PrismaLive))
                .pipe(Effect.provide(AuthLive))
                .pipe(
                    Effect.match({
                        onSuccess: machine => ({
                            status: 'success' as const,
                            machine,
                        }),
                        onFailure: e => {
                            if (e instanceof PrismaError) {
                                return {
                                    status: 'error' as const,
                                    type: 'unexpected' as const,
                                    message: String(e.cause),
                                }
                            }
                            if (e instanceof InvalidInputError) {
                                return {
                                    status: 'error' as const,
                                    type: 'invalid-input' as const,
                                    message: e.message,
                                    field: e.field,
                                }
                            }
                            if (e instanceof UnauthorizedError) {
                                return {
                                    status: 'error' as const,
                                    type: 'unauthorized' as const,
                                    message: e.message,
                                }
                            }
                            if (e instanceof PermissionError) {
                                return {
                                    status: 'error' as const,
                                    type: 'permission' as const,
                                    message: e.message,
                                    missings: e.missings,
                                }
                            }
                            if (e instanceof UnexpectedError) {
                                return {
                                    status: 'error' as const,
                                    type: 'unexpected' as const,
                                    message: String(e.cause),
                                }
                            }
                            if (e instanceof NotFoundError) {
                                return {
                                    status: 'error' as const,
                                    type: 'not-found' as const,
                                    message: e.message,
                                }
                            }
                            return {
                                status: 'error' as const,
                                type: 'unexpected' as const,
                                message: String(e),
                            }
                        },
                    }),
                ),
        ),
    )
}

export async function deleteMachine(id: string) {
    return await Effect.runPromise(
        Effect.scoped(
            deleteMachineEffect(id)
                .pipe(Effect.provide(PrismaLive))
                .pipe(Effect.provide(AuthLive))
                .pipe(
                    Effect.match({
                        onSuccess: machine => ({
                            status: 'success' as const,
                            machine,
                        }),
                        onFailure: e => {
                            if (e instanceof PrismaError) {
                                return {
                                    status: 'error' as const,
                                    type: 'unexpected' as const,
                                    message: String(e.cause),
                                }
                            }
                            if (e instanceof UnauthorizedError) {
                                return {
                                    status: 'error' as const,
                                    type: 'unauthorized' as const,
                                    message: e.message,
                                }
                            }
                            if (e instanceof PermissionError) {
                                return {
                                    status: 'error' as const,
                                    type: 'permission' as const,
                                    message: e.message,
                                    missings: e.missings,
                                }
                            }
                            if (e instanceof UnexpectedError) {
                                return {
                                    status: 'error' as const,
                                    type: 'unexpected' as const,
                                    message: String(e.cause),
                                }
                            }
                            if (e instanceof NotFoundError) {
                                return {
                                    status: 'error' as const,
                                    type: 'not-found' as const,
                                    message: e.message,
                                }
                            }
                            return {
                                status: 'error' as const,
                                type: 'unexpected' as const,
                                message: String(e),
                            }
                        },
                    }),
                ),
        ),
    )
}

export async function maintainanceMachine(id: string) {
    return await Effect.runPromise(
        Effect.scoped(
            maintainanceMachineEffect(id)
                .pipe(Effect.provide(PrismaLive))
                .pipe(Effect.provide(AuthLive))
                .pipe(
                    Effect.match({
                        onSuccess: machine => ({
                            status: 'success' as const,
                            machine,
                        }),
                        onFailure: e => {
                            if (e instanceof PrismaError) {
                                return {
                                    status: 'error' as const,
                                    type: 'unexpected' as const,
                                    message: String(e.cause),
                                }
                            }
                            if (e instanceof UnauthorizedError) {
                                return {
                                    status: 'error' as const,
                                    type: 'unauthorized' as const,
                                    message: e.message,
                                }
                            }
                            if (e instanceof PermissionError) {
                                return {
                                    status: 'error' as const,
                                    type: 'permission' as const,
                                    message: e.message,
                                    missings: e.missings,
                                }
                            }
                            if (e instanceof UnexpectedError) {
                                return {
                                    status: 'error' as const,
                                    type: 'unexpected' as const,
                                    message: String(e.cause),
                                }
                            }
                            if (e instanceof NotFoundError) {
                                return {
                                    status: 'error' as const,
                                    type: 'not-found' as const,
                                    message: e.message,
                                }
                            }
                            return {
                                status: 'error' as const,
                                type: 'unexpected' as const,
                                message: String(e),
                            }
                        },
                    }),
                ),
        ),
    )
}

export async function availableMachine(id: string) {
    return await Effect.runPromise(
        Effect.scoped(
            availableMachineEffect(id)
                .pipe(Effect.provide(PrismaLive))
                .pipe(Effect.provide(AuthLive))
                .pipe(
                    Effect.match({
                        onSuccess: machine => ({
                            status: 'success' as const,
                            machine,
                        }),
                        onFailure: e => {
                            if (e instanceof PrismaError) {
                                return {
                                    status: 'error' as const,
                                    type: 'unexpected' as const,
                                    message: String(e.cause),
                                }
                            }
                            if (e instanceof UnauthorizedError) {
                                return {
                                    status: 'error' as const,
                                    type: 'unauthorized' as const,
                                    message: e.message,
                                }
                            }
                            if (e instanceof PermissionError) {
                                return {
                                    status: 'error' as const,
                                    type: 'permission' as const,
                                    message: e.message,
                                    missings: e.missings,
                                }
                            }
                            if (e instanceof UnexpectedError) {
                                return {
                                    status: 'error' as const,
                                    type: 'unexpected' as const,
                                    message: String(e.cause),
                                }
                            }
                            if (e instanceof NotFoundError) {
                                return {
                                    status: 'error' as const,
                                    type: 'not-found' as const,
                                    message: e.message,
                                }
                            }
                            return {
                                status: 'error' as const,
                                type: 'unexpected' as const,
                                message: String(e),
                            }
                        },
                    }),
                ),
        ),
    )
}

type SearchMachinesProps = Parameters<typeof searchMachinesEffect>[0]
export async function searchMachines(
    props: SearchMachinesProps,
): Promise<SuccessOf<ReturnType<typeof searchMachinesEffect>>> {
    const machines = await Effect.runPromise(
        Effect.scoped(
            searchMachinesEffect(props)
                .pipe(Effect.provide(PrismaLive))
                .pipe(
                    Effect.catchAll(error => {
                        console.log(error)
                        return Effect.succeed({ machines: [], count: 0 })
                    }),
                ),
        ),
    )
    return machines
}
