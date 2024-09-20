import * as SliderPrimitive from '@radix-ui/react-slider'
import { memo, useCallback, useEffect, useState } from 'react'

interface TrimmerSliderProps {
    min: number
    max: number
    step: number
    startValue: number
    endValue: number
    onStartChange: (value: number) => void
    onEndChange: (value: number) => void
}

export const TrimmerSlider: React.FC<TrimmerSliderProps> = memo(
    ({ min, max, step, startValue, endValue, onStartChange, onEndChange }) => {
        const [localStartValue, setLocalStartValue] = useState(startValue)
        const [localEndValue, setLocalEndValue] = useState(endValue)

        useEffect(() => {
            setLocalStartValue(startValue)
            setLocalEndValue(endValue)
        }, [startValue, endValue])

        const handleValueChange = useCallback(
            (values: number[]) => {
                const [start, end] = values
                setLocalStartValue(start)
                setLocalEndValue(end)
                onStartChange(start)
                onEndChange(end)
            },
            [onStartChange, onEndChange],
        )

        return (
            <SliderPrimitive.Root
                className="relative flex items-center select-none touch-none w-full h-5"
                min={min}
                max={max}
                step={step}
                value={[localStartValue, localEndValue]}
                onValueChange={handleValueChange}
            >
                <SliderPrimitive.Track className="bg-gray-200 relative grow rounded-full h-2">
                    <SliderPrimitive.Range className="absolute bg-blue-500 rounded-full h-full" />
                </SliderPrimitive.Track>
                <SliderPrimitive.Thumb
                    className="block w-5 h-5 bg-white border-2 border-blue-500 rounded-full focus:outline-none focus-visible:ring focus-visible:ring-blue-500 focus-visible:ring-opacity-75"
                    aria-label="Start time"
                />
                <SliderPrimitive.Thumb
                    className="block w-5 h-5 bg-white border-2 border-blue-500 rounded-full focus:outline-none focus-visible:ring focus-visible:ring-blue-500 focus-visible:ring-opacity-75"
                    aria-label="End time"
                />
            </SliderPrimitive.Root>
        )
    },
)

TrimmerSlider.displayName = 'TrimmerSlider'
