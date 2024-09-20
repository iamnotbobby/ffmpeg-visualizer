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

interface AudioSettingsProps {
    audioCodec: string
    audioBitrate: string
    audioChannels: string
    audioSampleRate: string
    muteAudio: boolean
    onAudioCodecChange: (value: string) => void
    onAudioBitrateChange: (value: string) => void
    onAudioChannelsChange: (value: string) => void
    onAudioSampleRateChange: (value: string) => void
}

export function AudioSettings({
    audioCodec,
    audioBitrate,
    audioChannels,
    audioSampleRate,
    muteAudio,
    onAudioCodecChange,
    onAudioBitrateChange,
    onAudioChannelsChange,
    onAudioSampleRateChange,
}: AudioSettingsProps) {
    // if true, other settings like bitrate will be disabled
    const isAudioSettingDisabled = useMemo(
        () => audioCodec === 'default' || audioCodec === 'copy' || muteAudio,
        [audioCodec, muteAudio],
    )

    return (
        <>
            <div className="space-y-4 bg-gray-100 p-4 rounded-lg shadow">
                <h3 className="font-semibold mb-2">Audio Settings</h3>
                <div className="space-y-2">
                    <Label htmlFor="audio-codec">Audio Codec</Label>
                    <Select
                        value={audioCodec}
                        onValueChange={onAudioCodecChange}
                    >
                        <SelectTrigger id="audio-codec">
                            <SelectValue placeholder="Select codec" />
                        </SelectTrigger>
                        <SelectContent>
                            {OPTIONS.AUDIO_CODEC.map((option) => (
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
                    <Label htmlFor="audio-bitrate">Audio Bitrate</Label>
                    <Input
                        id="audio-bitrate"
                        value={audioBitrate}
                        onChange={(e) => onAudioBitrateChange(e.target.value)}
                        placeholder="e.g., 128k"
                        disabled={isAudioSettingDisabled}
                    />
                </div>
            </div>
            <div className="space-y-4 bg-gray-100 p-4 rounded-lg shadow">
                <h3 className="font-semibold mb-2">Advanced Audio Settings</h3>
                <div className="space-y-2">
                    <Label htmlFor="audio-channels">Audio Channels</Label>
                    <Select
                        value={audioChannels}
                        onValueChange={onAudioChannelsChange}
                        disabled={isAudioSettingDisabled}
                    >
                        <SelectTrigger id="audio-channels">
                            <SelectValue placeholder="Select channels" />
                        </SelectTrigger>
                        <SelectContent>
                            {OPTIONS.AUDIO_CHANNELS.map((option) => (
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
                    <Label htmlFor="audio-sample-rate">Audio Sample Rate</Label>
                    <Select
                        value={audioSampleRate}
                        onValueChange={onAudioSampleRateChange}
                        disabled={isAudioSettingDisabled}
                    >
                        <SelectTrigger id="audio-sample-rate">
                            <SelectValue placeholder="Select sample rate" />
                        </SelectTrigger>
                        <SelectContent>
                            {OPTIONS.AUDIO_SAMPLE_RATE.map((option) => (
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
