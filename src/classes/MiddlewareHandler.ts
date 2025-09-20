import { NextRequest, NextResponse } from 'next/server'

import { HEADERS } from '@/constants/client'

interface handlerFunctionProps {
    request: NextRequest
    response: (
        ...args: ConstructorParameters<typeof NextResponse>
    ) => NextResponse
    done: (...args: Parameters<typeof NextResponse.next>) => NextResponse
    redirect: (
        ...args: Parameters<typeof NextResponse.redirect>
    ) => NextResponse
    next: () => symbol
}

interface HandlerFunction {
    (
        props: handlerFunctionProps,
    ): Promise<NextResponse | symbol> | NextResponse | symbol
}
export class MiddlewareHandler extends Map<string | RegExp, HandlerFunction> {
    middlewares: { path: string | RegExp; handler: HandlerFunction }[] = []

    use(path: string | RegExp, handler: HandlerFunction) {
        this.middlewares.push({ path, handler })
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
        const middles = this.middlewares.filter(({ path }) =>
            path instanceof RegExp ?
                path.test(request.nextUrl.pathname)
            :   path === request.nextUrl.pathname,
        )
        const ctx: handlerFunctionProps = {
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
            next: () => Symbol.for('middleware.next'),
        }

        for (const { handler } of middles) {
            const result = await handler(ctx)
            if (
                typeof result === 'symbol' &&
                result === Symbol.for('middleware.next')
            )
                continue
            return result as NextResponse
        }
        const result = await this.getHandler(request.nextUrl.pathname)(ctx)
        if (
            typeof result === 'symbol' &&
            result === Symbol.for('middleware.next')
        )
            return ctx.done()
        return result as NextResponse
    }

    async handlerDefault({ done }: handlerFunctionProps) {
        return done()
    }

    static injectPathname(request: NextRequest, response: NextResponse) {
        response.headers.set(HEADERS.PATHNAME, request.nextUrl.pathname)
        return response
    }
}
