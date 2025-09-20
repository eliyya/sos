import { FlaggedBitfield } from '@eliyya/flagged-bitfield'

export const PermissionsFlags = {
    ADMIN: 1n << 0n, // Todos los permisos

    CAN_LOGIN: 1n << 1n, // Puede iniciar sesión
    SESSION_SELF: 1n << 2n, // Registrar su propia sesión en laboratorio
    SESSION_OTHERS: 1n << 3n, // Registrar sesiones de otros usuarios
    SESSION_MANAGE: 1n << 4n, // Eliminar sesiones de otros usuarios

    MANAGE_LABS: 1n << 8n, // Crear/editar/eliminar laboratorios
    MANAGE_USERS: 1n << 9n, // Crear/editar/eliminar usuarios
    MANAGE_ROLES: 1n << 10n, // Crear/editar/eliminar roles
    MANAGE_SUBJECTS: 1n << 11n, // Crear/editar/eliminar materias
    MANAGE_CAREERS: 1n << 12n, // Crear/editar/eliminar carreras
    MANAGE_CLASSES: 1n << 13n, // Crear/editar/eliminar clases
    MANAGE_STUDENTS: 1n << 14n, // Crear/editar/eliminar estudiantes
    MANAGE_MACHINES: 1n << 15n, // Crear/editar/eliminar maquinas
    MANAGE_SOFTWARE: 1n << 16n, // Crear/editar/eliminar software

    GENERATE_REPORTS: 1n << 32n, // Generar reportes
    MAKE_QUERIES: 1n << 33n, // Realizar
    IMPORT_DATA: 1n << 34n, // Importar datos
    EXPORT_DATA: 1n << 35n, // Exportar datos
    REPORT_ISSUES: 1n << 36n, // Reportar fallas o incidencias
    COMMENT_ISSUES: 1n << 37n, // Comentar fallas o incidencias
    CLOSE_ISSUES: 1n << 38n, // Cerrar fallas o incidencias
}

export class PermissionsBitField extends FlaggedBitfield<
    typeof PermissionsFlags
> {
    static Flags = PermissionsFlags
    static DefaultBit = 0n
}
