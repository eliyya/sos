import { PermissionsBitField } from './bitfields/PermissionsBitField'

export class InvalidInputError<T extends string> {
    readonly _tag = 'InvalidInputError'
    constructor(readonly message: T) {}
}

export class AlreadyArchivedError<T extends string> {
    readonly _tag = 'AlreadyArchivedError'
    constructor(
        readonly id: string,
        readonly message: T,
    ) {}
}

export class AlreadyExistsError<T extends string> {
    readonly _tag = 'AlreadyExistsError'
    constructor(
        readonly id: string,
        readonly message: T,
    ) {}
}

export class UnexpectedError<T> {
    readonly _tag = 'UnexpectedError'
    constructor(readonly cause: T) {}
}

export class NotFoundError<T extends string> {
    readonly _tag = 'NotFoundError'
    constructor(readonly message: T) {}
}

export class NotAllowedError<T extends string> {
    readonly _tag = 'NotAllowedError'
    constructor(readonly message: T) {}
}

export class UnauthorizedError<T extends string> {
    readonly _tag = 'UnauthorizedError'
    constructor(readonly message: T) {}
}

export class PermissionError {
    readonly _tag = 'PermissionError'
    readonly missings: Parameters<PermissionsBitField['has']>[0]
    readonly message: string
    constructor(flag: Parameters<PermissionsBitField['has']>[0]) {
        this.missings = flag
        this.message = `PermissionError: Missing permissions: ${new PermissionsBitField(flag).toArray().join(', ')}`
    }
}
