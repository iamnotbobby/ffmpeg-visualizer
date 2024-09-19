export const videoCodecOptions = [
  { value: "copy", label: "Copy (No re-encode)" },
  { value: "libx264", label: "H.264 (libx264)" },
  { value: "libx265", label: "H.265 (libx265)" },
  { value: "libvpx-vp9", label: "VP9 (libvpx-vp9)" },
  { value: "libaom-av1", label: "AV1 (libaom-av1)" },
];

export const audioCodecOptions = [
  { value: "copy", label: "Copy (No re-encode)" },
  { value: "aac", label: "AAC" },
  { value: "libmp3lame", label: "MP3 (libmp3lame)" },
  { value: "libopus", label: "Opus (libopus)" },
  { value: "libvorbis", label: "Vorbis (libvorbis)" },
];

export const videoPresetOptions = [
  { value: "ultrafast", label: "Ultrafast" },
  { value: "superfast", label: "Superfast" },
  { value: "veryfast", label: "Veryfast" },
  { value: "faster", label: "Faster" },
  { value: "fast", label: "Fast" },
  { value: "medium", label: "Medium" },
  { value: "slow", label: "Slow" },
  { value: "slower", label: "Slower" },
  { value: "veryslow", label: "Veryslow" },
];

export const videoProfileOptions = [
  { value: "baseline", label: "Baseline" },
  { value: "main", label: "Main" },
  { value: "high", label: "High" },
];

export const videoLevelOptions = [
  { value: "3.0", label: "3.0" },
  { value: "3.1", label: "3.1" },
  { value: "4.0", label: "4.0" },
  { value: "4.1", label: "4.1" },
  { value: "4.2", label: "4.2" },
  { value: "5.0", label: "5.0" },
  { value: "5.1", label: "5.1" },
];

export const pixelFormatOptions = [
  { value: "yuv420p", label: "YUV 4:2:0 Planar" },
  { value: "yuv422p", label: "YUV 4:2:2 Planar" },
  { value: "yuv444p", label: "YUV 4:4:4 Planar" },
  { value: "rgb24", label: "RGB 24-bit" },
];

export const audioChannelsOptions = [
  { value: "1", label: "Mono (1)" },
  { value: "2", label: "Stereo (2)" },
  { value: "6", label: "5.1 Surround (6)" },
];

export const audioSampleRateOptions = [
  { value: "22050", label: "22050 Hz" },
  { value: "44100", label: "44100 Hz" },
  { value: "48000", label: "48000 Hz" },
  { value: "96000", label: "96000 Hz" },
];

import { useState, useEffect, useCallback } from "react";

export interface VideoTrimmerState {
  videoSrc: string | null;
  fileName: string;
  duration: number;
  currentTime: number;
  startTime: number;
  endTime: number;
  isPlaying: boolean;
  muteAudio: boolean;
  videoCodec: string;
  audioCodec: string;
  videoBitrate: string;
  audioBitrate: string;
  videoPreset: string;
  videoProfile: string;
  videoLevel: string;
  videoFps: string;
  pixelFormat: string;
  audioChannels: string;
  audioSampleRate: string;
  restartAtTrimStart: boolean;
  ffmpegCommand: string;
  outputFileName: string;
}

export const useVideoTrimmer = () => {
  const [state, setState] = useState<VideoTrimmerState>({
    videoSrc: null,
    fileName: "",
    duration: 0,
    currentTime: 0,
    startTime: 0,
    endTime: 0,
    isPlaying: false,
    muteAudio: false,
    videoCodec: "copy",
    audioCodec: "copy",
    videoBitrate: "1M",
    audioBitrate: "128k",
    videoPreset: "medium",
    videoProfile: "main",
    videoLevel: "4.0",
    videoFps: "",
    pixelFormat: "yuv420p",
    audioChannels: "2",
    audioSampleRate: "44100",
    restartAtTrimStart: true,
    ffmpegCommand: "",
    outputFileName: "output.mp4",
  });

  const updateState = useCallback((newState: Partial<VideoTrimmerState>) => {
    setState((prevState) => ({ ...prevState, ...newState }));
  }, []);

  const formatTime = useCallback((timeInSeconds: number): string => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  }, []);

  const generateFFmpegCommand = useCallback(() => {
    if (!state.videoSrc) return "";

    const parts = ["ffmpeg"];

    // Input file and trimming
    if (state.startTime > 0) {
      parts.push(`-ss ${formatTime(state.startTime)}`);
    }
    parts.push(`-i "${state.fileName}"`);
    if (state.endTime < state.duration) {
      parts.push(`-to ${formatTime(state.endTime)}`);
    }

    // Audio settings
    if (state.muteAudio) {
      parts.push("-an");
    } else {
      parts.push(`-c:a ${state.audioCodec}`);
      if (state.audioCodec !== "copy") {
        parts.push(
          `-b:a ${state.audioBitrate}`,
          `-ac ${state.audioChannels}`,
          `-ar ${state.audioSampleRate}`,
        );
      }
    }

    // Video settings
    parts.push(`-c:v ${state.videoCodec}`);
    if (state.videoCodec !== "copy") {
      parts.push(
        `-b:v ${state.videoBitrate}`,
        `-preset ${state.videoPreset}`,
        `-profile:v ${state.videoProfile}`,
        `-level ${state.videoLevel}`,
        `-pix_fmt ${state.pixelFormat}`,
      );
      if (state.videoFps) {
        parts.push(`-r ${state.videoFps}`);
      }
    }

    // Output file
    parts.push(`"${state.outputFileName}"`);

    return parts.join(" ");
  }, [
    state.videoSrc,
    state.fileName,
    state.startTime,
    state.endTime,
    state.duration,
    state.muteAudio,
    state.audioCodec,
    state.audioBitrate,
    state.audioChannels,
    state.audioSampleRate,
    state.videoCodec,
    state.videoBitrate,
    state.videoPreset,
    state.videoProfile,
    state.videoLevel,
    state.pixelFormat,
    state.videoFps,
    state.outputFileName,
    formatTime,
  ]);

  useEffect(() => {
    const newCommand = generateFFmpegCommand();
    if (newCommand !== state.ffmpegCommand) {
      updateState({ ffmpegCommand: newCommand });
    }
  }, [generateFFmpegCommand, state.ffmpegCommand, updateState]);

  return {
    state,
    updateState,
    formatTime,
  };
};
