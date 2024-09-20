import { useState, useCallback, useMemo, useEffect } from 'react'
import { SavedSettings, VisualizerState } from './types'
import { STORAGE_KEY } from './constants'
import { formatTimeFlexible } from './utils'

const initialState: VisualizerState = {
    videoSrc: null,
    fileName: '',
    duration: 0,
    currentTime: 0,
    startTime: 0,
    endTime: 0,
    isPlaying: false,
    muteAudio: false,
    videoCodec: 'default',
    audioCodec: 'default',
    videoBitrate: '1M',
    audioBitrate: '128k',
    videoPreset: 'medium',
    videoProfile: 'main',
    videoLevel: '4.0',
    videoFps: '',
    pixelFormat: 'yuv420p',
    audioChannels: '2',
    audioSampleRate: '44100',
    restartAtTrimStart: true,
    outputFileName: 'output.mp4',
    ffmpegCommand: '',
}

export const useVisualizer = () => {
    const [state, setState] = useState<VisualizerState>(() => {
        if (typeof window !== 'undefined') {
            const savedSettings = localStorage.getItem(STORAGE_KEY)
            if (savedSettings) {
                const parsedSettings: SavedSettings = JSON.parse(savedSettings)
                return { ...initialState, ...parsedSettings }
            }
        }
        return initialState
    })

    useEffect(() => {
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
    }, [state])

    const clearSettings = useCallback(() => {
        if (typeof window !== 'undefined') {
            localStorage.removeItem(STORAGE_KEY)
        }
        setState((prevState) => ({
            ...initialState,
            videoSrc: prevState.videoSrc,
            fileName: prevState.fileName,
            duration: prevState.duration,
            currentTime: prevState.currentTime,
            startTime: prevState.startTime,
            endTime: prevState.endTime,
            isPlaying: prevState.isPlaying,
        }))
    }, [])

    const updateState = useCallback((newState: Partial<VisualizerState>) => {
        setState((prevState) => ({ ...prevState, ...newState }))
        setManualFFmpegCommand(null)
    }, [])

    const isTranscodingNeeded = useCallback((codec: string) => {
        return codec !== 'copy' && codec !== 'default'
    }, [])

    const getCodecCommand = useCallback((prefix: string, codec: string) => {
        return codec !== 'default' ? `${prefix} ${codec}` : ''
    }, [])

    const [manualFFmpegCommand, setManualFFmpegCommand] = useState<
        string | null
    >(null)

    const generateFFmpegCommand = useCallback(() => {
        if (!state.videoSrc) return ''

        const parts = ['ffmpeg']

        // Input file
        parts.push(`-i "${state.fileName}"`)

        // Trimming
        if (state.startTime > 0)
            parts.push(`-ss ${formatTimeFlexible(state.startTime)}`)
        if (state.endTime < state.duration)
            parts.push(`-to ${formatTimeFlexible(state.endTime)}`)

        // Audio settings
        if (state.muteAudio) {
            parts.push('-an')
        } else {
            const audioCodecCommand = getCodecCommand('-c:a', state.audioCodec)
            if (audioCodecCommand) parts.push(audioCodecCommand)

            if (isTranscodingNeeded(state.audioCodec)) {
                parts.push(
                    `-b:a ${state.audioBitrate}`,
                    `-ac ${state.audioChannels}`,
                    `-ar ${state.audioSampleRate}`,
                )
            }
        }

        // Video settings
        const videoCodecCommand = getCodecCommand('-c:v', state.videoCodec)
        if (videoCodecCommand) parts.push(videoCodecCommand)

        if (isTranscodingNeeded(state.videoCodec)) {
            parts.push(
                `-b:v ${state.videoBitrate}`,
                `-preset ${state.videoPreset}`,
                `-profile:v ${state.videoProfile}`,
                `-level ${state.videoLevel}`,
                `-pix_fmt ${state.pixelFormat}`,
            )
            if (state.videoFps) parts.push(`-r ${state.videoFps}`)
        }

        // Output file
        parts.push(`"${state.outputFileName}"`)

        return parts.join(' ')
    }, [state, isTranscodingNeeded, getCodecCommand])

    const ffmpegCommand = useMemo(() => {
        if (manualFFmpegCommand !== null) {
            return manualFFmpegCommand
        }
        return generateFFmpegCommand()
    }, [manualFFmpegCommand, generateFFmpegCommand])

    const updateFFmpegCommand = useCallback((newCommand: string) => {
        setManualFFmpegCommand(newCommand)
    }, [])

    return {
        state,
        updateState,
        ffmpegCommand,
        clearSettings,
        updateFFmpegCommand,
    }
}
