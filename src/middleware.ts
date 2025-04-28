import { NextRequest } from 'next/server'
import { MiddlewareHandler } from '@/classes/MiddlewareHandler'
import app from '@eliyya/type-routes'
import { getPaylodadUser } from '@/actions/auth'
import { RoleBitField } from '@/bitfields/RoleBitField'
// import app from '@eliyya/type-routes'
// import { getUser } from './actions/auth'
// import { RoleBitField } from './lib/RoleBitField'

const handler = new MiddlewareHandler()

export const config = {
    runtime: 'nodejs',
    matcher:
        '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
}
export const middleware = (request: NextRequest) => handler.handle(request)

handler.set(/^\/schedule.*/, ctx => {
    const actual_date = new Date()
    const now = {
        day: actual_date.getDate(),
        month: actual_date.getMonth() + 1,
        year: actual_date.getFullYear(),
    }
    const [, , lab_id, day, month, year] =
        ctx.request.nextUrl.pathname.split('/')
    console.log({ lab_id, day, month, year })
    if (!lab_id || !day || !month || !year)
        return ctx.redirect(
            app.schedule.$id.$day.$month.$year(
                lab_id,
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

handler.use(/^\/admin/, async ({ next, redirect }) => {
    const user = await getPaylodadUser()
    if (
        !user ||
        !new RoleBitField(BigInt(user.role)).has(RoleBitField.Flags.Admin)
    )
        return redirect(app.horario())
    return next()
})
