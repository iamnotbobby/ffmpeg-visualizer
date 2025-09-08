'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import {
    Play,
    Loader2,
    AlertCircle,
    ToggleLeft,
    ToggleRight,
} from 'lucide-react'
import { useFFmpeg } from '@/hooks/useFFmpeg'

interface ProcessingSettings {
    startTime: number
    endTime: number
    duration: number
    muteAudio: boolean
    videoCodec: string
    audioCodec: string
    videoBitrate: string
    audioBitrate: string
    videoPreset: string
    videoProfile: string
    videoLevel: string
    videoFps: string
    pixelFormat: string
    audioChannels: string
    audioSampleRate: string
    outputFileName: string
}

interface ProcessingControlsProps {
    videoFile: File | null
    ffmpegCommand: string
    settings: ProcessingSettings
    onVideoProcessed?: (
        video: Uint8Array | null,
        isProcessing: boolean,
        originalVideoUrl: string | null,
    ) => void
}

function buildTimeRangeOptions(settings: ProcessingSettings): string[] {
    const options: string[] = []

    const isValidTime = (time: number) =>
        typeof time === 'number' && !isNaN(time) && isFinite(time) && time >= 0

    if (
        !isValidTime(settings.startTime) ||
        !isValidTime(settings.endTime) ||
        !isValidTime(settings.duration)
    ) {
        console.warn('Invalid timing values detected:', {
            startTime: settings.startTime,
            endTime: settings.endTime,
            duration: settings.duration,
        })
        return options
    }

    const safeStartTime = Math.min(settings.startTime, settings.duration - 0.1)

    if (safeStartTime > 0) {
        options.push('-ss', formatTime(safeStartTime))
    }

    if (
        settings.endTime > safeStartTime &&
        settings.endTime < settings.duration
    ) {
        const duration = settings.endTime - safeStartTime
        if (duration > 0.1) {
            options.push('-t', formatTime(duration))
        }
    } else if (safeStartTime > 0 && settings.endTime >= settings.duration) {
        const duration = settings.duration - safeStartTime
        if (duration > 0.1) {
            options.push('-t', formatTime(duration))
        }
    }

    return options
}

function buildVideoCodecOptions(settings: ProcessingSettings): string[] {
    const options: string[] = []

    if (settings.videoCodec !== 'copy') {
        options.push('-c:v', settings.videoCodec)

        if (settings.videoBitrate) {
            options.push('-b:v', settings.videoBitrate)
        }

        if (settings.videoCodec === 'libx264') {
            options.push('-preset', settings.videoPreset)
            options.push('-profile:v', settings.videoProfile)
            options.push('-level', settings.videoLevel)
        }

        if (settings.videoFps) {
            options.push('-r', settings.videoFps)
        }

        options.push('-pix_fmt', settings.pixelFormat)
    } else {
        options.push('-c:v', 'copy')
    }

    return options
}

function buildAudioCodecOptions(settings: ProcessingSettings): string[] {
    const options: string[] = []

    if (settings.muteAudio) {
        options.push('-an')
    } else if (settings.audioCodec !== 'copy') {
        options.push('-c:a', settings.audioCodec)

        if (settings.audioCodec === 'libopus') {
            if (settings.audioBitrate) {
                options.push('-b:a', settings.audioBitrate)
            } else {
                options.push('-b:a', '128k')
            }

            const channels = parseInt(settings.audioChannels)
            if (channels === 1) {
                options.push('-ac', '1')
            } else {
                options.push('-ac', '2')
            }

            const sampleRate = parseInt(settings.audioSampleRate)
            if ([8000, 12000, 16000, 24000, 48000].includes(sampleRate)) {
                options.push('-ar', settings.audioSampleRate)
            } else {
                options.push('-ar', '48000')
            }

            options.push('-application', 'audio')
            options.push('-frame_duration', '20')
        } else if (settings.audioCodec === 'aac') {
            if (settings.audioBitrate) {
                options.push('-b:a', settings.audioBitrate)
            }
            options.push('-ac', settings.audioChannels)
            options.push('-ar', settings.audioSampleRate)
        } else {
            if (settings.audioBitrate) {
                options.push('-b:a', settings.audioBitrate)
            }
            options.push('-ac', settings.audioChannels)
            options.push('-ar', settings.audioSampleRate)
        }
    } else {
        options.push('-c:a', 'copy')
    }

    return options
}

function formatTime(seconds: number): string {
    if (!isFinite(seconds) || isNaN(seconds) || seconds < 0) {
        console.warn('Invalid time value provided to formatTime:', seconds)
        return '00:00:00.000'
    }

    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = Math.floor(seconds % 60)
    const ms = Math.floor((seconds % 1) * 1000)

    return `${hours.toString().padStart(2, '0')}:${minutes
        .toString()
        .padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${ms
        .toString()
        .padStart(3, '0')}`
}

