export class BitField<T extends Record<string, bigint>> {
    static Flags: Record<string, bigint> = {}
    static DefaultBit: bigint = 0n

    private bitfield: bigint

    constructor(bits: bigint | (keyof T)[] = BitField.DefaultBit) {
        this.bitfield = BitField.resolve(
            bits,
            // @ts-ignore
            (this.constructor as typeof BitField).Flags,
        )
    }

    static resolve<K extends Record<string, bigint>>(
        bits: bigint | (keyof K)[] | BitField<K>,
        flags: K,
    ): bigint {
        if (bits instanceof BitField) return bits.bitfield
        if (Array.isArray(bits))
            return bits.reduce((acc, key) => acc | (flags[key] || 0n), 0n)
        if (typeof bits === 'bigint') return bits
        throw new TypeError(`Invalid bitfield input: ${bits}`)
    }

    has(bit: keyof T | bigint | (keyof T | bigint)[]): boolean {
        const flags = (this.constructor as typeof BitField).Flags
        const resolved = Array.isArray(bit)
            ? // @ts-ignore
              bit.reduce((acc, b) => acc | BitField.resolve(b, flags), 0n)
            : // @ts-ignore
              BitField.resolve(bit, flags)
        // @ts-ignore
        return (this.bitfield & resolved) === resolved
    }

    add(...bits: (keyof T)[]): this {
        const resolved = BitField.resolve(
            bits,
            // @ts-ignore
            (this.constructor as typeof BitField).Flags,
        )
        this.bitfield |= resolved
        return this
    }

    remove(...bits: (keyof T)[]): this {
        const resolved = BitField.resolve(
            bits,
            // @ts-ignore
            (this.constructor as typeof BitField).Flags,
        )
        this.bitfield &= ~resolved
        return this
    }

    serialize(): Record<string, boolean> {
        const flags = (this.constructor as typeof BitField).Flags
        return Object.keys(flags).reduce((acc, key) => {
            acc[key] = this.has(key as keyof T)
            return acc
        }, {} as Record<string, boolean>)
    }

    toArray(): (keyof T)[] {
        const flags = (this.constructor as typeof BitField).Flags
        return Object.keys(flags).filter(key =>
            this.has(key as keyof T),
        ) as (keyof T)[]
    }

    toJSON(): bigint {
        return this.bitfield
    }
}
