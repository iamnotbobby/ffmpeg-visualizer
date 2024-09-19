import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  videoCodecOptions,
  videoPresetOptions,
  videoProfileOptions,
  videoLevelOptions,
  pixelFormatOptions,
} from "@/lib/config";

interface VideoSettingsProps {
  videoCodec: string;
  videoBitrate: string;
  videoPreset: string;
  videoProfile: string;
  videoLevel: string;
  pixelFormat: string;
  onVideoCodecChange: (value: string) => void;
  onVideoBitrateChange: (value: string) => void;
  onVideoPresetChange: (value: string) => void;
  onVideoProfileChange: (value: string) => void;
  onVideoLevelChange: (value: string) => void;
  onPixelFormatChange: (value: string) => void;
}

export function VideoSettings({
  videoCodec,
  videoBitrate,
  videoPreset,
  videoProfile,
  videoLevel,
  pixelFormat,
  onVideoCodecChange,
  onVideoBitrateChange,
  onVideoPresetChange,
  onVideoProfileChange,
  onVideoLevelChange,
  onPixelFormatChange,
}: VideoSettingsProps) {
  return (
    <>
      <div className="space-y-4 bg-gray-100 p-4 rounded-lg shadow">
        <h3 className="font-semibold mb-2">Video Settings</h3>
        <div className="space-y-2">
          <Label htmlFor="video-codec">Video Codec</Label>
          <Select value={videoCodec} onValueChange={onVideoCodecChange}>
            <SelectTrigger id="video-codec">
              <SelectValue placeholder="Select codec" />
            </SelectTrigger>
            <SelectContent>
              {videoCodecOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="video-bitrate">Video Bitrate</Label>
          <Input
            id="video-bitrate"
            value={videoBitrate}
            onChange={(e) => onVideoBitrateChange(e.target.value)}
            placeholder="e.g., 1M"
            disabled={videoCodec === "copy"}
          />
        </div>
      </div>

      <div className="space-y-4 bg-gray-100 p-4 rounded-lg shadow">
        <h3 className="font-semibold mb-2">Advanced Video Settings</h3>
        <div className="space-y-2">
          <Label htmlFor="video-preset">Video Preset</Label>
          <Select
            value={videoPreset}
            onValueChange={onVideoPresetChange}
            disabled={videoCodec === "copy"}
          >
            <SelectTrigger id="video-preset">
              <SelectValue placeholder="Select preset" />
            </SelectTrigger>
            <SelectContent>
              {videoPresetOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="video-profile">Video Profile</Label>
          <Select
            value={videoProfile}
            onValueChange={onVideoProfileChange}
            disabled={videoCodec === "copy"}
          >
            <SelectTrigger id="video-profile">
              <SelectValue placeholder="Select profile" />
            </SelectTrigger>
            <SelectContent>
              {videoProfileOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="video-level">Video Level</Label>
          <Select
            value={videoLevel}
            onValueChange={onVideoLevelChange}
            disabled={videoCodec === "copy"}
          >
            <SelectTrigger id="video-level">
              <SelectValue placeholder="Select level" />
            </SelectTrigger>
            <SelectContent>
              {videoLevelOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="pixel-format">Pixel Format</Label>
          <Select
            value={pixelFormat}
            onValueChange={onPixelFormatChange}
            disabled={videoCodec === "copy"}
          >
            <SelectTrigger id="pixel-format">
              <SelectValue placeholder="Select pixel format" />
            </SelectTrigger>
            <SelectContent>
              {pixelFormatOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </>
  );
}
