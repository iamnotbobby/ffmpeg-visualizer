<p align="center">
  <img src="https://github.com/user-attachments/assets/9b83df87-c895-4c05-bd4f-3c15fc81925e" alt="Visual"/>
</p>

# FFmpeg Visualizer

FFmpeg Visualizer is a Next.js 14 tool that lets users upload local videos and quickly add basic FFmpeg options with dropdowns and a timeline editor. This project is just meant to generate an FFmpeg command for use on a local machine; it does not use `ffmpeg.wasm`

Why? Because I would frequently forget the commands for FFmpeg, and therefore, this project was born.

## Current Options

Video Settings

    Video Codec
    Video Bitrate
    Video Preset
    Video Profile
    Video Level
    Video Pixel Format

Audio Settings

    Audio Codec
    Audio Bitrate
    Audio Channels
    Audio Sample Rate

## Config

If you wish to modify what type of options are included (for example, adding a codec to Video Codec option) you must modify `lib/config.ts`! For example:

```typescript
export const videoCodecOptions = [
  { value: "copy", label: "Copy (No re-encode)" },
  { value: "libx264", label: "H.264 (libx264)" },
  { value: "libx265", label: "H.265 (libx265)" },
  { value: "libvpx-vp9", label: "VP9 (libvpx-vp9)" },
  { value: "libaom-av1", label: "AV1 (libaom-av1)" },
  { value: "prores", label: "ProRes (prores)" }, // New codec added here
];
```

Additional settings like defaults, options order, etc. are also found in `lib/config.ts`.

## Notes/License

Feel free to open a PR/an issue for a feature/additional options.

MIT License: https://raw.githubusercontent.com/returnkirbo/ffmpeg-visualizer/master/LICENSE
