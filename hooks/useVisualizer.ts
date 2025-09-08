'use client'

import { useState, useCallback, useEffect } from 'react'
import { VisualizerState, SavedSettings } from '@/lib/types'
import { STORAGE_KEY } from '@/lib/constants'

const initialState: VisualizerState = {
    videoSrc: null,
    videoFile: null,
    fileName: '',
    duration: 0,
    currentTime: 0,
    startTime: 0,
    endTime: 0,
    isPlaying: false,
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
    ffmpegCommand: '',
}

export function useVisualizer() {
    const [state, setState] = useState<VisualizerState>(initialState)

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const savedSettings = localStorage.getItem(STORAGE_KEY)
            if (savedSettings) {
                try {
                    const settings: SavedSettings = JSON.parse(savedSettings)
                    setState((prev) => ({ ...prev, ...settings }))
                } catch (error) {
                    console.error('Failed to load saved settings:', error)
                }
            }
        }
    }, [])

    const saveSettings = useCallback(() => {
        if (typeof window !== 'undefined') {
            const settingsToSave: SavedSettings = {
                muteAudio: state.muteAudio,
                videoCodec: state.videoCodec,
                audioCodec: state.audioCodec,
                videoBitrate: state.videoBitrate,
                audioBitrate: state.audioBitrate,
                videoPreset: state.videoPreset,
                videoProfile: state.videoProfile,
                videoLevel: state.videoLevel,
                videoFps: state.videoFps,
                pixelFormat: state.pixelFormat,
                audioChannels: state.audioChannels,
                audioSampleRate: state.audioSampleRate,
                restartAtTrimStart: state.restartAtTrimStart,
                outputFileName: state.outputFileName,
            }
            localStorage.setItem(STORAGE_KEY, JSON.stringify(settingsToSave))
        }
    }, [
        state.muteAudio,
        state.videoCodec,
        state.audioCodec,
        state.videoBitrate,
        state.audioBitrate,
        state.videoPreset,
        state.videoProfile,
        state.videoLevel,
        state.videoFps,
        state.pixelFormat,
        state.audioChannels,
        state.audioSampleRate,
        state.restartAtTrimStart,
        state.outputFileName,
    ])

    const generateFFmpegCommand = useCallback(
        (currentState: VisualizerState): string => {
            if (!currentState.fileName) return ''

            const parts: string[] = [
                'ffmpeg',
                '-i',
                `"${currentState.fileName}"`,
            ]

            if (currentState.startTime > 0) {
                parts.push('-ss', formatTime(currentState.startTime))
            }

            if (
                currentState.endTime > currentState.startTime &&
                currentState.endTime < currentState.duration
            ) {
                const duration = currentState.endTime - currentState.startTime
                parts.push('-t', formatTime(duration))
            } else if (
                currentState.startTime > 0 &&
                currentState.endTime >= currentState.duration
            ) {
                const duration = currentState.duration - currentState.startTime
                parts.push('-t', formatTime(duration))
            }

            if (currentState.videoCodec !== 'copy') {
                parts.push('-c:v', currentState.videoCodec)
            }

            if (currentState.muteAudio) {
                parts.push('-an')
            } else if (currentState.audioCodec !== 'copy') {
                parts.push('-c:a', currentState.audioCodec)
            }

            if (currentState.videoBitrate) {
                parts.push('-b:v', currentState.videoBitrate)
            }

            if (currentState.audioBitrate && !currentState.muteAudio) {
                parts.push('-b:a', currentState.audioBitrate)
            }

            if (
                currentState.videoCodec.includes('x264') ||
                currentState.videoCodec.includes('x265')
            ) {
                parts.push('-preset', currentState.videoPreset)

                if (currentState.videoCodec === 'libx264') {
                    parts.push('-profile:v', currentState.videoProfile)
                    parts.push('-level', currentState.videoLevel)
                }
            }

            if (currentState.videoFps) {
                parts.push('-r', currentState.videoFps)
            }

            if (currentState.pixelFormat !== 'yuv420p') {
                parts.push('-pix_fmt', currentState.pixelFormat)
            }

            if (currentState.audioChannels !== '2' && !currentState.muteAudio) {
                parts.push('-ac', currentState.audioChannels)
            }

            if (
                currentState.audioSampleRate !== '48000' &&
                !currentState.muteAudio
            ) {
                parts.push('-ar', currentState.audioSampleRate)
            }

            const outputFile =
                currentState.outputFileName ||
                generateOutputFileName(currentState.fileName)
            parts.push(`"${outputFile}"`)

            return parts.join(' ')
        },
        [],
    )

    useEffect(() => {
        const command = generateFFmpegCommand(state)
        setState((prev) => ({ ...prev, ffmpegCommand: command }))
    }, [
        state.fileName,
        state.startTime,
        state.endTime,
        state.muteAudio,
        state.videoCodec,
        state.audioCodec,
        state.videoBitrate,
        state.audioBitrate,
        state.videoPreset,
        state.videoProfile,
        state.videoLevel,
        state.videoFps,
        state.pixelFormat,
        state.audioChannels,
        state.audioSampleRate,
        state.outputFileName,
    ])

    useEffect(() => {
        saveSettings()
    }, [saveSettings])

    const handleVideoUpload = useCallback((file: File) => {
        const url = URL.createObjectURL(file)
        const outputFileName = generateOutputFileName(file.name)

        setState((prev) => ({
            ...prev,
            videoSrc: url,
            videoFile: file,
            fileName: file.name,
            outputFileName,
        }))
    }, [])

    const handleVideoLoad = useCallback((duration: number) => {
        setState((prev) => ({
            ...prev,
            duration,
            endTime: duration,
        }))
    }, [])

    const updateState = useCallback((updates: Partial<VisualizerState>) => {
        setState((prev) => {
            const newState = { ...prev, ...updates }

            if (
                'startTime' in updates ||
                'endTime' in updates ||
                'duration' in updates
            ) {
                const duration = newState.duration
                let startTime = newState.startTime
                let endTime = newState.endTime

                if (!isFinite(startTime) || isNaN(startTime) || startTime < 0) {
                    startTime = 0
                }
                if (!isFinite(endTime) || isNaN(endTime) || endTime < 0) {
                    endTime = duration || 0
                }
                if (!isFinite(duration) || isNaN(duration) || duration < 0) {
                    console.warn('Invalid duration provided:', duration)
                } else {
                    startTime = Math.max(0, Math.min(startTime, duration))
                    endTime = Math.max(startTime, Math.min(endTime, duration))

                    newState.startTime = startTime
                    newState.endTime = endTime
                }
            }

            return newState
        })
    }, [])

    const resetVideo = useCallback(() => {
        if (state.videoSrc) {
            URL.revokeObjectURL(state.videoSrc)
        }
        setState((prev) => ({
            ...initialState,
            muteAudio: prev.muteAudio,
            videoCodec: prev.videoCodec,
            audioCodec: prev.audioCodec,
            videoBitrate: prev.videoBitrate,
            audioBitrate: prev.audioBitrate,
            videoPreset: prev.videoPreset,
            videoProfile: prev.videoProfile,
            videoLevel: prev.videoLevel,
            videoFps: prev.videoFps,
            pixelFormat: prev.pixelFormat,
            audioChannels: prev.audioChannels,
            audioSampleRate: prev.audioSampleRate,
            restartAtTrimStart: prev.restartAtTrimStart,
            outputFileName: prev.outputFileName,
        }))
    }, [state.videoSrc])

    return {
        ...state,
        handleVideoUpload,
        handleVideoLoad,
        updateState,
        resetVideo,
    }
}

function formatTime(seconds: number): string {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = Math.floor(seconds % 60)
    const ms = Math.floor((seconds % 1) * 1000)

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${ms.toString().padStart(3, '0')}`
}

function generateOutputFileName(inputFileName: string): string {
    const nameWithoutExt = inputFileName.replace(/\.[^/.]+$/, '')
    return `${nameWithoutExt}_processed.mp4`
}
