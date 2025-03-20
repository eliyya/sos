import { BitField } from '../lib/BitField.ts'

export const RoleFlags = {
    Admin: 1n << 0n,
    Teacher: 1n << 1n,
    Anonymous: 1n << 2n,
}

export class RoleBitField extends BitField<typeof RoleFlags> {
    static Flags = RoleFlags
    static DefaultBit = 0n
}
