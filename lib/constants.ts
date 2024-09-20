export const OPTIONS = {
    VIDEO_CODEC: [
        { value: 'default', label: 'Re-encode (default)' },
        { value: 'copy', label: 'No re-encode (copy)' },
        { value: 'libx264', label: 'H.264 (libx264)' },
        { value: 'libx265', label: 'H.265 (libx265)' },
        { value: 'libvpx-vp9', label: 'VP9 (libvpx-vp9)' },
        { value: 'libaom-av1', label: 'AV1 (libaom-av1)' },
    ],
    AUDIO_CODEC: [
        { value: 'default', label: 'Re-encode (default)' },
        { value: 'copy', label: 'No re-encode (copy)' },
        { value: 'aac', label: 'AAC' },
        { value: 'libmp3lame', label: 'MP3 (libmp3lame)' },
        { value: 'libopus', label: 'Opus (libopus)' },
        { value: 'libvorbis', label: 'Vorbis (libvorbis)' },
    ],
    VIDEO_PRESET: [
        { value: 'ultrafast', label: 'Ultrafast' },
        { value: 'superfast', label: 'Superfast' },
        { value: 'veryfast', label: 'Veryfast' },
        { value: 'faster', label: 'Faster' },
        { value: 'fast', label: 'Fast' },
        { value: 'medium', label: 'Medium' },
        { value: 'slow', label: 'Slow' },
        { value: 'slower', label: 'Slower' },
        { value: 'veryslow', label: 'Veryslow' },
    ],
    VIDEO_PROFILE: [
        { value: 'baseline', label: 'Baseline' },
        { value: 'main', label: 'Main' },
        { value: 'high', label: 'High' },
    ],
    VIDEO_LEVEL: [
        { value: '3.0', label: '3.0' },
        { value: '3.1', label: '3.1' },
        { value: '4.0', label: '4.0' },
        { value: '4.1', label: '4.1' },
        { value: '4.2', label: '4.2' },
        { value: '5.0', label: '5.0' },
        { value: '5.1', label: '5.1' },
    ],
    PIXEL_FORMAT: [
        { value: 'yuv420p', label: 'YUV 4:2:0 Planar' },
        { value: 'yuv422p', label: 'YUV 4:2:2 Planar' },
        { value: 'yuv444p', label: 'YUV 4:4:4 Planar' },
        { value: 'rgb24', label: 'RGB 24-bit' },
    ],
    AUDIO_CHANNELS: [
        { value: '1', label: 'Mono (1)' },
        { value: '2', label: 'Stereo (2)' },
        { value: '6', label: '5.1 Surround (6)' },
    ],
    AUDIO_SAMPLE_RATE: [
        { value: '22050', label: '22050 Hz' },
        { value: '44100', label: '44100 Hz' },
        { value: '48000', label: '48000 Hz' },
        { value: '96000', label: '96000 Hz' },
    ],
} as const

export const STORAGE_KEY = 'ffmpegVisualizerSettings'