export function ProcessingControls({
    videoFile,
    ffmpegCommand,
    settings,
    onVideoProcessed,
}: ProcessingControlsProps) {
    const {
        isLoading,
        isReady,
        progress,
        error,
        load,
        transcode,
        isTranscoding,
    } = useFFmpeg()
    const [processedVideo, setProcessedVideo] = useState<Uint8Array | null>(
        null,
    )
    const [autoProcess, setAutoProcess] = useState(true)
    const [originalVideoUrl, setOriginalVideoUrl] = useState<string | null>(
        null,
    )
    const [lastSettingsHash, setLastSettingsHash] = useState<string>('')
    const [isProcessingQueued, setIsProcessingQueued] = useState(false)

    const autoProcessTimeoutRef = useRef<NodeJS.Timeout | null>(null)
    const isProcessingRef = useRef(false)

    const handleLoadFFmpeg = useCallback(async () => {
        await load()
    }, [load])

    useEffect(() => {
        if (videoFile && !isReady && !isLoading) {
            handleLoadFFmpeg()
        }
    }, [videoFile, isReady, isLoading, handleLoadFFmpeg])

    useEffect(() => {
        if (videoFile) {
            const url = URL.createObjectURL(videoFile)
            setOriginalVideoUrl(url)

            return () => {
                URL.revokeObjectURL(url)
            }
        } else {
            setOriginalVideoUrl(null)
        }
    }, [videoFile])

    const createSettingsHash = useCallback(
        (settingsObj: ProcessingControlsProps['settings']) => {
            return JSON.stringify(settingsObj)
        },
        [],
    )

    useEffect(() => {
        isProcessingRef.current = isTranscoding
    }, [isTranscoding])

    const handleProcess = useCallback(async () => {
        if (!videoFile || !(videoFile instanceof File) || !isReady) {
            console.error(
                'Cannot process: missing videoFile or FFmpeg not ready',
            )
            return
        }

        if (!settings.duration || settings.duration <= 0) {
            console.error('Cannot process: invalid video duration')
            return
        }

        if (settings.startTime >= settings.duration) {
            console.error(
                'Cannot process: start time is at or beyond video duration',
            )
            return
        }

        if (settings.endTime <= settings.startTime) {
            console.error('Cannot process: end time must be after start time')
            return
        }

        if (
            settings.audioCodec === 'libopus' &&
            settings.videoCodec === 'copy'
        ) {
            console.warn(
                'Using Opus audio with copied video stream may cause compatibility issues. Consider using AAC audio codec for better compatibility.',
            )
        }

        try {
            console.log('Processing with settings:', {
                startTime: settings.startTime,
                endTime: settings.endTime,
                duration: settings.duration,
                videoCodec: settings.videoCodec,
                audioCodec: settings.audioCodec,
            })

            const options = [
                ...buildTimeRangeOptions(settings),
                ...buildVideoCodecOptions(settings),
                ...buildAudioCodecOptions(settings),
            ]

            console.log('Generated FFmpeg options:', options)

            const outputName = settings.outputFileName || 'output.mp4'
            const result = await transcode(videoFile, outputName, options)

            if (result) {
                setProcessedVideo(result)
            }
        } catch (err) {
            console.error('Processing failed:', err)
            if (
                err instanceof Error &&
                (err.message.includes('codec') ||
                    err.message.includes('index out of bounds'))
            ) {
                console.warn(
                    'Codec compatibility issue detected. Consider using safer settings: video codec "copy" and audio codec "aac".',
                )
            }
        }
    }, [videoFile, isReady, settings, transcode])

    useEffect(() => {
        if (
            isReady &&
            videoFile &&
            autoProcess &&
            !processedVideo &&
            !isTranscoding
        ) {
            setTimeout(() => {
                if (!isProcessingRef.current) {
                    handleProcess()
                }
            }, 500)
        }
    }, [
        isReady,
        videoFile,
        autoProcess,
        processedVideo,
        isTranscoding,
        handleProcess,
    ])

    const debouncedAutoProcess = useCallback(() => {
        if (autoProcessTimeoutRef.current) {
            clearTimeout(autoProcessTimeoutRef.current)
        }

        autoProcessTimeoutRef.current = setTimeout(async () => {
            if (
                !autoProcess ||
                !videoFile ||
                !isReady ||
                isProcessingRef.current ||
                isProcessingQueued
            ) {
                return
            }

            setIsProcessingQueued(true)

            try {
                await handleProcess()
            } finally {
                setIsProcessingQueued(false)
            }
        }, 1500)
    }, [autoProcess, videoFile, isReady, isProcessingQueued, handleProcess])

    useEffect(() => {
        if (!autoProcess || !videoFile || !isReady) return

        const currentHash = createSettingsHash(settings)
        if (currentHash !== lastSettingsHash && lastSettingsHash !== '') {
            debouncedAutoProcess()
        }
        setLastSettingsHash(currentHash)
    }, [
        autoProcess,
        videoFile,
        isReady,
        settings,
        lastSettingsHash,
        createSettingsHash,
        debouncedAutoProcess,
    ])

    useEffect(() => {
        if (autoProcess && lastSettingsHash === '') {
            setLastSettingsHash(createSettingsHash(settings))
        }
    }, [autoProcess, lastSettingsHash, settings, createSettingsHash])

    useEffect(() => {
        return () => {
            if (autoProcessTimeoutRef.current) {
                clearTimeout(autoProcessTimeoutRef.current)
            }
        }
    }, [])

    useEffect(() => {
        if (onVideoProcessed) {
            onVideoProcessed(processedVideo, isTranscoding, originalVideoUrl)
        }
    }, [processedVideo, isTranscoding, originalVideoUrl, onVideoProcessed])

    if (!videoFile) {
        return (
            <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    FFmpeg Processing
                </h2>
                <div className="p-8 text-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                    <div className="max-w-sm mx-auto">
                        <div className="w-16 h-16 bg-gray-300 rounded-full mx-auto mb-4"></div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                            Ready to Process Videos
                        </h3>
                        <p className="text-gray-600">
                            Upload a video to start using FFmpeg processing
                        </p>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
                FFmpeg Processing
            </h2>

            <div className="space-y-6">
                {!isReady && (
                    <div className="p-6 bg-white rounded-lg border border-gray-200">
                        <div className="text-center space-y-4">
                            <h3 className="text-lg font-semibold text-gray-900">
                                Initialize FFmpeg
                            </h3>
                            <p className="text-gray-600">
                                {videoFile
                                    ? 'FFmpeg is loading automatically...'
                                    : 'Upload a video to initialize FFmpeg'}
                            </p>

                            <button
                                onClick={handleLoadFFmpeg}
                                disabled={isLoading}
                                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Loading FFmpeg...
                                    </>
                                ) : (
                                    <>
                                        <Play className="w-5 h-5" />
                                        Load FFmpeg Manually
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                )}

                {isReady && (
                    <div className="space-y-4">
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 p-4 bg-white rounded-lg border border-gray-200">
                            <div className="flex-1">
                                <div className="flex items-center gap-4">
                                    <button
                                        onClick={handleProcess}
                                        disabled={isTranscoding}
                                        className="flex items-center gap-3 px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg"
                                    >
                                        {isTranscoding ? (
                                            <>
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                                Processing Video...
                                            </>
                                        ) : (
                                            <>
                                                <Play className="w-5 h-5" />
                                                Process Video
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 px-4 py-2 bg-gray-50 rounded-lg">
                                <span className="text-sm font-medium text-gray-700">
                                    Auto-process:
                                </span>
                                <button
                                    onClick={() => setAutoProcess(!autoProcess)}
                                    className={`flex items-center gap-1 px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                                        autoProcess
                                            ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                                            : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                                    }`}
                                    title={
                                        autoProcess
                                            ? 'Auto-processing enabled - changes trigger automatic processing'
                                            : 'Auto-processing disabled - manual processing only'
                                    }
                                >
                                    {autoProcess ? (
                                        <>
                                            <ToggleRight className="w-5 h-5" />
                                            ON
                                        </>
                                    ) : (
                                        <>
                                            <ToggleLeft className="w-5 h-5" />
                                            OFF
                                        </>
                                    )}
                                </button>
                                {isProcessingQueued && (
                                    <span className="text-xs font-medium text-blue-600 animate-pulse">
                                        Queued...
                                    </span>
                                )}
                            </div>
                        </div>

                        {progress && (
                            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm font-medium text-blue-900">
                                            Processing Progress
                                        </span>
                                        <span className="text-sm text-blue-700">
                                            {Math.round(progress.ratio * 100)}%
                                        </span>
                                    </div>
                                    <div className="w-full bg-blue-200 rounded-full h-3">
                                        <div
                                            className="bg-blue-600 h-3 rounded-full transition-all duration-300 relative overflow-hidden"
                                            style={{
                                                width: `${progress.ratio * 100}%`,
                                            }}
                                        >
                                            <div className="absolute inset-0 bg-white opacity-20 animate-pulse"></div>
                                        </div>
                                    </div>
                                    <div className="flex justify-between text-xs text-blue-600">
                                        <span>
                                            Processing time:{' '}
                                            {Math.round(progress.time)}s
                                        </span>
                                        <span>Please wait...</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {processedVideo && (
                            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                                <div className="flex items-center gap-2">
                                    <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                                        <svg
                                            className="w-3 h-3 text-white"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-green-800 font-semibold">
                                            Video processed successfully!
                                        </p>
                                        <p className="text-green-600 text-sm">
                                            Output size:{' '}
                                            {(
                                                processedVideo.byteLength /
                                                (1024 * 1024)
                                            ).toFixed(2)}{' '}
                                            MB
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {error && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                        <div className="flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="text-red-800 font-semibold">
                                    Processing Error
                                </p>
                                <p className="text-red-600 text-sm mt-1">
                                    {error}
                                </p>
                                <button
                                    onClick={() => window.location.reload()}
                                    className="mt-2 text-xs text-red-700 hover:text-red-800 underline"
                                >
                                    Try refreshing the page
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
