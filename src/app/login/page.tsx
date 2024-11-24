import { db } from '@/lib/db'
import { redirect } from 'next/navigation'
import { root } from '@eliyya/type-routes'

export default async function LoginPage() {
    const usuario = await db.users.count()
    if (usuario === 0) redirect(root.register())

    return (
        <main className="flex flex-1 justify-center items-center ">
            <form action="" className="flex flex-col gap-2">
                <label className="flex flex-col ">
                    usuario <input type="text" />
                </label>
                <label className="flex flex-col ">
                    comtraseña <input type="password" />
                </label>
                <input type="submit" />
            </form>
        </main>
    )
}
