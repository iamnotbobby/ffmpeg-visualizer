interface VideoPlayerProps {
  videoSrc: string;
  videoRef: React.RefObject<HTMLVideoElement>;
}

export function VideoPlayer({ videoSrc, videoRef }: VideoPlayerProps) {
  return (
    <div className="relative">
      <video
        ref={videoRef}
        src={videoSrc}
        className="w-full rounded-lg shadow-md"
        controls
      />
    </div>
  );
}
