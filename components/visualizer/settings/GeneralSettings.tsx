import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface GeneralSettingsProps {
  muteAudio: boolean;
  restartAtTrimStart: boolean;
  onMuteAudioChange: (checked: boolean) => void;
  onRestartAtTrimStartChange: (checked: boolean) => void;
}

export function GeneralSettings({
  muteAudio,
  restartAtTrimStart,
  onMuteAudioChange,
  onRestartAtTrimStartChange,
}: GeneralSettingsProps) {
  return (
    <div className="space-y-4 bg-gray-100 p-4 rounded-lg shadow">
      <h3 className="font-semibold mb-2">General Settings</h3>
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
    </div>
  );
}
