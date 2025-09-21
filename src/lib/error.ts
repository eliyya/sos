export type Result<T, E> = Ok<T> | Err<E>

export type Ok<T> = {
    ok: true
    data: T
}

export type Err<E> = {
    ok: false
    error: E
}

export function ok<T>(data: T): Ok<T> {
    return { ok: true, data }
}

export function err<E>(error: E): Err<E> {
    return { ok: false, error }
}
export function isOk<T, E>(result: Result<T, E>): result is Ok<T> {
    return result.ok
}

export function isErr<T, E>(result: Result<T, E>): result is Err<E> {
    return !result.ok
}

// Aplica una función al valor si es Ok
export function map<T, E, U>(
    result: Result<T, E>,
    fn: (data: T) => U,
): Result<U, E> {
    return result.ok ? ok(fn(result.data)) : result
}

// Aplica una función al error si es Err
export function mapError<T, E, F>(
    result: Result<T, E>,
    fn: (error: E) => F,
): Result<T, F> {
    return result.ok ? result : err(fn(result.error))
}

// Encadena funciones que también devuelven Result
export function flatMap<T, E, U, F>(
    result: Result<T, E>,
    fn: (data: T) => Result<U, F>,
): Result<U, E | F> {
    return result.ok ? fn(result.data) : result
}

// Obtiene el valor o lanza un error
export function unwrap<T, E>(result: Result<T, E>): T {
    if (result.ok) return result.data
    throw new Error(`Tried to unwrap Err: ${JSON.stringify(result.error)}`)
}

// Obtiene el valor o un fallback
export function unwrapOr<T, E>(result: Result<T, E>, fallback: T): T {
    return result.ok ? result.data : fallback
}

export function match<T, E, R>(
    result: Result<T, E>,
    handlers: {
        ok: (data: T) => R
        err: (error: E) => R
    },
): R {
    return result.ok ? handlers.ok(result.data) : handlers.err(result.error)
}
