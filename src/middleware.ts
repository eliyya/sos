import { NextRequest } from 'next/server'
import { MiddlewareHandler } from './lib/MiddlewareHandler'

const handler = new MiddlewareHandler()

export const config = {
    matcher: '/((?!_next|favicon.ico|sitemap.xml|robots.txt).*)',
}
export const middleware = (request: NextRequest) => handler.handle(request)

// handler.set(app(), async ({ next, redirect }) => {
//     const lab = await db.query.Laboratory.findFirst({
//         columns: {
//             id: true,
//         },
//     })
//     if (lab) return redirect(app.labs.$id(lab.id))
//     return redirect(app.labs.null())
// })
