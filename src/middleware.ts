import { NextRequest } from 'next/server'
import { MiddlewareHandler } from '@/classes/MiddlewareHandler'
import app from '@eliyya/type-routes'
import { getSessionCookie } from 'better-auth/cookies'
import { betterFetch } from '@better-fetch/fetch'

import { auth } from './lib/auth'
import {
    PermissionsBitField,
    PermissionsFlags,
} from './bitfields/PermissionsBitField'
type Session = typeof auth.$Infer.Session

export const config = {
    matcher:
        '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
}

const handler = new MiddlewareHandler()
export const middleware = (request: NextRequest) => handler.handle(request)

handler.set(/^\/(schedule.*)?$/, async ctx => {
    console.log('m', 4)
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
        const url = new URL(
            '/api/get-default-lab-id',
            ctx.request.nextUrl.origin,
        )
        const req = await fetch(url)
        if (!req.ok) {
            return ctx.redirect(app.error())
        }
        const res = (await req.json()) as { lab_id: string | null }
        if (!res.lab_id) return ctx.redirect(app.schedule.null())
        l_id = res.lab_id
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
    console.log('m', 3)
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
    const url = new URL(
        l_type === 'lab' ? '/api/get-default-lab-id' : '/api/get-default-cc-id',
        ctx.request.nextUrl.origin,
    )
    const req = await fetch(url)
    if (!req.ok) {
        return ctx.redirect(app.error())
    }
    const res = (await req.json()) as {
        cc_id: string | null
        lab_id: string | null
    }
    if (res.cc_id || res.lab_id)
        return ctx.redirect(
            l_type === 'lab' ?
                app.dashboard.reports.lab.$lab_id.$month.$year(
                    `${res.lab_id}`,
                    m,
                    y,
                )
            :   app.dashboard.reports.cc.$cc_id.$month.$year(
                    `${res.cc_id}`,
                    m,
                    y,
                ),
        )
    return ctx.redirect(
        l_type === 'lab' ?
            app.schedule.null()
        :   app.dashboard.reports.cc.null(),
    )
})

handler.set(/^\/dashboard.*$/, async ctx => {
    console.log('m', 2)
    const sessionCookie = getSessionCookie(ctx.request)
    if (!sessionCookie) return ctx.redirect(app.auth.login())
    const { data: session } = await betterFetch<Session>(
        '/api/auth/get-session',
        {
            baseURL: ctx.request.nextUrl.origin,
            headers: { cookie: ctx.request.headers.get('cookie') || '' },
        },
    )
    console.log(session)
    if (!session) return ctx.redirect(app.auth.login())
    const permissions = new PermissionsBitField(
        BigInt(session.user.permissions),
    )
    if (permissions.has(PermissionsFlags.ADMIN)) return ctx.next()
    return ctx.redirect(app.schedule.null())
})
