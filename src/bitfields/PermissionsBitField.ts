import { FlaggedBitfield } from '@eliyya/flagged-bitfield'

export const PermissionsFlags = {
    /** Todos los permisos */
    ADMIN: 1n << 0n, // Todos los permisos

    /** Puede iniciar sesion */
    CAN_LOGIN: 1n << 1n, // TODO: implementar
    /** Registrar su propia sesion en laboratorio */
    SESSION_SELF: 1n << 2n, // TODO: implementar
    /** Registrar sesiones de otros usuarios */
    SESSION_OTHERS: 1n << 3n, // TODO: implementar
    /** Eliminar sesiones de otros usuarios */
    SESSION_MANAGE: 1n << 4n, // TODO: implementar
    /** Registrar entradas en el centro de computo */
    SESSION_CC: 1n << 5n, // TODO: implementar

    /** Crear/editar/eliminar laboratorios */
    MANAGE_LABS: 1n << 8n, // TODO: implementar
    /** Crear/editar/eliminar usuarios */
    MANAGE_USERS: 1n << 9n,
    /** Crear/editar/eliminar roles */
    MANAGE_ROLES: 1n << 10n,
    /** Crear/editar/eliminar materias */
    MANAGE_SUBJECTS: 1n << 11n, // TODO: implementar
    /** Crear/editar/eliminar carreras */
    MANAGE_CAREERS: 1n << 12n, // TODO: implementar
    /** Crear/editar/eliminar clases */
    MANAGE_CLASSES: 1n << 13n, // TODO: implementar
    /** Crear/editar/eliminar estudiantes */
    MANAGE_STUDENTS: 1n << 14n, // TODO: implementar
    /** Crear/editar/eliminar maquinas */
    MANAGE_MACHINES: 1n << 15n, // TODO: implementar
    /** Crear/editar/eliminar software */
    MANAGE_SOFTWARE: 1n << 16n, // TODO: implementar

    /** Generar reportes */
    GENERATE_REPORTS: 1n << 32n, // TODO: implementar
    /** Realizar consultas */
    MAKE_QUERIES: 1n << 33n, // TODO: implementar
    /** Importar datos */
    IMPORT_DATA: 1n << 34n, // TODO: implementar
    /** Exportar datos */
    EXPORT_DATA: 1n << 35n, // TODO: implementar
    /** Reportar fallas o incidencias */
    REPORT_ISSUES: 1n << 36n, // TODO: implementar
    /** Comentar fallas o incidencias */
    COMMENT_ISSUES: 1n << 37n, // TODO: implementar
    /** Cerrar fallas o incidencias */
    CLOSE_ISSUES: 1n << 38n, // TODO: implementar
}

export class PermissionsBitField extends FlaggedBitfield<
    typeof PermissionsFlags
> {
    static Flags = PermissionsFlags
    static DefaultBit = 0n

    isAdmin() {
        return this.has(PermissionsFlags.ADMIN)
    }
}
