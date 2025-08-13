import { BitField } from '../classes/BitField.ts'

export const PermissionsFlags = {
    ADMIN: 1n << 0n, // Todos los permisos

    SESSION_SELF: 1n << 1n, // Registrar su propia sesión en laboratorio
    SESSION_OTHERS: 1n << 2n, // Registrar sesiones de otros usuarios
    MANAGE_ENTITIES: 1n << 3n, // Crear/editar/eliminar usuarios, laboratorios, etc.
    GENERATE_REPORTS: 1n << 4n, // Generar reportes

    // Posibles permisos futuros
    MANAGE_INVENTORY: 1n << 5n, // Gestionar inventario de PCs/equipos
    REPORT_ISSUES: 1n << 6n, // Reportar fallas o incidencias
    INSTALL_SOFTWARE: 1n << 7n, // Solicitar o instalar software
}

export class PermissionsBitField extends BitField<typeof PermissionsFlags> {
    static Flags = PermissionsFlags
    static DefaultBit = 0n
}
