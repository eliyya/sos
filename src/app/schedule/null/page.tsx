// import { Header } from '../../components/Header'
import { db } from '@/prisma/db'
import app from '@eliyya/type-routes'
import { redirect } from 'next/navigation'

export default async function NullPage() {
    const lab = await db.laboratory.findFirst({
        select: {
            id: true,
        },
    })
    const today = new Date()
    if (lab)
        return redirect(
            app.schedule.$id.$day.$month.$year(
                lab.id,
                today.getDate().toString(),
                today.getMonth().toString(),
                today.getFullYear().toString(),
            ),
        )
    return (
        <div className='bg-background min-h-screen'>
            {/* <Header /> */}
            <main className='container mx-auto px-4 py-8'>
                <h1 className='mb-8 text-3xl font-bold'>
                    No existen laboratorios aun
                </h1>
                <p>Por favor contacta con un administrador</p>
            </main>
        </div>
    )
}

//lt --host http://139.177.102.56:25565 --port 3000 --subdomain sos
