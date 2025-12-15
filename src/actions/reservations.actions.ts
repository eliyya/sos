'use server'

import { PrismaLive } from '@/layers/db.layer'
import { SuccessOf } from '@/lib/type-utils'
import {
    getPracticesFromWeekEffect,
    getReservationEffect,
} from '@/services/reservations.service'
import { Effect } from 'effect'

export async function getReservationAction({
    id,
}: {
    id: string
}): Promise<SuccessOf<ReturnType<typeof getReservationEffect>>> {
    return await Effect.runPromise(
        Effect.scoped(
            getReservationEffect({ id })
                .pipe(Effect.provide(PrismaLive))
                .pipe(
                    Effect.catchAll(error => {
                        console.log(error)
                        return Effect.succeed(null)
                    }),
                ),
        ),
    )
}

export async function getPracticesFromWeekAction({
    lab_id,
    timestamp,
}: {
    lab_id: string
    timestamp: number
}): Promise<SuccessOf<ReturnType<typeof getPracticesFromWeekEffect>>> {
    return await Effect.runPromise(
        Effect.scoped(
            getPracticesFromWeekEffect({ lab_id, timestamp })
                .pipe(Effect.provide(PrismaLive))
                .pipe(
                    Effect.catchAll(error => {
                        console.log(error)
                        return Effect.succeed([])
                    }),
                ),
        ),
    )
}
