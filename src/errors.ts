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
