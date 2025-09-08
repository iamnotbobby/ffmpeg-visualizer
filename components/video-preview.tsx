'use client'

import { useEffect, useState } from 'react'
import { Loader2 } from 'lucide-react'

interface VideoPreviewProps {
    processedVideo: Uint8Array | null
    isProcessing: boolean
    originalVideo: string | null
    onVideoLoad?: (duration: number) => void
}

export function VideoPreview({
    processedVideo,
    isProcessing,
    originalVideo,
    onVideoLoad,
}: VideoPreviewProps) {
    const [videoUrl, setVideoUrl] = useState<string | null>(null)

    useEffect(() => {
        if (processedVideo) {
            const blob = new Blob([new Uint8Array(processedVideo)], {
                type: 'video/mp4',
            })
            const url = URL.createObjectURL(blob)
            setVideoUrl(url)

            return () => {
                URL.revokeObjectURL(url)
            }
        } else {
            setVideoUrl(null)
        }
    }, [processedVideo])

    return (
        <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">
                        Video Processing Preview
                    </h2>
                    <p className="text-gray-600">
                        Compare original and processed videos side by side
                    </p>
                </div>
                {processedVideo && (
                    <div className="text-right">
                        <p className="text-sm text-gray-600">
                            Processed video ready
                        </p>
                        <p className="text-lg font-semibold text-green-600">
                            {(
                                processedVideo.byteLength /
                                (1024 * 1024)
                            ).toFixed(2)}{' '}
                            MB
                        </p>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                    <h3 className="text-xl font-semibold text-gray-700 mb-6 flex items-center gap-3">
                        <span className="w-4 h-4 bg-gray-500 rounded-full"></span>
                        Original Video
                    </h3>
                    <div className="aspect-video bg-gray-100 rounded-xl overflow-hidden border-2 border-gray-200 shadow-lg">
                        {originalVideo ? (
                            <video
                                src={originalVideo}
                                className="w-full h-full object-contain"
                                controls
                                controlsList="nodownload"
                                preload="metadata"
                                onLoadedMetadata={(e) => {
                                    const video = e.currentTarget
                                    if (
                                        onVideoLoad &&
                                        video.duration &&
                                        !isNaN(video.duration)
                                    ) {
                                        onVideoLoad(video.duration)
                                    }
                                }}
                            >
                                Your browser does not support the video tag.
                            </video>
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-500">
                                <div className="text-center">
                                    <div className="w-20 h-20 bg-gray-300 rounded-full mb-4 mx-auto"></div>
                                    <p className="text-xl">No video uploaded</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div>
                    <h3 className="text-xl font-semibold text-gray-700 mb-6 flex items-center gap-3">
                        <span
                            className={`w-4 h-4 rounded-full ${processedVideo ? 'bg-green-500' : isProcessing ? 'bg-blue-500 animate-pulse' : 'bg-gray-300'}`}
                        ></span>
                        Processed Video
                        {isProcessing && (
                            <span className="text-base text-blue-600 font-medium">
                                (Processing...)
                            </span>
                        )}
                    </h3>
                    <div className="aspect-video bg-gray-100 rounded-xl overflow-hidden border-2 border-gray-200 shadow-lg">
                        {isProcessing ? (
                            <div className="w-full h-full flex items-center justify-center bg-blue-50">
                                <div className="text-center">
                                    <Loader2 className="w-20 h-20 animate-spin mx-auto mb-6 text-blue-600" />
                                    <p className="text-xl text-blue-700 font-medium">
                                        Processing video...
                                    </p>
                                    <p className="text-base text-blue-600 mt-2">
                                        This may take a few moments
                                    </p>
                                </div>
                            </div>
                        ) : processedVideo && videoUrl ? (
                            <video
                                src={videoUrl}
                                className="w-full h-full object-contain"
                                controls
                                controlsList="nodownload"
                                preload="metadata"
                            >
                                Your browser does not support the video tag.
                            </video>
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-500">
                                <div className="text-center">
                                    <div className="w-20 h-20 bg-gray-300 rounded-full mb-4 mx-auto"></div>
                                    <p className="text-xl">
                                        {originalVideo
                                            ? 'Ready to process'
                                            : 'Upload a video to start'}
                                    </p>
                                    {originalVideo && (
                                        <p className="text-base text-gray-600 mt-2">
                                            Video will process automatically
                                        </p>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
