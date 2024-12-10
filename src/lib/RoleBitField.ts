import { BitField } from './BitField'

export const RoleFlags = {
    Anonymous: 0n,
    Admin: 1n << 0n,
    Teacher: 1n << 1n,
}

export class RoleBitField extends BitField<typeof RoleFlags> {
    static Flags = RoleFlags
    static DefaultBit = 0n
}
