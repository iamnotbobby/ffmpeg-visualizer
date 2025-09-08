import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function formatTimeFlexible(timeInSeconds: number): string {
    const hours = Math.floor(timeInSeconds / 3600)
    const minutes = Math.floor((timeInSeconds % 3600) / 60)
    const seconds = Math.floor(timeInSeconds % 60)
    const milliseconds = Math.floor((timeInSeconds % 1) * 1000)

    if (hours > 0) {
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(3, '0')}`
    } else if (minutes > 0) {
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(3, '0')}`
    } else {
        return `${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(3, '0')}`
    }
}
