import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { ArrowLeftToLine, ArrowRightToLine } from 'lucide-react'
import { TimeInput } from './TimeInput'
import { TrimmerSlider } from '../trimmer/TrimmerSlider'

interface TrimmerControlsProps {
    startTime: number
    endTime: number
    duration: number
    onStartTimeChange: (value: number) => void
    onEndTimeChange: (value: number) => void
    onSetStartTrimmer: () => void
    onSetEndTrimmer: () => void
}

export function TrimmerControls({
    startTime,
    endTime,
    duration,
    onStartTimeChange,
    onEndTimeChange,
    onSetStartTrimmer,
    onSetEndTrimmer,
}: TrimmerControlsProps) {
    return (
        <div className="mt-6 bg-gray-100 p-4 rounded-lg shadow">
            <Label className="mb-2 block font-semibold">Trimmer</Label>
            <div className="flex flex-wrap items-center gap-4 mb-4">
                <TimeInput
                    value={startTime}
                    onChange={onStartTimeChange}
                    label="Start Time"
                    max={endTime}
                />
                <TimeInput
                    value={endTime}
                    onChange={onEndTimeChange}
                    label="End Time"
                    max={duration}
                />
                <div className="flex gap-2 mt-2 sm:mt-0">
                    <Button
                        onClick={onSetStartTrimmer}
                        size="sm"
                        className="flex-1"
                    >
                        <ArrowLeftToLine className="h-4 w-4 mr-2" />
                        Set Start
                    </Button>
                    <Button
                        onClick={onSetEndTrimmer}
                        size="sm"
                        className="flex-1"
                    >
                        <ArrowRightToLine className="h-4 w-4 mr-2" />
                        Set End
                    </Button>
                </div>
            </div>
            <TrimmerSlider
                min={0}
                max={duration}
                step={0.001}
                startValue={startTime}
                endValue={endTime}
                onStartChange={onStartTimeChange}
                onEndChange={onEndTimeChange}
            />
        </div>
    )
}
