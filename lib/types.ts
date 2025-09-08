export interface VisualizerState {
    videoSrc: string | null
    videoFile: File | null
    fileName: string
    duration: number
    currentTime: number
    startTime: number
    endTime: number
    isPlaying: boolean
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
    restartAtTrimStart: boolean
    outputFileName: string
    ffmpegCommand: string
}

export interface SavedSettings {
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
    restartAtTrimStart: boolean
    outputFileName: string
}
