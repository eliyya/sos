import { Header } from '@/components/Header'
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
    return (
        <div className="min-h-screen bg-background">
            <Header />
            <main className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-8">
                    No existen laboratorios aun
                </h1>
                <p>Por favor contacta con un administrador</p>
            </main>
        </div>
    )
}

//lt --host http://139.177.102.56:25565 --port 3000 --subdomain sos
