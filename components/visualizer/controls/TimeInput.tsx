import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { formatTimeFlexible, parseTimeFlexible } from '@/lib/utils'

interface TimeInputProps {
    value: number
    onChange: (value: number) => void
    label: string
    max?: number
}

export function TimeInput({ value, onChange, label, max }: TimeInputProps) {
    const [inputValue, setInputValue] = useState(formatTimeFlexible(value))

    useEffect(() => {
        setInputValue(formatTimeFlexible(value))
    }, [value])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value)
    }

    const handleBlur = () => {
        const parsedTime = parseTimeFlexible(inputValue)
        if (!isNaN(parsedTime) && (max === undefined || parsedTime <= max)) {
            onChange(parsedTime)
            setInputValue(formatTimeFlexible(parsedTime))
        } else {
            setInputValue(formatTimeFlexible(value))
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleBlur()
        }
    }

    return (
        <div className="flex flex-col space-y-1">
            <Label
                htmlFor={label}
                className="text-sm font-medium text-gray-700"
            >
                {label}
            </Label>
            <Input
                id={label}
                type="text"
                value={inputValue}
                onChange={handleChange}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                className="w-36"
                placeholder="SS.mmm"
            />
        </div>
    )
}
