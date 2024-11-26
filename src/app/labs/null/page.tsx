import { db } from '@/lib/db'
import app from '@eliyya/type-routes'
import { redirect } from 'next/navigation'

export default async function NullPage() {
    const lab = await db.laboratory.findFirst({
        select: {
            id: true,
        },
    })
    if (lab) return redirect(app.labs.$id(lab.id))
    return <p>no hay labs</p>
}

//lt --host http://139.177.102.56:25565 --port 3000 --subdomain sos
