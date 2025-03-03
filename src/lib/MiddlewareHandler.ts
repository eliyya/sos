import { NextRequest, NextResponse } from 'next/server'
import { HEADERS } from './constants'

interface handlerFunctionProps {
    request: NextRequest
    response: (
        ...args: ConstructorParameters<typeof NextResponse>
    ) => NextResponse
    done: (...args: Parameters<typeof NextResponse.next>) => NextResponse
    redirect: (
        ...args: Parameters<typeof NextResponse.redirect>
    ) => NextResponse
    next: () => never
}

class NextError extends Error {
    constructor(message: string) {
        super(message)
        this.name = 'NextError'
        this.stack = new Error().stack
        this.cause = 'Internal for detect next() function'
    }
}


interface HandlerFunction {
    (props: handlerFunctionProps): Promise<NextResponse> | NextResponse
}
export class MiddlewareHandler extends Map<string | RegExp, HandlerFunction> {
    middlewares: {path:string | RegExp, handler: HandlerFunction}[] = []
    
    use(path: string | RegExp, handler: HandlerFunction) {
        this.middlewares.push({path, handler})
        return this
    }
    
    getHandler(path: string) {
        if (this.has(path)) return this.get(path)!
        for (const [k, v] of this.entries()) {
            if (k instanceof RegExp && k.test(path)) return v
        }
        return this.handlerDefault
    }

    async handle(request: NextRequest) {
        const middles = this.middlewares.filter(
            ({path}) => path instanceof RegExp 
                ? path.test(request.nextUrl.pathname)
                : path === request.nextUrl.pathname
        )
            for (const {handler} of middles) {
                try {
                    return await handler(({
                        request,
                        response: (...args) =>
                            MiddlewareHandler.injectPathname(
                                request,
                                new NextResponse(...args),
                            ),
                        done: (...args) =>
                            MiddlewareHandler.injectPathname(
                                request,
                                NextResponse.next(...args),
                            ),
                        redirect: (url, init) =>
                            MiddlewareHandler.injectPathname(
                                request,
                                NextResponse.redirect(
                                    typeof url === 'string' ?
                                        new URL(url, request.nextUrl)
                                    :   url,
                                    init,
                                ),
                            ),
                        next: () => { throw new NextError('next()') },
                    }))
                } catch (error) {
                    if (error instanceof NextError) {
                        continue
                    } else throw error
                }
            }
            return this.getHandler(request.nextUrl.pathname)({
                request,
                response: (...args) =>
                    MiddlewareHandler.injectPathname(
                        request,
                        new NextResponse(...args),
                    ),
                done: (...args) =>
                    MiddlewareHandler.injectPathname(
                        request,
                        NextResponse.next(...args),
                    ),
                redirect: (url, init) =>
                    MiddlewareHandler.injectPathname(
                        request,
                        NextResponse.redirect(
                            typeof url === 'string' ?
                                new URL(url, request.nextUrl)
                            :   url,
                            init,
                        ),
                    ),
                next: () => { throw new NextError('next()') }
            })
    }

    async handlerDefault({ done }: handlerFunctionProps) {
        return done()
    }

    static injectPathname(request: NextRequest, response: NextResponse) {
        response.headers.set(HEADERS.PATHNAME, request.nextUrl.pathname)
        return response
    }
}
