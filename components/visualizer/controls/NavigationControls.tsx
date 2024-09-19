import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { SkipBack } from "lucide-react";

interface NavigationControlsProps {
  currentTime: number;
  duration: number;
  startTime: number;
  endTime: number;
  onCurrentTimeChange: (time: number) => void;
  onJumpToStart: () => void;
  formatTime: (time: number) => string;
}

export function NavigationControls({
  currentTime,
  duration,
  startTime,
  endTime,
  onCurrentTimeChange,
  onJumpToStart,
  formatTime,
}: NavigationControlsProps) {
  return (
    <div className="mt-6 bg-gray-100 p-4 rounded-lg shadow">
      <Label className="mb-2 block font-semibold">Navigation</Label>
      <div className="flex items-center space-x-4 mb-2">
        <Input
          type="text"
          value={formatTime(currentTime)}
          onChange={(e) => {
            const time = parseTime(e.target.value);
            onCurrentTimeChange(time);
          }}
          className="w-24"
        />
        <Button onClick={onJumpToStart} size="sm" className="flex-1">
          <SkipBack className="h-4 w-4 mr-2" />
          Jump to Start
        </Button>
      </div>
      <div className="relative pt-1">
        <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
          <div
            style={{ width: `${(currentTime / duration) * 100}%` }}
            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"
          ></div>
        </div>
        <div className="absolute top-0 left-0 w-full h-2 pointer-events-none">
          <div
            style={{
              left: `${(startTime / duration) * 100}%`,
              width: `${((endTime - startTime) / duration) * 100}%`,
            }}
            className="absolute h-full bg-green-500 opacity-50"
          ></div>
        </div>
        <input
          type="range"
          min={0}
          max={duration}
          step={0.01}
          value={currentTime}
          onChange={(e) => onCurrentTimeChange(parseFloat(e.target.value))}
          className="absolute top-0 left-0 w-full h-5 bg-transparent appearance-none cursor-pointer
            [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-blue-500
            [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-blue-500
            [&::-ms-thumb]:appearance-none [&::-ms-thumb]:w-5 [&::-ms-thumb]:h-5 [&::-ms-thumb]:rounded-full [&::-ms-thumb]:bg-white [&::-ms-thumb]:border-2 [&::-ms-thumb]:border-blue-500
            focus:outline-none focus-visible:ring focus-visible:ring-blue-500 focus-visible:ring-opacity-75"
        />
      </div>
    </div>
  );
}

function parseTime(timeString: string): number {
  const [minutes, seconds] = timeString.split(":").map(Number);
  return minutes * 60 + seconds;
}
