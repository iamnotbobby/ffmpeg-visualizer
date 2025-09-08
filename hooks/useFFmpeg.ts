import { useState, useRef, useCallback } from 'react'
import { FFmpeg } from '@ffmpeg/ffmpeg'
import { fetchFile } from '@ffmpeg/util'

export function useFFmpeg() {
    const ffmpegRef = useRef<FFmpeg | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [isReady, setIsReady] = useState(false)
    const [isTranscoding, setIsTranscoding] = useState(false)
    const [progress, setProgress] = useState<{
        ratio: number
        time: number
    } | null>(null)
    const [error, setError] = useState<string | null>(null)

    const load = useCallback(async () => {
        if (ffmpegRef.current && isReady) return

        try {
            setIsLoading(true)
            setError(null)

            const ffmpeg = new FFmpeg()
            ffmpegRef.current = ffmpeg

            ffmpeg.on('log', ({ message }) => {
                console.log('[FFmpeg]', message)
            })

            ffmpeg.on('progress', ({ progress, time }) => {
                setProgress({ ratio: progress, time })
            })

            await ffmpeg.load()

            setIsReady(true)
        } catch (err) {
            console.error('FFmpeg load error:', err)
            setError(
                err instanceof Error ? err.message : 'Failed to load FFmpeg',
            )
        } finally {
            setIsLoading(false)
        }
    }, [isReady])

    const transcode = useCallback(
        async (
            inputFile: File,
            outputName: string,
            options: string[],
        ): Promise<Uint8Array | null> => {
            if (!ffmpegRef.current || !isReady) {
                throw new Error('FFmpeg not loaded')
            }

            try {
                setIsTranscoding(true)
                setProgress(null)
                setError(null)

                const ffmpeg = ffmpegRef.current
                const inputName = 'input'

                try {
                    const existingFiles = await ffmpeg.listDir('/')
                    console.log('Existing files before cleanup:', existingFiles)

                    for (const existingFile of existingFiles) {
                        if (
                            existingFile.name === inputName ||
                            existingFile.name === outputName
                        ) {
                            try {
                                await ffmpeg.deleteFile(existingFile.name)
                                console.log(
                                    'Cleaned up existing file:',
                                    existingFile.name,
                                )
                            } catch (cleanupErr) {
                                console.warn(
                                    'Failed to cleanup existing file:',
                                    existingFile.name,
                                    cleanupErr,
                                )
                            }
                        }
                    }
                } catch (listErr) {
                    console.warn(
                        'Failed to list/cleanup existing files:',
                        listErr,
                    )
                }

                console.log('Writing input file...')
                await ffmpeg.writeFile(inputName, await fetchFile(inputFile))

                try {
                    const files = await ffmpeg.listDir('/')
                    const inputExists = files.some(
                        (file) => file.name === inputName,
                    )
                    if (!inputExists) {
                        throw new Error(
                            'Failed to write input file to FFmpeg filesystem',
                        )
                    }
                    console.log('Input file verified successfully')
                } catch (verifyErr) {
                    console.warn('Failed to verify input file:', verifyErr)
                }

                console.log('Executing FFmpeg command:', [
                    '-i',
                    inputName,
                    ...options,
                    outputName,
                ])
                try {
                    await ffmpeg.exec(['-i', inputName, ...options, outputName])
                    console.log('FFmpeg command completed successfully')
                } catch (execErr) {
                    console.error('FFmpeg execution failed:', execErr)
                    console.error('Command that failed:', [
                        '-i',
                        inputName,
                        ...options,
                        outputName,
                    ])

                    const errorMessage =
                        execErr instanceof Error
                            ? execErr.message
                            : String(execErr)
                    if (errorMessage.includes('index out of bounds')) {
                        throw new Error(
                            'FFmpeg processing failed: Audio/video codec compatibility issue. Try using "copy" for both audio and video codecs, or try a different audio codec like AAC instead of Opus.',
                        )
                    } else if (errorMessage.includes('Invalid argument')) {
                        throw new Error(
                            'FFmpeg processing failed: Invalid parameters provided. Please check your codec and format settings.',
                        )
                    } else if (errorMessage.includes('Permission denied')) {
                        throw new Error(
                            'FFmpeg processing failed: File access error. Please try uploading the video again.',
                        )
                    } else if (
                        errorMessage.includes('codec') ||
                        errorMessage.includes('encoder')
                    ) {
                        throw new Error(
                            'FFmpeg processing failed: Codec error. Try using different audio/video codec settings.',
                        )
                    } else {
                        throw new Error(
                            `FFmpeg processing failed: ${errorMessage}`,
                        )
                    }
                }

                console.log('Verifying output file exists...')
                let outputExists = false
                try {
                    const files = await ffmpeg.listDir('/')
                    outputExists = files.some(
                        (file) => file.name === outputName,
                    )
                    console.log(
                        'Files after processing:',
                        files.map((f) => f.name),
                    )
                    console.log('Output file exists:', outputExists)
                } catch (listErr) {
                    console.warn(
                        'Failed to verify output file existence:',
                        listErr,
                    )
                }

                if (!outputExists) {
                    throw new Error(
                        `Output file '${outputName}' was not created. FFmpeg command may have failed.`,
                    )
                }

                console.log('Reading output file...')
                const data = await ffmpeg.readFile(outputName)

                if (
                    !data ||
                    (data instanceof Uint8Array && data.length === 0)
                ) {
                    throw new Error(
                        `Output file '${outputName}' is empty or invalid.`,
                    )
                }

                console.log(
                    'Output file size:',
                    data instanceof Uint8Array ? data.length : 'unknown',
                )

                try {
                    await ffmpeg.deleteFile(inputName)
                    console.log('Cleaned up input file')
                } catch (cleanupErr) {
                    console.warn('Failed to cleanup input file:', cleanupErr)
                }

                try {
                    await ffmpeg.deleteFile(outputName)
                    console.log('Cleaned up output file')
                } catch (cleanupErr) {
                    console.warn('Failed to cleanup output file:', cleanupErr)
                }

                return data as Uint8Array
            } catch (err) {
                console.error('Transcoding error:', err)

                if (err instanceof Error) {
                    if (err.message.includes('index out of bounds')) {
                        setError(
                            'Failed to read processed video file. The output may be corrupted or empty.',
                        )
                    } else if (
                        err.message.includes('FS error') ||
                        err.message.includes('ENOENT')
                    ) {
                        setError(
                            'File system error. Please try processing again.',
                        )
                    } else if (err.message.includes('EEXIST')) {
                        setError('File conflict detected. Please try again.')
                    } else if (err.message.includes('was not created')) {
                        setError(
                            'Video processing failed. Please check your settings and try again.',
                        )
                    } else if (err.message.includes('is empty or invalid')) {
                        setError(
                            'Output video file is empty. Please check your trim settings and try again.',
                        )
                    } else {
                        setError(err.message)
                    }
                } else {
                    setError('Transcoding failed')
                }

                try {
                    const ffmpeg = ffmpegRef.current
                    if (ffmpeg) {
                        try {
                            await ffmpeg.deleteFile('input')
                        } catch {}
                        try {
                            await ffmpeg.deleteFile(outputName)
                        } catch {}
                    }
                } catch {}

                return null
            } finally {
                setIsTranscoding(false)
                setProgress(null)
            }
        },
        [isReady],
    )

    return {
        ffmpeg: ffmpegRef.current,
        isLoading,
        isReady,
        progress,
        error,
        load,
        transcode,
        isTranscoding,
    }
}
