import app from '@eliyya/type-routes'
import { LABORATORY_TYPE } from '@/prisma/generated/client'
import { NextRequest } from 'next/server'
import { MiddlewareHandler } from '@/classes/MiddlewareHandler'
import {
    PermissionsBitField,
    PERMISSIONS_FLAGS,
    ADMIN_BITS,
    MANAGED_BITS,
} from './bitfields/PermissionsBitField'
import { auth } from './lib/auth'
import { db } from '@/prisma/db'

export const config = {
    matcher:
        '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)'
}

const handler = new MiddlewareHandler()
export const proxy = (request: NextRequest) => handler.handle(request)

handler.set('/', async ctx => {
    return ctx.redirect(app.schedule.null())
})

handler.use(/^\/dashboard/, async ctx => {
    const session = await auth.api.getSession(ctx.request)

    if (!session) return ctx.redirect(app.auth.login())
    const permissions = new PermissionsBitField(
        BigInt(session.user.permissions),
    )
    if (permissions.any(ADMIN_BITS)) return ctx.next()
    return ctx.redirect(app.schedule.null())
})

handler.set(/^\/(schedule.*)?$/, async ctx => {
    const actual_date = new Date()
    const now = {
        day: actual_date.getDate(),
        month: actual_date.getMonth() + 1,
        year: actual_date.getFullYear(),
    }
    const [, , lab_id, day, month, year] =
        ctx.request.nextUrl.pathname.split('/')
    if (lab_id === 'null') return ctx.next()
    let l_id = lab_id
    if (!l_id) {
        const did = await db.laboratory.findFirst({
            select: { id: true },
            where: { type: LABORATORY_TYPE.LABORATORY },
        })
        if (!did?.id) return ctx.redirect(app.schedule.null())
        l_id = did.id
    }
    if (!lab_id || !day || !month || !year)
        return ctx.redirect(
            app.schedule.$id.$day.$month.$year(
                l_id,
                day ?? now.day,
                month ?? now.month,
                year ?? now.year,
            ),
        )
    return ctx.done()
})

handler.use(/\/dashboard\/reports\/(lab|cc)\/?/, async ctx => {
    const [, , , l_type, lab_id, month, year] =
        ctx.request.nextUrl.pathname.split('/') as [
            string,
            string,
            string,
            'lab' | 'cc',
            string,
            string,
            string,
        ]
    if (lab_id === 'null') return ctx.next()
    let m = month
    let y = year
    if (!y) {
        const actual_date = new Date()
        y = String(actual_date.getFullYear())
    }
    if (!m) {
        const actual_date = new Date()
        m = String(actual_date.getMonth() + 1)
    }
    const l_id = lab_id
    if (l_id) return ctx.next()
    const did = await db.laboratory.findFirst({
        select: { id: true },
        where: {
            type:
                l_type === 'lab' ?
                    LABORATORY_TYPE.LABORATORY
                :   LABORATORY_TYPE.COMPUTER_CENTER,
        },
    })
    if (did?.id)
        return ctx.redirect(
            l_type === 'lab' ?
                app.dashboard.reports.lab.$lab_id.$month.$year(
                    `${did.id}`,
                    m,
                    y,
                )
            :   app.dashboard.reports.cc.$cc_id.$month.$year(`${did.id}`, m, y),
        )
    return ctx.redirect(
        l_type === 'lab' ?
            app.schedule.null()
        :   app.dashboard.reports.cc.null(),
    )
})

const managementRoutes: Record<
    keyof typeof app.dashboard.management,
    typeof MANAGED_BITS
> = {
    careers: PERMISSIONS_FLAGS.MANAGE_CAREERS,
    classes: PERMISSIONS_FLAGS.MANAGE_CLASSES,
    laboratories: PERMISSIONS_FLAGS.MANAGE_LABS,
    machines: PERMISSIONS_FLAGS.MANAGE_MACHINES,
    roles: PERMISSIONS_FLAGS.MANAGE_ROLES,
    students: PERMISSIONS_FLAGS.MANAGE_STUDENTS,
    subjects: PERMISSIONS_FLAGS.MANAGE_SUBJECTS,
    users: PERMISSIONS_FLAGS.MANAGE_USERS,
    software: PERMISSIONS_FLAGS.MANAGE_SOFTWARE,
}
type RouteKey = keyof typeof managementRoutes

handler.set(/^\/dashboard\/management.*$/, async ctx => {
    const session = await auth.api.getSession(ctx.request)

    if (!session) return ctx.redirect(app.auth.login())
    const permissions = new PermissionsBitField(
        BigInt(session.user.permissions),
    )

    const [, , route] = ctx.request.nextUrl.pathname.split('/')
    const permissionNeeded = managementRoutes[route as RouteKey]

    if (!permissionNeeded) return ctx.next()
    if (permissions.has(permissionNeeded)) return ctx.next()

    return ctx.redirect(app.schedule.null())
})
