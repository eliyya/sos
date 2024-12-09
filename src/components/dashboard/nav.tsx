"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  BeakerIcon,
  CalendarIcon,
  LayoutDashboardIcon,
  UsersIcon,
  Settings2Icon,
  LogOutIcon,
} from "lucide-react"

const adminNavItems = [
  {
    title: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboardIcon,
  },
  {
    title: "Laboratorios",
    href: "/admin/labs",
    icon: BeakerIcon,
  },
  {
    title: "Reservas",
    href: "/admin/reservations",
    icon: CalendarIcon,
  },
  {
    title: "Usuarios",
    href: "/admin/users",
    icon: UsersIcon,
  },
]

const teacherNavItems = [
  {
    title: "Dashboard",
    href: "/teacher/dashboard",
    icon: LayoutDashboardIcon,
  },
  {
    title: "Mis Reservas",
    href: "/teacher/reservations",
    icon: CalendarIcon,
  },
]

export function DashboardNav() {
  const pathname = usePathname()
  const isAdmin = pathname.startsWith("/admin")
  const items = isAdmin ? adminNavItems : teacherNavItems

  return (
    <nav className="w-64 min-h-screen bg-muted/50 border-r px-4 py-8">
      <div className="flex items-center gap-2 px-4 mb-8">
        <BeakerIcon className="h-6 w-6 text-primary" />
        <span className="font-semibold text-lg">LabReserve</span>
      </div>

      <div className="space-y-2">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 px-4 py-2 text-sm rounded-md hover:bg-accent",
              pathname === item.href
                ? "bg-accent text-accent-foreground font-medium"
                : "text-muted-foreground"
            )}
          >
            <item.icon className="h-4 w-4" />
            {item.title}
          </Link>
        ))}

        <div className="mt-auto pt-4 border-t">
          <Link
            href="/settings"
            className="flex items-center gap-3 px-4 py-2 text-sm text-muted-foreground rounded-md hover:bg-accent"
          >
            <Settings2Icon className="h-4 w-4" />
            Configuración
          </Link>
          <Link
            href="/logout"
            className="flex items-center gap-3 px-4 py-2 text-sm text-muted-foreground rounded-md hover:bg-accent"
          >
            <LogOutIcon className="h-4 w-4" />
            Cerrar Sesión
          </Link>
        </div>
      </div>
    </nav>
  )
}
