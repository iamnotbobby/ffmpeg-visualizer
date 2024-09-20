import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { OPTIONS } from '@/lib/constants'
import { useMemo } from 'react'

interface VideoSettingsProps {
    videoCodec: string
    videoBitrate: string
    videoFps: string
    videoPreset: string
    videoProfile: string
    videoLevel: string
    pixelFormat: string
    onVideoCodecChange: (value: string) => void
    onVideoBitrateChange: (value: string) => void
    onVideoFpsChange: (value: string) => void
    onVideoPresetChange: (value: string) => void
    onVideoProfileChange: (value: string) => void
    onVideoLevelChange: (value: string) => void
    onPixelFormatChange: (value: string) => void
}

export function VideoSettings({
    videoCodec,
    videoBitrate,
    videoFps,
    videoPreset,
    videoProfile,
    videoLevel,
    pixelFormat,
    onVideoCodecChange,
    onVideoBitrateChange,
    onVideoFpsChange,
    onVideoPresetChange,
    onVideoProfileChange,
    onVideoLevelChange,
    onPixelFormatChange,
}: VideoSettingsProps) {
    // if true, other settings like bitrate will be disabled
    const isVideoSettingDisabled = useMemo(
        () => videoCodec === 'default' || videoCodec === 'copy',
        [videoCodec],
    )

    return (
        <>
            <div className="space-y-4 bg-gray-100 p-4 rounded-lg shadow">
                <h3 className="font-semibold mb-2">Video Settings</h3>
                <div className="space-y-2">
                    <Label htmlFor="video-codec">Video Codec</Label>
                    <Select
                        value={videoCodec}
                        onValueChange={onVideoCodecChange}
                    >
                        <SelectTrigger id="video-codec">
                            <SelectValue placeholder="Select codec" />
                        </SelectTrigger>
                        <SelectContent>
                            {OPTIONS.VIDEO_CODEC.map((option) => (
                                <SelectItem
                                    key={option.value}
                                    value={option.value}
                                >
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
                        disabled={isVideoSettingDisabled}
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="video-fps">FPS (Frames Per Second)</Label>
                    <Input
                        id="video-fps"
                        value={videoFps}
                        onChange={(e) => onVideoFpsChange(e.target.value)}
                        placeholder="e.g., 30"
                        disabled={isVideoSettingDisabled}
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
                        disabled={isVideoSettingDisabled}
                    >
                        <SelectTrigger id="video-preset">
                            <SelectValue placeholder="Select preset" />
                        </SelectTrigger>
                        <SelectContent>
                            {OPTIONS.VIDEO_PRESET.map((option) => (
                                <SelectItem
                                    key={option.value}
                                    value={option.value}
                                >
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
                        disabled={isVideoSettingDisabled}
                    >
                        <SelectTrigger id="video-profile">
                            <SelectValue placeholder="Select profile" />
                        </SelectTrigger>
                        <SelectContent>
                            {OPTIONS.VIDEO_PROFILE.map((option) => (
                                <SelectItem
                                    key={option.value}
                                    value={option.value}
                                >
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
                        disabled={isVideoSettingDisabled}
                    >
                        <SelectTrigger id="video-level">
                            <SelectValue placeholder="Select level" />
                        </SelectTrigger>
                        <SelectContent>
                            {OPTIONS.VIDEO_LEVEL.map((option) => (
                                <SelectItem
                                    key={option.value}
                                    value={option.value}
                                >
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
                        disabled={isVideoSettingDisabled}
                    >
                        <SelectTrigger id="pixel-format">
                            <SelectValue placeholder="Select pixel format" />
                        </SelectTrigger>
                        <SelectContent>
                            {OPTIONS.PIXEL_FORMAT.map((option) => (
                                <SelectItem
                                    key={option.value}
                                    value={option.value}
                                >
                                    {option.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>
        </>
    )
}
