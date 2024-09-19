import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ArrowLeftToLine, ArrowRightToLine } from "lucide-react";
import { TrimmerSlider } from "../trimmer/TrimmerSlider";

interface TrimmerControlsProps {
  startTime: number;
  endTime: number;
  duration: number;
  onStartTimeChange: (value: number) => void;
  onEndTimeChange: (value: number) => void;
  onSetStartTrimmer: () => void;
  onSetEndTrimmer: () => void;
  formatTime: (time: number) => string;
}

export function TrimmerControls({
  startTime,
  endTime,
  duration,
  onStartTimeChange,
  onEndTimeChange,
  onSetStartTrimmer,
  onSetEndTrimmer,
  formatTime,
}: TrimmerControlsProps) {
  return (
    <div className="mt-6 bg-gray-100 p-4 rounded-lg shadow">
      <Label className="mb-2 block font-semibold">Trimmer</Label>
      <div className="flex items-center space-x-4 mb-2">
        <Input
          type="text"
          value={formatTime(startTime)}
          onChange={(e) => onStartTimeChange(parseTime(e.target.value))}
          className="w-24"
        />
        <Input
          type="text"
          value={formatTime(endTime)}
          onChange={(e) => onEndTimeChange(parseTime(e.target.value))}
          className="w-24"
        />
        <Button onClick={onSetStartTrimmer} size="sm" className="flex-1">
          <ArrowLeftToLine className="h-4 w-4 mr-2" />
          Set Start
        </Button>
        <Button onClick={onSetEndTrimmer} size="sm" className="flex-1">
          <ArrowRightToLine className="h-4 w-4 mr-2" />
          Set End
        </Button>
      </div>
      <TrimmerSlider
        min={0}
        max={duration}
        step={0.01}
        startValue={startTime}
        endValue={endTime}
        onStartChange={onStartTimeChange}
        onEndChange={onEndTimeChange}
      />
    </div>
  );
}

function parseTime(timeString: string): number {
  const [minutes, seconds] = timeString.split(":").map(Number);
  return minutes * 60 + seconds;
}
