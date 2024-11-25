import { NextRequest, NextResponse } from 'next/server'
import { HEADERS } from './constants'

interface handlerFunctionProps {
    request: NextRequest
    response: (
        ...args: ConstructorParameters<typeof NextResponse>
    ) => NextResponse
    next: (...args: Parameters<typeof NextResponse.next>) => NextResponse
    redirect: (
        ...args: Parameters<typeof NextResponse.redirect>
    ) => NextResponse
}
interface HandlerFunction {
    (props: handlerFunctionProps): Promise<NextResponse> | NextResponse
}
export class MiddlewareHandler extends Map<string | RegExp, HandlerFunction> {
    getHandler(path: string) {
        for (const [k, v] of this.entries()) {
            if (typeof k === 'string' && k === path) return v
            else if (k instanceof RegExp && k.test(path)) return v
        }
        return this.handlerDefault
    }

    async handle(request: NextRequest) {
        return this.getHandler(request.nextUrl.pathname)({
            request,
            response: (...args) =>
                MiddlewareHandler.injectPathname(
                    request,
                    new NextResponse(...args),
                ),
            next: (...args) =>
                MiddlewareHandler.injectPathname(
                    request,
                    NextResponse.next(...args),
                ),
            redirect: (url, init) =>
                MiddlewareHandler.injectPathname(
                    request,
                    NextResponse.redirect(
                        typeof url === 'string'
                            ? new URL(url, request.nextUrl)
                            : url,
                        init,
                    ),
                ),
        })
    }

    async handlerDefault({ next }: handlerFunctionProps) {
        return next()
    }

    static injectPathname(request: NextRequest, response: NextResponse) {
        response.headers.set(HEADERS.PATHNAME, request.nextUrl.pathname)
        return response
    }
}
