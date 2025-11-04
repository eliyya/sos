import { NextRequest, NextResponse } from 'next/server'
import { withSentry } from '@/lib/sentry'
import { DEFAULT_PAGINATION } from '@/constants/client'
import { searchSubjects } from '@/actions/subjects.actions'

export const GET = withSentry(async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams

    const query = searchParams.get('q')
    const archived = searchParams.get('archived')
    const page = searchParams.get('page')
    const size = searchParams.get('size')

    const subjects = await searchSubjects({
        query: query ?? '',
        archived: archived === '1',
        page: Number(page) || DEFAULT_PAGINATION.PAGE,
        size: Number(size) || DEFAULT_PAGINATION.SIZE,
    })

    return NextResponse.json(subjects)
})
