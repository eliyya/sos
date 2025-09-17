import { FlaggedBitfield } from '@eliyya/flagged-bitfield'

export const PermissionsFlags = {
    ADMIN: 1n << 0n, // Todos los permisos

    CAN_LOGIN: 1n << 1n, // Puede iniciar sesión
    SESSION_SELF: 1n << 2n, // Registrar su propia sesión en laboratorio
    SESSION_OTHERS: 1n << 3n, // Registrar sesiones de otros usuarios
    MANAGE_ENTITIES: 1n << 4n, // Crear/editar/eliminar usuarios, laboratorios, etc.
    GENERATE_REPORTS: 1n << 5n, // Generar reportes

    // Posibles permisos futuros
    MANAGE_INVENTORY: 1n << 6n, // Gestionar inventario de PCs/equipos
    REPORT_ISSUES: 1n << 7n, // Reportar fallas o incidencias
    INSTALL_SOFTWARE: 1n << 8n, // Solicitar o instalar software
}

export class PermissionsBitField extends FlaggedBitfield<
    typeof PermissionsFlags
> {
    static Flags = PermissionsFlags
    static DefaultBit = 0n
}
