export class InvalidInputError {
    readonly _tag = 'InvalidInputError'
    constructor(readonly message: string) {}
}

export class AlreadyArchivedError {
    readonly _tag = 'AlreadyArchivedError'
    constructor(readonly id: string) {}
}

export class AlreadyExistsError {
    readonly _tag = 'AlreadyExistsError'
    constructor(readonly id: string) {}
}

export class UnexpectedError {
    readonly _tag = 'UnexpectedError'
    constructor(readonly cause: unknown) {}
}
