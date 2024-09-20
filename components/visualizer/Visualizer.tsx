'use client'

import { useRef, useEffect, useCallback } from 'react'
import { useToast } from '@/hooks/use-toast'
import { FileInput } from './FileInput'
import { VideoPlayer } from './VideoPlayer'
import { GeneralSettings } from './settings/GeneralSettings'
import { VideoSettings } from './settings/VideoSettings'
import { AudioSettings } from './settings/AudioSettings'
import { FFmpegCommand } from './FFmpegCommand'
import { Footer } from './Footer'
import { TrimmerControls } from './controls/TrimmerControls'
import { useVisualizer } from '@/hooks/useVisualizer'
import { NavigationControls } from './controls/NavigationControls'

export default function Visualizer() {
    const {
        state,
        updateState,
        ffmpegCommand,
        clearSettings,
        updateFFmpegCommand,
        resetFFmpegCommand,
        isManuallyEdited,
    } = useVisualizer()
    const videoRef = useRef<HTMLVideoElement>(null)
    const { toast } = useToast()

    const handleFileChange = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            const file = event.target.files?.[0]
            if (file) {
                const url = URL.createObjectURL(file)
                updateState({ videoSrc: url, fileName: file.name })
            }
        },
        [updateState],
    )

    useEffect(() => {
        const video = videoRef.current
        if (video) {
            const handleLoadedMetadata = () => {
                const videoDuration = video.duration
                updateState({
                    duration: videoDuration,
                    endTime: videoDuration,
                })
            }

            const handleTimeUpdate = () => {
                updateState({ currentTime: video.currentTime })
                if (
                    video.currentTime >= state.endTime &&
                    state.restartAtTrimStart
                ) {
                    video.currentTime = state.startTime
                }
            }

            video.addEventListener('loadedmetadata', handleLoadedMetadata)
            video.addEventListener('timeupdate', handleTimeUpdate)

            return () => {
                video.removeEventListener(
                    'loadedmetadata',
                    handleLoadedMetadata,
                )
                video.removeEventListener('timeupdate', handleTimeUpdate)
            }
        }
    }, [
        state.videoSrc,
        state.startTime,
        state.endTime,
        state.restartAtTrimStart,
        updateState,
    ])

    const jumpToStart = useCallback(() => {
        if (videoRef.current) {
            videoRef.current.currentTime = state.startTime
            updateState({ currentTime: state.startTime })
        }
    }, [state.startTime, updateState])

    const setStartTrimmer = useCallback(() => {
        updateState({ startTime: state.currentTime })
    }, [state.currentTime, updateState])

    const setEndTrimmer = useCallback(() => {
        updateState({ endTime: state.currentTime })
    }, [state.currentTime, updateState])

    const handleCopyCommand = useCallback(() => {
        navigator.clipboard
            .writeText(ffmpegCommand)
            .then(() =>
                toast({
                    title: 'Copied!',
                    description: 'FFmpeg command copied to clipboard',
                }),
            )
            .catch(() =>
                toast({
                    title: 'Failed to copy',
                    description: 'Please try again',
                    variant: 'destructive',
                }),
            )
    }, [ffmpegCommand, toast])

    return (
        <div className="space-y-6 max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-lg">
            <h1 className="text-3xl font-bold text-center mb-6">
                FFmpeg Visualizer
            </h1>

            <FileInput onFileChange={handleFileChange} />

            {state.videoSrc && (
                <>
                    <VideoPlayer
                        videoSrc={state.videoSrc}
                        videoRef={videoRef}
                    />

                    <TrimmerControls
                        startTime={state.startTime}
                        endTime={state.endTime}
                        duration={state.duration}
                        onStartTimeChange={(value) =>
                            updateState({ startTime: value })
                        }
                        onEndTimeChange={(value) =>
                            updateState({ endTime: value })
                        }
                        onSetStartTrimmer={setStartTrimmer}
                        onSetEndTrimmer={setEndTrimmer}
                    />

                    <NavigationControls
                        currentTime={state.currentTime}
                        duration={state.duration}
                        startTime={state.startTime}
                        endTime={state.endTime}
                        onCurrentTimeChange={(time) => {
                            updateState({ currentTime: time })
                            if (videoRef.current) {
                                videoRef.current.currentTime = time
                            }
                        }}
                        onJumpToStart={jumpToStart}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                        <GeneralSettings
                            muteAudio={state.muteAudio}
                            restartAtTrimStart={state.restartAtTrimStart}
                            outputFileName={state.outputFileName}
                            onMuteAudioChange={(checked) =>
                                updateState({ muteAudio: checked })
                            }
                            onRestartAtTrimStartChange={(checked) =>
                                updateState({ restartAtTrimStart: checked })
                            }
                            onOutputFileNameChange={(fileName) =>
                                updateState({ outputFileName: fileName })
                            }
                            onClearSettings={clearSettings}
                        />

                        <div className="space-y-4 bg-gray-100 p-4 rounded-lg shadow">
                            <h3 className="font-semibold mb-2">Info</h3>
                            <p className="text-sm text-gray-600">
                                From here, you can input a video and easily
                                select FFmpeg options. This is only intended for
                                helping with command options.
                            </p>
                        </div>

                        <VideoSettings
                            videoCodec={state.videoCodec}
                            videoBitrate={state.videoBitrate}
                            videoPreset={state.videoPreset}
                            videoProfile={state.videoProfile}
                            videoLevel={state.videoLevel}
                            videoFps={state.videoFps}
                            pixelFormat={state.pixelFormat}
                            onVideoCodecChange={(value) =>
                                updateState({ videoCodec: value })
                            }
                            onVideoBitrateChange={(value) =>
                                updateState({ videoBitrate: value })
                            }
                            onVideoPresetChange={(value) =>
                                updateState({ videoPreset: value })
                            }
                            onVideoProfileChange={(value) =>
                                updateState({ videoProfile: value })
                            }
                            onVideoLevelChange={(value) =>
                                updateState({ videoLevel: value })
                            }
                            onVideoFpsChange={(value) =>
                                updateState({ videoFps: value })
                            }
                            onPixelFormatChange={(value) =>
                                updateState({ pixelFormat: value })
                            }
                        />

                        <AudioSettings
                            audioCodec={state.audioCodec}
                            audioBitrate={state.audioBitrate}
                            audioChannels={state.audioChannels}
                            audioSampleRate={state.audioSampleRate}
                            muteAudio={state.muteAudio}
                            onAudioCodecChange={(value) =>
                                updateState({ audioCodec: value })
                            }
                            onAudioBitrateChange={(value) =>
                                updateState({ audioBitrate: value })
                            }
                            onAudioChannelsChange={(value) =>
                                updateState({ audioChannels: value })
                            }
                            onAudioSampleRateChange={(value) =>
                                updateState({ audioSampleRate: value })
                            }
                        />
                    </div>

                    <FFmpegCommand
                        ffmpegCommand={ffmpegCommand}
                        onFFmpegCommandChange={updateFFmpegCommand}
                        onCopyCommand={handleCopyCommand}
                        onResetCommand={resetFFmpegCommand}
                        isManuallyEdited={isManuallyEdited}
                    />
                </>
            )}

            <Footer />
        </div>
    )
}
