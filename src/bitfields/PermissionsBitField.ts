import { brandFlags, type KeysBrand } from '../lib/type-utils.ts'
import { FlaggedBitfield } from '@eliyya/flagged-bitfield'

export const PERMISSIONS_FLAGS = brandFlags({
    /** Puede iniciar sesion */
    CAN_LOGIN: 1n << 0n, // TODO: implementar
    /** Registrar su propia sesion en laboratorio */
    SESSION_SELF: 1n << 1n, // TODO: implementar
    /** Registrar sesiones de otros usuarios */
    SESSION_OTHERS: 1n << 2n, // TODO: implementar
    /** Eliminar sesiones de otros usuarios */
    SESSION_MANAGE: 1n << 3n, // TODO: implementar
    /** Registrar entradas en el centro de computo */
    SESSION_CC: 1n << 4n, // TODO: implementar

    /** Crear/editar/eliminar laboratorios */
    MANAGE_LABS: 1n << 8n,
    /** Crear/editar/eliminar usuarios */
    MANAGE_USERS: 1n << 9n,
    /** Crear/editar/eliminar roles */
    MANAGE_ROLES: 1n << 10n,
    /** Crear/editar/eliminar materias */
    MANAGE_SUBJECTS: 1n << 11n,
    /** Crear/editar/eliminar carreras */
    MANAGE_CAREERS: 1n << 12n,
    /** Crear/editar/eliminar clases */
    MANAGE_CLASSES: 1n << 13n,
    /** Crear/editar/eliminar estudiantes */
    MANAGE_STUDENTS: 1n << 14n,
    /** Crear/editar/eliminar maquinas */
    MANAGE_MACHINES: 1n << 15n,
    /** Crear/editar/eliminar software */
    MANAGE_SOFTWARE: 1n << 16n,

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
} as const)

export class PermissionsBitField extends FlaggedBitfield<
    typeof PERMISSIONS_FLAGS
> {
    static Flags = PERMISSIONS_FLAGS
    static DefaultBit = 0n
}

export type PermissionsFlags = KeysBrand<typeof PERMISSIONS_FLAGS>

export type ManagedFlags =
    | typeof PERMISSIONS_FLAGS.MANAGE_LABS
    | typeof PERMISSIONS_FLAGS.MANAGE_USERS
    | typeof PERMISSIONS_FLAGS.MANAGE_ROLES
    | typeof PERMISSIONS_FLAGS.MANAGE_SUBJECTS
    | typeof PERMISSIONS_FLAGS.MANAGE_CAREERS
    | typeof PERMISSIONS_FLAGS.MANAGE_CLASSES
    | typeof PERMISSIONS_FLAGS.MANAGE_STUDENTS
    | typeof PERMISSIONS_FLAGS.MANAGE_MACHINES
    | typeof PERMISSIONS_FLAGS.MANAGE_SOFTWARE

export const MANAGED_BITS =
    PERMISSIONS_FLAGS.MANAGE_LABS |
    PERMISSIONS_FLAGS.MANAGE_USERS |
    PERMISSIONS_FLAGS.MANAGE_ROLES |
    PERMISSIONS_FLAGS.MANAGE_SUBJECTS |
    PERMISSIONS_FLAGS.MANAGE_CAREERS |
    PERMISSIONS_FLAGS.MANAGE_CLASSES |
    PERMISSIONS_FLAGS.MANAGE_STUDENTS |
    PERMISSIONS_FLAGS.MANAGE_MACHINES |
    PERMISSIONS_FLAGS.MANAGE_SOFTWARE

export const ADMIN_BITS =
    PERMISSIONS_FLAGS.SESSION_CC |
    MANAGED_BITS |
    PERMISSIONS_FLAGS.GENERATE_REPORTS |
    PERMISSIONS_FLAGS.MAKE_QUERIES |
    PERMISSIONS_FLAGS.IMPORT_DATA |
    PERMISSIONS_FLAGS.EXPORT_DATA
