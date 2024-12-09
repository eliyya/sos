import { Metadata } from "next";
import { AdminDashboard } from "@/components/admin/diashboard";
import { DashboardHeader } from "@/components/dashboard/header";
import { DashboardShell } from "@/components/dashboard/shell";


export const metadata: Metadata = {
  title: "panel de Administrador | LabReserve",
  description: "gestión de laboratorios y usuarios"
}

export default function AdminDashboardPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="panel de Administracion" text="gestiona laboratorio, reservas y usuarios del sistemas." />
      <AdminDashboard />
    </DashboardShell>
  )
}

