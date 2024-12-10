import { NextRequest } from 'next/server'
import { MiddlewareHandler } from './lib/MiddlewareHandler'
import app from '@eliyya/type-routes'
import { getUser } from './actions/auth'

const handler = new MiddlewareHandler()

export const config = {
    matcher: app.login(),
}
export const middleware = (request: NextRequest) => handler.handle(request)

handler.set(app.login(), async ({ next, redirect }) => {
    console.log('asd')

    const user = await getUser()
    if (!user) return next()
    return redirect(app())
})
