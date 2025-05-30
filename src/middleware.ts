import { NextRequest } from 'next/server'
import { MiddlewareHandler } from '@/classes/MiddlewareHandler'
import app from '@eliyya/type-routes'
import { getPaylodadUser } from './actions/middleware'
import { RoleBitField, RoleFlags } from './bitfields/RoleBitField'
import { COOKIES } from './constants/client'
import { cookies } from 'next/headers'

const handler = new MiddlewareHandler()

export const config = {
    matcher:
        '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
}
export const middleware = (request: NextRequest) => handler.handle(request)

handler.use(/^\//, async ctx => {
    const payloadUser = await getPaylodadUser()
    const refresh = ctx.request.cookies.get(COOKIES.REFRESH)?.value
    if (payloadUser || !refresh) return ctx.next()
    const url = new URL(app.api['refresh-token'](), ctx.request.nextUrl.origin)
    const req = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken: refresh }),
    })
    const { accesToken } = await req.json()
    if (accesToken) {
        const cookieStore = await cookies()
        const expires = new Date()
        expires.setDate(expires.getDate() + 1)
        cookieStore.set({
            name: COOKIES.SESSION,
            value: accesToken,
            expires,
            path: '/',
            httpOnly: true,
        })
    }
    return ctx.next()
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
        const url = new URL(
            '/api/get-default-lab-id',
            ctx.request.nextUrl.origin,
        )
        const req = await fetch(url)
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

handler.use(/\/dashboard\/reports\/(lab|cc)\/?$/, async ctx => {
    const [, , , l_type, lab_id] = ctx.request.nextUrl.pathname.split('/') as [
        string,
        string,
        string,
        'lab' | 'cc',
        string,
    ]
    const l_id = lab_id
    if (l_id) return ctx.next()
    const url = new URL(
        l_type === 'lab' ? '/api/get-default-lab-id' : '/api/get-default-cc-id',
        ctx.request.nextUrl.origin,
    )
    const req = await fetch(url)
    const res = (await req.json()) as {
        cc_id: string | null
        lab_id: string | null
    }
    if (res.cc_id || res.lab_id)
        return ctx.redirect(
            l_type === 'lab' ?
                app.dashboard.reports.lab.$lab_id(`${res.lab_id}`)
            :   app.dashboard.reports.cc.$cc_id(`${res.cc_id}`),
        )
    return ctx.redirect(app.schedule.null())
})

handler.set(/^\/dashboard.*$/, async ctx => {
    const payloadUser = await getPaylodadUser()
    if (!payloadUser) return ctx.redirect(app.auth.login())
    const roles = new RoleBitField(BigInt(payloadUser.role))
    if (roles.has(RoleFlags.Admin)) return ctx.next()
    return ctx.redirect(app.schedule.null())
})
