import app from '@eliyya/type-routes'
import {
    PermissionsBitField,
    ADMIN_BITS,
} from '@/bitfields/PermissionsBitField'
import { ModeToggle } from '@/components/mode-toggle'
import { SelectLaboratory } from './SelectLaboratory'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
} from '@/components/ui/navigation-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover'
import Link from 'next/link'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export function ScheduleHeader() {
    return (
        <div className='container mx-auto flex items-center justify-between p-2'>
            <div>
                <SelectLaboratory />
            </div>
            <div className='flex items-center justify-end gap-4'>
                <NavigationMenu>
                    <NavigationMenuList>
                        <Buttons />
                    </NavigationMenuList>
                </NavigationMenu>
            </div>
        </div>
    )
}

function AdminButtons({ username, image }: AvatarMenuItemProps) {
    return (
        <>
            <NavigationMenuItem>
                <ModeToggle />
            </NavigationMenuItem>
            <NavigationMenuItem>
                <NavigationMenuLink href={'/es/dashboard'}>
                    Dashboard
                </NavigationMenuLink>
            </NavigationMenuItem>
            <AvatarMenuItemProps image={image} username={username} />
        </>
    )
}

function GuestButtons() {
    return (
        <>
            <NavigationMenuItem>
                <ModeToggle />
            </NavigationMenuItem>
            <NavigationMenuItem>
                <NavigationMenuLink href={app.$locale.auth.login('es')}>
                    Login
                </NavigationMenuLink>
            </NavigationMenuItem>
        </>
    )
}

async function Buttons() {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session) return <GuestButtons />
    const permissions = new PermissionsBitField(
        BigInt(session?.user.permissions),
    )
    if (permissions.any(ADMIN_BITS))
        return <AdminButtons username={session.user.username} />
    return (
        <UserButtons
            image={session.user.image}
            username={session.user.username}
        />
    )
}

async function UserButtons({ username, image }: AvatarMenuItemProps) {
    return (
        <>
            <NavigationMenuItem>
                <ModeToggle />
            </NavigationMenuItem>
            <AvatarMenuItemProps image={image} username={username} />
        </>
    )
}

interface AvatarMenuItemProps {
    username: string
    image?: string | null
}
async function AvatarMenuItemProps({ username, image }: AvatarMenuItemProps) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger
                render={
                    <Avatar>
                        <AvatarImage
                            src={
                                image ??
                                `https://api.dicebear.com/9.x/notionists-neutral/webp?flip=true&seed=${username}`
                            }
                            alt={username}
                        />
                        <AvatarFallback>{username}</AvatarFallback>
                    </Avatar>
                }
            />
            <DropdownMenuContent>
                <DropdownMenuItem>
                    <Link href={'#'}>profile</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                    <Link href={app.$locale.auth.logout('es')}>logout</Link>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
