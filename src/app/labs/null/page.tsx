import { db } from '@/lib/db'
import app from '@eliyya/type-routes'
import { redirect } from 'next/navigation'

export default async function NullPage() {
    const lab = await db.query.Laboratory.findFirst({
        columns: {
            id: true,
        },
    })
    if (lab) return redirect(app.labs.$id(lab.id))
    return <p>no hay labs</p>
}
