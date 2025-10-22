import { toNextJsHandler } from 'better-auth/next-js'
import { auth } from '@/lib/auth'
import * as Sentry from '@sentry/nextjs'

const handlers = toNextJsHandler(auth)

export const POST = Sentry.wrapApiHandlerWithSentry(
    handlers.POST,
    'POST /api/auth/[...all]',
)
export const GET = Sentry.wrapApiHandlerWithSentry(
    handlers.GET,
    'GET /api/auth/[...all]',
)
