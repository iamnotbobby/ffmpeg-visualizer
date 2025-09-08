'use client'

import { VisualizerState } from '@/lib/types'
import { OPTIONS, STORAGE_KEY } from '@/lib/constants'
import { Settings2, Video, Volume2, FileText } from 'lucide-react'

interface SettingsPanelProps extends VisualizerState {
    updateState: (updates: Partial<VisualizerState>) => void
}

export function SettingsPanel(props: SettingsPanelProps) {
    const {
        muteAudio,
        videoCodec,
        audioCodec,
        videoBitrate,
        audioBitrate,
        videoPreset,
        videoProfile,
        videoLevel,
        videoFps,
        pixelFormat,
        audioChannels,
        audioSampleRate,
        restartAtTrimStart,
        outputFileName,
        updateState,
    } = props

    const clearSavedSettings = () => {
        if (typeof window !== 'undefined') {
            localStorage.removeItem(STORAGE_KEY)
            updateState({
                muteAudio: false,
                videoCodec: 'copy',
                audioCodec: 'copy',
                videoBitrate: '',
                audioBitrate: '',
                videoPreset: 'medium',
                videoProfile: 'high',
                videoLevel: '4.1',
                videoFps: '',
                pixelFormat: 'yuv420p',
                audioChannels: '2',
                audioSampleRate: '48000',
                restartAtTrimStart: true,
                outputFileName: '',
            })
        }
    }

    return (
        <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-3">
                    <Settings2 className="h-6 w-6" />
                    Settings
                </h2>
                <button
                    onClick={clearSavedSettings}
                    className="px-4 py-2 text-sm bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
                    title="Clear all saved settings and reset to defaults"
                >
                    Reset to Defaults
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="space-y-6">
                    <div className="border-l-4 border-blue-500 pl-4">
                        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2 mb-4">
                            <Video className="h-5 w-5 text-blue-500" />
                            Video Settings
                        </h3>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Video Codec
                            </label>
                            <select
                                value={videoCodec}
                                onChange={(e) =>
                                    updateState({ videoCodec: e.target.value })
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                {OPTIONS.VIDEO_CODEC.map((option) => (
                                    <option
                                        key={option.value}
                                        value={option.value}
                                    >
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {videoCodec !== 'copy' && (
                            <>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Video Bitrate
                                    </label>
                                    <input
                                        type="text"
                                        value={videoBitrate}
                                        onChange={(e) =>
                                            updateState({
                                                videoBitrate: e.target.value,
                                            })
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="e.g., 1M, 2000k"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Frame Rate (FPS)
                                    </label>
                                    <input
                                        type="text"
                                        value={videoFps}
                                        onChange={(e) =>
                                            updateState({
                                                videoFps: e.target.value,
                                            })
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="e.g., 30, 60"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Pixel Format
                                    </label>
                                    <select
                                        value={pixelFormat}
                                        onChange={(e) =>
                                            updateState({
                                                pixelFormat: e.target.value,
                                            })
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        {OPTIONS.PIXEL_FORMAT.map((option) => (
                                            <option
                                                key={option.value}
                                                value={option.value}
                                            >
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {videoCodec === 'libx264' && (
                                    <>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Preset
                                            </label>
                                            <select
                                                value={videoPreset}
                                                onChange={(e) =>
                                                    updateState({
                                                        videoPreset:
                                                            e.target.value,
                                                    })
                                                }
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            >
                                                {OPTIONS.VIDEO_PRESET.map(
                                                    (option) => (
                                                        <option
                                                            key={option.value}
                                                            value={option.value}
                                                        >
                                                            {option.label}
                                                        </option>
                                                    ),
                                                )}
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Profile
                                            </label>
                                            <select
                                                value={videoProfile}
                                                onChange={(e) =>
                                                    updateState({
                                                        videoProfile:
                                                            e.target.value,
                                                    })
                                                }
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            >
                                                {OPTIONS.VIDEO_PROFILE.map(
                                                    (option) => (
                                                        <option
                                                            key={option.value}
                                                            value={option.value}
                                                        >
                                                            {option.label}
                                                        </option>
                                                    ),
                                                )}
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Level
                                            </label>
                                            <select
                                                value={videoLevel}
                                                onChange={(e) =>
                                                    updateState({
                                                        videoLevel:
                                                            e.target.value,
                                                    })
                                                }
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            >
                                                {OPTIONS.VIDEO_LEVEL.map(
                                                    (option) => (
                                                        <option
                                                            key={option.value}
                                                            value={option.value}
                                                        >
                                                            {option.label}
                                                        </option>
                                                    ),
                                                )}
                                            </select>
                                        </div>
                                    </>
                                )}
                            </>
                        )}
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="border-l-4 border-green-500 pl-4">
                        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2 mb-4">
                            <Volume2 className="h-5 w-5 text-green-500" />
                            Audio Settings
                        </h3>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="muteAudio"
                                checked={muteAudio}
                                onChange={(e) =>
                                    updateState({ muteAudio: e.target.checked })
                                }
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <label
                                htmlFor="muteAudio"
                                className="ml-3 text-sm font-medium text-gray-700"
                            >
                                Mute Audio (Remove audio track)
                            </label>
                        </div>

                        {!muteAudio && (
                            <>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Audio Codec
                                    </label>
                                    <select
                                        value={audioCodec}
                                        onChange={(e) =>
                                            updateState({
                                                audioCodec: e.target.value,
                                            })
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        {OPTIONS.AUDIO_CODEC.map((option) => (
                                            <option
                                                key={option.value}
                                                value={option.value}
                                            >
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {audioCodec !== 'copy' && (
                                    <>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Audio Bitrate
                                            </label>
                                            <input
                                                type="text"
                                                value={audioBitrate}
                                                onChange={(e) =>
                                                    updateState({
                                                        audioBitrate:
                                                            e.target.value,
                                                    })
                                                }
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                placeholder="e.g., 128k, 320k"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Audio Channels
                                            </label>
                                            <select
                                                value={audioChannels}
                                                onChange={(e) =>
                                                    updateState({
                                                        audioChannels:
                                                            e.target.value,
                                                    })
                                                }
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            >
                                                {OPTIONS.AUDIO_CHANNELS.map(
                                                    (option) => (
                                                        <option
                                                            key={option.value}
                                                            value={option.value}
                                                        >
                                                            {option.label}
                                                        </option>
                                                    ),
                                                )}
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Sample Rate
                                            </label>
                                            <select
                                                value={audioSampleRate}
                                                onChange={(e) =>
                                                    updateState({
                                                        audioSampleRate:
                                                            e.target.value,
                                                    })
                                                }
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            >
                                                {OPTIONS.AUDIO_SAMPLE_RATE.map(
                                                    (option) => (
                                                        <option
                                                            key={option.value}
                                                            value={option.value}
                                                        >
                                                            {option.label}
                                                        </option>
                                                    ),
                                                )}
                                            </select>
                                        </div>
                                    </>
                                )}
                            </>
                        )}
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="border-l-4 border-purple-500 pl-4">
                        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2 mb-4">
                            <FileText className="h-5 w-5 text-purple-500" />
                            Output Settings
                        </h3>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Output Filename
                            </label>
                            <input
                                type="text"
                                value={outputFileName}
                                onChange={(e) =>
                                    updateState({
                                        outputFileName: e.target.value,
                                    })
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="output.mp4"
                            />
                        </div>

                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="restartAtTrimStart"
                                checked={restartAtTrimStart}
                                onChange={(e) =>
                                    updateState({
                                        restartAtTrimStart: e.target.checked,
                                    })
                                }
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <label
                                htmlFor="restartAtTrimStart"
                                className="ml-3 text-sm text-gray-700"
                            >
                                Restart at trim start after reaching end
                            </label>
                        </div>

                        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                            <h4 className="text-sm font-medium text-gray-700 mb-3">
                                Quick Info
                            </h4>
                            <div className="space-y-2 text-xs text-gray-600">
                                <div className="flex justify-between">
                                    <span>Video:</span>
                                    <span className="font-mono">
                                        {videoCodec}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Audio:</span>
                                    <span className="font-mono">
                                        {muteAudio ? 'Muted' : audioCodec}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Output:</span>
                                    <span className="font-mono">
                                        {outputFileName || 'output.mp4'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
