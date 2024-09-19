"use client";

import { useRef, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useVideoTrimmer } from "@/lib/config";
import { FileInput } from "./FileInput";
import { VideoPlayer } from "./VideoPlayer";
import { TrimmerControls } from "./controls/TrimmerControls";
import { NavigationControls } from "./controls/NavigationControls";
import { GeneralSettings } from "./settings/GeneralSettings";
import { VideoSettings } from "./settings/VideoSettings";
import { AudioSettings } from "./settings/AudioSettings";
import { FFmpegCommand } from "./FFmpegCommand";
import { Footer } from "./Footer";

export default function Visualizer() {
  const { state, updateState, formatTime } = useVideoTrimmer();
  const videoRef = useRef<HTMLVideoElement>(null);
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      updateState({ videoSrc: url, fileName: file.name });
    }
  };

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.onloadedmetadata = () => {
        if (videoRef.current) {
          const videoDuration = videoRef.current.duration;
          updateState({ duration: videoDuration, endTime: videoDuration });
        }
      };
    }
  }, [state.videoSrc, updateState]);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      const updateTime = () => {
        updateState({ currentTime: video.currentTime });
        if (video.currentTime >= state.endTime && state.restartAtTrimStart) {
          video.currentTime = state.startTime;
        }
      };
      video.addEventListener("timeupdate", updateTime);
      return () => video.removeEventListener("timeupdate", updateTime);
    }
  }, [state.startTime, state.endTime, state.restartAtTrimStart, updateState]);

  const jumpToStart = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = state.startTime;
      updateState({ currentTime: state.startTime });
    }
  };

  const setStartTrimmer = () => {
    updateState({ startTime: state.currentTime });
  };

  const setEndTrimmer = () => {
    updateState({ endTime: state.currentTime });
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      <h1 className="text-3xl font-bold text-center mb-6">FFmpeg Visualizer</h1>

      <FileInput onFileChange={handleFileChange} />

      {state.videoSrc && (
        <>
          <VideoPlayer videoSrc={state.videoSrc} videoRef={videoRef} />

          <TrimmerControls
            startTime={state.startTime}
            endTime={state.endTime}
            duration={state.duration}
            onStartTimeChange={(value) => updateState({ startTime: value })}
            onEndTimeChange={(value) => updateState({ endTime: value })}
            onSetStartTrimmer={setStartTrimmer}
            onSetEndTrimmer={setEndTrimmer}
            formatTime={formatTime}
          />

          <NavigationControls
            currentTime={state.currentTime}
            duration={state.duration}
            startTime={state.startTime}
            endTime={state.endTime}
            onCurrentTimeChange={(time) => {
              updateState({ currentTime: time });
              if (videoRef.current) {
                videoRef.current.currentTime = time;
              }
            }}
            onJumpToStart={jumpToStart}
            formatTime={formatTime}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <GeneralSettings
              muteAudio={state.muteAudio}
              restartAtTrimStart={state.restartAtTrimStart}
              onMuteAudioChange={(checked) =>
                updateState({ muteAudio: checked })
              }
              onRestartAtTrimStartChange={(checked) =>
                updateState({ restartAtTrimStart: checked })
              }
            />

            <div className="space-y-4 bg-gray-100 p-4 rounded-lg shadow">
              <h3 className="font-semibold mb-2">Info</h3>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <p>
                  From here, you can input a video and easily select FFmpeg
                  options. This is only intended for helping with command
                  options.
                </p>
              </div>
            </div>

            <VideoSettings
              videoCodec={state.videoCodec}
              videoBitrate={state.videoBitrate}
              videoPreset={state.videoPreset}
              videoProfile={state.videoProfile}
              videoLevel={state.videoLevel}
              pixelFormat={state.pixelFormat}
              onVideoCodecChange={(value) => updateState({ videoCodec: value })}
              onVideoBitrateChange={(value) =>
                updateState({ videoBitrate: value })
              }
              onVideoPresetChange={(value) =>
                updateState({ videoPreset: value })
              }
              onVideoProfileChange={(value) =>
                updateState({ videoProfile: value })
              }
              onVideoLevelChange={(value) => updateState({ videoLevel: value })}
              onPixelFormatChange={(value) =>
                updateState({ pixelFormat: value })
              }
            />

            <AudioSettings
              audioCodec={state.audioCodec}
              audioBitrate={state.audioBitrate}
              audioChannels={state.audioChannels}
              audioSampleRate={state.audioSampleRate}
              muteAudio={state.muteAudio}
              onAudioCodecChange={(value) => updateState({ audioCodec: value })}
              onAudioBitrateChange={(value) =>
                updateState({ audioBitrate: value })
              }
              onAudioChannelsChange={(value) =>
                updateState({ audioChannels: value })
              }
              onAudioSampleRateChange={(value) =>
                updateState({ audioSampleRate: value })
              }
            />
          </div>

          <FFmpegCommand
            ffmpegCommand={state.ffmpegCommand}
            onFFmpegCommandChange={(value) =>
              updateState({ ffmpegCommand: value })
            }
            onCopyCommand={() => {
              navigator.clipboard
                .writeText(state.ffmpegCommand)
                .then(() =>
                  toast({
                    title: "Copied!",
                    description: "FFmpeg command copied to clipboard",
                  }),
                )
                .catch(() =>
                  toast({
                    title: "Failed to copy",
                    description: "Please try again",
                    variant: "destructive",
                  }),
                );
            }}
          />
        </>
      )}

      <Footer />
    </div>
  );
}
