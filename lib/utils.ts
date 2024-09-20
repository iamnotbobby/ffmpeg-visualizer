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

export function parseTimeFlexible(timeString: string): number {
    const patterns = [
        /^(\d{2}):(\d{2}):(\d{2})\.(\d{1,3})$/, // HH:MM:SS.mmm
        /^(\d{2}):(\d{2})\.(\d{1,3})$/, // MM:SS.mmm
        /^(\d{1,2})\.(\d{1,3})$/, // SS.mmm
        /^(\d{1,2}):(\d{2})$/, // MM:SS
        /^(\d{1,2})$/, // SS
    ]

    for (const pattern of patterns) {
        const match = timeString.match(pattern)
        if (match) {
            const parts = match.slice(1).map(Number)
            if (parts.length === 4) {
                return (
                    parts[0] * 3600 + parts[1] * 60 + parts[2] + parts[3] / 1000
                )
            } else if (parts.length === 3) {
                return parts[0] * 60 + parts[1] + parts[2] / 1000
            } else if (parts.length === 2) {
                if (pattern.source.includes('\\.')) {
                    return parts[0] + parts[1] / 1000
                } else {
                    return parts[0] * 60 + parts[1]
                }
            } else if (parts.length === 1) {
                return parts[0]
            }
        }
    }

    return NaN
}
