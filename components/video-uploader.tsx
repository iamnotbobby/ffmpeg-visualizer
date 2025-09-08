'use client'

import { useCallback } from 'react'
import { Upload } from 'lucide-react'

interface VideoUploaderProps {
    onVideoUpload: (file: File) => void
}

export function VideoUploader({ onVideoUpload }: VideoUploaderProps) {
    const handleFileSelect = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            const file = event.target.files?.[0]
            if (file && file.type.startsWith('video/')) {
                onVideoUpload(file)
            }
        },
        [onVideoUpload],
    )

    const handleDrop = useCallback(
        (event: React.DragEvent) => {
            event.preventDefault()
            const file = event.dataTransfer.files[0]
            if (file && file.type.startsWith('video/')) {
                onVideoUpload(file)
            }
        },
        [onVideoUpload],
    )

    const handleDragOver = useCallback((event: React.DragEvent) => {
        event.preventDefault()
    }, [])

    return (
        <div className="max-w-2xl mx-auto">
            <div
                className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-gray-400 transition-colors"
                onDrop={handleDrop}
                onDragOver={handleDragOver}
            >
                <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Upload a video file
                </h3>
                <p className="text-gray-600 mb-6">
                    Drag and drop a video file here, or click to select
                </p>
                <label className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors">
                    <input
                        type="file"
                        className="hidden"
                        accept="video/*"
                        onChange={handleFileSelect}
                    />
                    Choose File
                </label>
            </div>
        </div>
    )
}
