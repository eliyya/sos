import { NextRequest, NextResponse } from 'next/server'
import { withSentry } from '@/lib/sentry'
import { searchStudents } from '@/actions/students.actions'
import { DEFAULT_PAGINATION } from '@/constants/client'

export const GET = withSentry(async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams

    const query = searchParams.get('q')
    const archived = searchParams.get('archived')
    const page = searchParams.get('page')
    const size = searchParams.get('size')

    const students = await searchStudents({
        query: query ?? '',
        archived: archived === '1',
        page: Number(page) || DEFAULT_PAGINATION.PAGE,
        size: Number(size) || DEFAULT_PAGINATION.SIZE,
    })

    return NextResponse.json(students)
})
