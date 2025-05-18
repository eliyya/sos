import { NextRequest } from 'next/server'
import { MiddlewareHandler } from '@/classes/MiddlewareHandler'
import app from '@eliyya/type-routes'
// import { getPaylodadUser } from '@/actions/auth'
// import { RoleBitField } from '@/bitfields/RoleBitField'
// import app from '@eliyya/type-routes'
// import { getUser } from './actions/auth'
// import { RoleBitField } from './lib/RoleBitField'

const handler = new MiddlewareHandler()

export const config = {
    // runtime: 'nodejs',
    matcher:
        '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
}
export const middleware = (request: NextRequest) => handler.handle(request)

handler.set(/^\/schedule.*/, async ctx => {
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

// handler.set(app.login(), async ({ next, redirect }) => {
//     console.log('asd')

//     const user = await getUser()
//     if (!user) return next()
//     return redirect(app())
// })

// handler.set(app.labs(), ({ redirect }) => redirect(app()))

// handler.use(/^\/admin/, async ({ next, redirect }) => {
//     const user = await fetch('/api/get_payload_user').then(res => res.json())
//     if (
//         !user ||
//         !new RoleBitField(BigInt(user.role)).has(RoleBitField.Flags.Admin)
//     )
//         return redirect(app.schedule.null())
//     return next()
// })
