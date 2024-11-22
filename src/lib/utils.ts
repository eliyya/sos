export function parseName(name: string, trim = true) {
    const n = trim ? name.trim() : name
    return n.replace(/ +/g, ' ').toLowerCase()
}

export function minutesToHHMM(minutes: number) {
    const formattedHours = String(Math.floor(minutes / 60)).padStart(2, '0')
    const formattedMinutes = String(Math.floor(minutes % 60)).padStart(2, '0')

    return `${formattedHours}:${formattedMinutes}`
}

export function hhmmToMinutes(time: string): number {
    const [hours, minutes] = time.split(':').map(Number)

    const totalHours = hours * 60 + minutes

    return totalHours
}

export function wrapper<T>(fn: () => T): [unknown, undefined] | [undefined, T] {
    try {
        return [, fn()]
    } catch (error) {
        return [error, undefined]
    }
}

export function DateToInputFormat(date: Date): string {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')

    return `${year}-${month}-${day}T${hours}:${minutes}`
}
