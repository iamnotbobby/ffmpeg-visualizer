<p align="center">
  <img src="https://github.com/user-attachments/assets/9b83df87-c895-4c05-bd4f-3c15fc81925e" alt="Visual"/>
</p>

# FFmpeg Visualizer

FFmpeg Visualizer is a Next.js 14 tool that lets users upload local videos and quickly add basic FFmpeg options with dropdowns and a timeline editor. This project is just meant to generate an FFmpeg command for use on a local machine; it does not use `ffmpeg.wasm`

Why? Because I would frequently forget the commands for FFmpeg, and therefore, this project was born.

## Current Options

Video Settings: Trimming (HH:MM:SS.ss), Codec, Bitrate, Preset, Profile, Level, Pixel Format

Audio Settings: Mute, Codec, Bitrate, Channels, Sample Rate

In addition, there are other features like configuration saving, visualization for trimming, and more.

## Modifying the Configuration

To modify the configuration of the FFmpeg Visualizer, you will primarily work with the following files:

1. **Settings Options**: Located in `lib/constants.ts`, this file contains the available options for audio and video settings.

2. **State Management**: The state management for the application is handled in `lib/useVisualizer.ts`. This file manages the application's state, including the current settings.

### Adding New Options

To add new options/settings, follow these steps:

1. **Define New Options (`lib/constants.ts`)**:
    - Add your new options to the existing arrays. For example, if you want to add a new audio codec, you can modify the `OPTIONS.AUDIO_CODEC` array:

```typescript
export const OPTIONS = {
    AUDIO_CODEC: [
        { value: 'aac', label: 'AAC' },
        { value: 'mp3', label: 'MP3' },
        { value: 'wav', label: 'WAV' },
        { value: 'new_codec', label: 'New Codec' }, // Add your new codec here
    ],
}
```

2. **Update State Management (`lib/useVisualizer.ts`)**:
    - Ensure that the new options are accounted for in the state management logic. For example, if you added a new audio codec, you might want to add logic to handle its selection and any related settings. The same goes for adding any new option.

## Notes/License

Feel free to open a PR/an issue for a feature/additional options.

MIT License: https://raw.githubusercontent.com/returnkirbo/ffmpeg-visualizer/master/LICENSE
