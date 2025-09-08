'use client'

import { useCallback, useRef, useState, useEffect } from 'react'
import { VisualizerState } from '@/lib/types'
import { formatTimeFlexible } from '@/lib/utils'
import { Scissors, RotateCcw } from 'lucide-react'

interface TrimControlsProps
    extends Pick<
        VisualizerState,
        'startTime' | 'endTime' | 'duration' | 'fileName'
    > {
    updateState: (updates: Partial<VisualizerState>) => void
}

export function TrimControls({
    startTime,
    endTime,
    duration,
    fileName,
    updateState,
}: TrimControlsProps) {
    return (
        <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-3">
                    <Scissors className="h-6 w-6" />
                    Trim Controls
                </h2>
                {duration > 0 && (
                    <button
                        onClick={() =>
                            updateState({ startTime: 0, endTime: duration })
                        }
                        className="flex items-center gap-2 px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                        title="Reset to full video"
                    >
                        <RotateCcw className="h-4 w-4" />
                        Reset to Full Video
                    </button>
                )}
            </div>

            {duration <= 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                    <Scissors className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-xl font-medium text-gray-500 mb-2">
                        No Video Loaded
                    </h3>
                    <p className="text-gray-400">
                        Upload a video to use trim controls
                    </p>
                    <p className="text-xs text-gray-300 mt-2">
                        Duration: {duration}
                    </p>
                </div>
            ) : (
                <>
                    <div className="bg-blue-50 p-6 rounded-lg border border-blue-200 mb-8">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
                            <div>
                                <span className="block text-sm font-medium text-gray-700">
                                    Original Duration
                                </span>
                                <span className="block text-lg font-bold text-gray-900 mt-1">
                                    {formatTimeFlexible(duration)}
                                </span>
                            </div>
                            <div>
                                <span className="block text-sm font-medium text-gray-700">
                                    Start Time
                                </span>
                                <span className="block text-lg font-bold text-blue-600 mt-1">
                                    {formatTimeFlexible(startTime)}
                                </span>
                            </div>
                            <div>
                                <span className="block text-sm font-medium text-gray-700">
                                    End Time
                                </span>
                                <span className="block text-lg font-bold text-blue-600 mt-1">
                                    {formatTimeFlexible(endTime)}
                                </span>
                            </div>
                            <div>
                                <span className="block text-sm font-medium text-gray-700">
                                    Trimmed Duration
                                </span>
                                <span className="block text-lg font-bold text-green-600 mt-1">
                                    {formatTimeFlexible(endTime - startTime)}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4 mb-8">
                        <div className="flex justify-between text-lg font-medium text-gray-700">
                            <span>Interactive Timeline</span>
                            <span>
                                Trim Range: {formatTimeFlexible(startTime)} -{' '}
                                {formatTimeFlexible(endTime)}
                            </span>
                        </div>
                        <DraggableTimeline
                            duration={duration}
                            startTime={startTime}
                            endTime={endTime}
                            onTimeChange={(start, end) =>
                                updateState({ startTime: start, endTime: end })
                            }
                        />
                        <div className="flex justify-between text-sm font-medium text-gray-500">
                            <span>0:00</span>
                            <span>{formatTimeFlexible(duration)}</span>
                        </div>
                    </div>

                    <div>
                        <label className="block text-lg font-semibold text-gray-700 mb-4">
                            Quick Presets
                        </label>
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                            <button
                                onClick={() =>
                                    updateState({
                                        startTime: 0,
                                        endTime: duration,
                                    })
                                }
                                className="px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium border border-gray-300"
                            >
                                Full Video
                            </button>
                            <button
                                onClick={() =>
                                    updateState({
                                        startTime: 0,
                                        endTime: duration / 2,
                                    })
                                }
                                className="px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium border border-gray-300"
                            >
                                First Half
                            </button>
                            <button
                                onClick={() =>
                                    updateState({
                                        startTime: duration / 2,
                                        endTime: duration,
                                    })
                                }
                                className="px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium border border-gray-300"
                            >
                                Second Half
                            </button>
                            <button
                                onClick={() => {
                                    const center = duration / 2
                                    const halfMinute = 30
                                    updateState({
                                        startTime: Math.max(
                                            0,
                                            center - halfMinute,
                                        ),
                                        endTime: Math.min(
                                            duration,
                                            center + halfMinute,
                                        ),
                                    })
                                }}
                                className="px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium border border-gray-300"
                            >
                                1 Min Center
                            </button>
                            <button
                                onClick={() =>
                                    updateState({
                                        startTime: 0,
                                        endTime: Math.min(30, duration),
                                    })
                                }
                                className="px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium border border-gray-300"
                            >
                                First 30s
                            </button>
                            <button
                                onClick={() =>
                                    updateState({
                                        startTime: Math.max(0, duration - 30),
                                        endTime: duration,
                                    })
                                }
                                className="px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium border border-gray-300"
                            >
                                Last 30s
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}

interface DraggableTimelineProps {
    duration: number
    startTime: number
    endTime: number
    onTimeChange: (startTime: number, endTime: number) => void
}

function DraggableTimeline({
    duration,
    startTime,
    endTime,
    onTimeChange,
}: DraggableTimelineProps) {
    const timelineRef = useRef<HTMLDivElement>(null)
    const [isDragging, setIsDragging] = useState<
        'start' | 'end' | 'range' | null
    >(null)
    const [dragStart, setDragStart] = useState({
        x: 0,
        initialStart: 0,
        initialEnd: 0,
    })

    const startPercentage = duration > 0 ? (startTime / duration) * 100 : 0
    const endPercentage = duration > 0 ? (endTime / duration) * 100 : 0

    const getTimeFromMouseX = useCallback(
        (clientX: number) => {
            if (!timelineRef.current) return 0
            const rect = timelineRef.current.getBoundingClientRect()
            const percentage = Math.max(
                0,
                Math.min(100, ((clientX - rect.left) / rect.width) * 100),
            )
            return (percentage / 100) * duration
        },
        [duration],
    )

    const handleMouseDown = useCallback(
        (e: React.MouseEvent, type: 'start' | 'end' | 'range') => {
            e.preventDefault()
            setIsDragging(type)
            setDragStart({
                x: e.clientX,
                initialStart: startTime,
                initialEnd: endTime,
            })
        },
        [startTime, endTime],
    )

    const handleMouseMove = useCallback(
        (e: MouseEvent) => {
            if (!isDragging || !timelineRef.current) return

            const newTime = getTimeFromMouseX(e.clientX)
            const timeDiff = newTime - getTimeFromMouseX(dragStart.x)

            if (isDragging === 'start') {
                const newStartTime = Math.max(0, Math.min(endTime, newTime))
                onTimeChange(newStartTime, endTime)
            } else if (isDragging === 'end') {
                const newEndTime = Math.min(
                    duration,
                    Math.max(startTime, newTime),
                )
                onTimeChange(startTime, newEndTime)
            } else if (isDragging === 'range') {
                const rangeDuration =
                    dragStart.initialEnd - dragStart.initialStart
                let newStart = dragStart.initialStart + timeDiff
                let newEnd = dragStart.initialEnd + timeDiff

                if (newStart < 0) {
                    newStart = 0
                    newEnd = rangeDuration
                } else if (newEnd > duration) {
                    newEnd = duration
                    newStart = duration - rangeDuration
                }

                onTimeChange(newStart, newEnd)
            }
        },
        [
            isDragging,
            dragStart,
            startTime,
            endTime,
            duration,
            onTimeChange,
            getTimeFromMouseX,
        ],
    )

    const handleMouseUp = useCallback(() => {
        setIsDragging(null)
    }, [])

    useEffect(() => {
        if (isDragging) {
            document.addEventListener('mousemove', handleMouseMove)
            document.addEventListener('mouseup', handleMouseUp)
            return () => {
                document.removeEventListener('mousemove', handleMouseMove)
                document.removeEventListener('mouseup', handleMouseUp)
            }
        }
    }, [isDragging, handleMouseMove, handleMouseUp])

    return (
        <div
            ref={timelineRef}
            className="h-16 bg-gray-200 rounded-lg relative overflow-hidden shadow-inner cursor-pointer select-none"
        >
            <div className="absolute inset-0" />

            <div
                className="absolute top-0 h-full bg-gradient-to-r from-blue-400 to-blue-600 opacity-80 cursor-move"
                style={{
                    left: `${startPercentage}%`,
                    width: `${endPercentage - startPercentage}%`,
                }}
                onMouseDown={(e) => handleMouseDown(e, 'range')}
            />

            <div
                className="absolute top-0 w-4 h-full bg-blue-800 cursor-ew-resize shadow-lg hover:bg-blue-900 transition-colors z-20"
                style={{ left: `calc(${startPercentage}% - 8px)` }}
                onMouseDown={(e) => handleMouseDown(e, 'start')}
            >
                <div className="absolute inset-y-0 left-1/2 w-0.5 bg-white transform -translate-x-1/2" />
            </div>

            <div
                className="absolute top-0 w-4 h-full bg-blue-800 cursor-ew-resize shadow-lg hover:bg-blue-900 transition-colors z-20"
                style={{ left: `calc(${endPercentage}% - 8px)` }}
                onMouseDown={(e) => handleMouseDown(e, 'end')}
            >
                <div className="absolute inset-y-0 left-1/2 w-0.5 bg-white transform -translate-x-1/2" />
            </div>

            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="bg-black bg-opacity-50 text-white px-3 py-1 rounded text-sm font-medium">
                    {formatTimeFlexible(endTime - startTime)}
                </div>
            </div>

            <div className="absolute bottom-0 left-0 right-0 h-6 flex items-center justify-between px-2 text-xs text-gray-600 pointer-events-none">
                <span>{formatTimeFlexible(startTime)}</span>
                <span>{formatTimeFlexible(endTime)}</span>
            </div>
        </div>
    )
}
