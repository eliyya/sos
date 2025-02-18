import { NextRequest } from 'next/server'
import { MiddlewareHandler } from './lib/MiddlewareHandler'
import app from '@eliyya/type-routes'
import { getUser } from './actions/auth'
import { RoleBitField } from './lib/RoleBitField'

const handler = new MiddlewareHandler()

export const config = {
    matcher:
        '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
}
export const middleware = (request: NextRequest) => handler.handle(request)

// handler.set(app.login(), async ({ next, redirect }) => {
//     console.log('asd')

//     const user = await getUser()
//     if (!user) return next()
//     return redirect(app())
// })

// handler.set(app.labs(), ({ redirect }) => redirect(app()))

// handler.set(/^\/admin/, async ({ next, redirect }) => {
//     const user = await getUser()
//     if (!user || !new RoleBitField(user.roles).has(RoleBitField.Flags.Admin))
//         return redirect(app())
//     return next()
// })
