import { NextRequest } from 'next/server'
import { MiddlewareHandler } from '@/classes/MiddlewareHandler'
import app from '@eliyya/type-routes'

const handler = new MiddlewareHandler()

export const config = {
    matcher:
        '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
}
export const middleware = (request: NextRequest) => handler.handle(request)

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
        const req = await fetch(
            new URL('/api/get-default-lab-id', ctx.request.nextUrl.origin),
        )
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
