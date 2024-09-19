import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface GeneralSettingsProps {
  muteAudio: boolean;
  restartAtTrimStart: boolean;
  outputFileName: string;
  onMuteAudioChange: (checked: boolean) => void;
  onRestartAtTrimStartChange: (checked: boolean) => void;
  onOutputFileNameChange: (fileName: string) => void;
}

export function GeneralSettings({
  muteAudio,
  restartAtTrimStart,
  outputFileName,
  onMuteAudioChange,
  onRestartAtTrimStartChange,
  onOutputFileNameChange,
}: GeneralSettingsProps) {
  return (
    <div className="space-y-4 bg-gray-100 p-4 rounded-lg shadow">
      <h3 className="font-semibold mb-2">General Settings</h3>
      <div className="flex items-center justify-between">
        <Label htmlFor="restart-at-trim" className="flex-1">
          Restart at trim start
        </Label>
        <Switch
          id="restart-at-trim"
          checked={restartAtTrimStart}
          onCheckedChange={onRestartAtTrimStartChange}
        />
      </div>
      <div className="flex items-center justify-between">
        <Label htmlFor="mute-audio" className="flex-1">
          Mute Audio
        </Label>
        <Switch
          id="mute-audio"
          checked={muteAudio}
          onCheckedChange={onMuteAudioChange}
        />
      </div>
      <div className="flex flex-col space-y-2">
        <Label htmlFor="output-file-name">Output File Name</Label>
        <Input
          id="output-file-name"
          value={outputFileName}
          onChange={(e) => onOutputFileNameChange(e.target.value)}
          placeholder="Enter output file name"
        />
      </div>
    </div>
  );
}
