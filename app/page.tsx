'use client'

import { useState } from 'react'
import { Github } from 'lucide-react'
import { VideoUploader } from '@/components/video-uploader'
import { SettingsPanel } from '@/components/settings-panel'
import { CommandOutput } from '@/components/command-output'
import { ProcessingControls } from '@/components/processing-controls'
import { VideoPreview } from '@/components/video-preview'
import { TrimControls } from '@/components/trim-controls'
import { useVisualizer } from '@/hooks/useVisualizer'

export default function Home() {
    const visualizer = useVisualizer()
    const [processedVideo, setProcessedVideo] = useState<Uint8Array | null>(
        null,
    )
    const [isProcessing, setIsProcessing] = useState(false)
    const [originalVideoUrl, setOriginalVideoUrl] = useState<string | null>(
        null,
    )
    const [customCommand, setCustomCommand] = useState<string | null>(null)
    const [isCommandModified, setIsCommandModified] = useState(false)

    const handleVideoProcessed = (
        video: Uint8Array | null,
        processing: boolean,
        originalUrl: string | null,
    ) => {
        setProcessedVideo(video)
        setIsProcessing(processing)
        setOriginalVideoUrl(originalUrl)
    }

    const handleCommandChange = (command: string, isModified: boolean) => {
        setCustomCommand(command)
        setIsCommandModified(isModified)
    }

    return (
        <main className="min-h-screen bg-gray-50 p-4">
            <div className="max-w-7xl mx-auto space-y-6">
                <header className="text-center py-8">
                    <div className="flex items-center justify-center gap-4 mb-4">
                        <h1 className="text-4xl font-bold text-gray-900">
                            FFmpeg Visualizer
                        </h1>
                    </div>
                </header>

                {!visualizer.videoSrc ? (
                    <VideoUploader
                        onVideoUpload={visualizer.handleVideoUpload}
                    />
                ) : (
                    <div className="space-y-8">
                        <div className="w-full">
                            <VideoPreview
                                processedVideo={processedVideo}
                                isProcessing={isProcessing}
                                originalVideo={
                                    originalVideoUrl || visualizer.videoSrc
                                }
                                onVideoLoad={visualizer.handleVideoLoad}
                            />
                        </div>

                        <div className="w-full space-y-8">
                            <div className="w-full">
                                <TrimControls
                                    startTime={visualizer.startTime}
                                    endTime={visualizer.endTime}
                                    duration={visualizer.duration}
                                    fileName={visualizer.fileName}
                                    updateState={visualizer.updateState}
                                />
                            </div>

                            <div className="w-full">
                                <SettingsPanel {...visualizer} />
                            </div>

                            <div className="w-full space-y-6">
                                <ProcessingControls
                                    videoFile={visualizer.videoFile}
                                    ffmpegCommand={
                                        isCommandModified
                                            ? customCommand ||
                                              visualizer.ffmpegCommand
                                            : visualizer.ffmpegCommand
                                    }
                                    settings={{
                                        startTime: visualizer.startTime,
                                        endTime: visualizer.endTime,
                                        duration: visualizer.duration,
                                        muteAudio: visualizer.muteAudio,
                                        videoCodec: visualizer.videoCodec,
                                        audioCodec: visualizer.audioCodec,
                                        videoBitrate: visualizer.videoBitrate,
                                        audioBitrate: visualizer.audioBitrate,
                                        videoPreset: visualizer.videoPreset,
                                        videoProfile: visualizer.videoProfile,
                                        videoLevel: visualizer.videoLevel,
                                        videoFps: visualizer.videoFps,
                                        pixelFormat: visualizer.pixelFormat,
                                        audioChannels: visualizer.audioChannels,
                                        audioSampleRate:
                                            visualizer.audioSampleRate,
                                        outputFileName:
                                            visualizer.outputFileName,
                                    }}
                                    onVideoProcessed={handleVideoProcessed}
                                />

                                <CommandOutput
                                    command={visualizer.ffmpegCommand}
                                    fileName={visualizer.fileName}
                                    outputFileName={visualizer.outputFileName}
                                    onCommandChange={handleCommandChange}
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <footer className="mt-16 py-8 border-t border-dashed border-gray-300">
                <div className="text-center">
                    <div className="flex items-center justify-center gap-2 text-gray-600 mb-2">
                        <span>built with</span>
                        <span className="text-red-500">♥</span>
                        <span>by</span>
                        <a
                            href="https://github.com/iamnotbobby"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
                        >
                            iamnotbobby
                        </a>
                    </div>
                    <div className="flex items-center justify-center gap-4">
                        <a
                            href="https://github.com/iamnotbobby/ffmpeg-visualizer"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                        >
                            <Github className="w-4 h-4" />
                            <span className="text-sm">
                                view source on github
                            </span>
                        </a>
                        <span className="text-gray-400">|</span>
                        <span className="text-sm text-gray-600">
                            ffmpeg.wasm + typescript
                        </span>
                    </div>
                </div>
            </footer>
        </main>
    )
}
