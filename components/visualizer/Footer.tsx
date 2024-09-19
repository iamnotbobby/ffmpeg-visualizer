export function Footer() {
  return (
    <footer className="mt-8 text-center text-gray-600">
      <div className="flex justify-center space-x-4">
        <a
          href="https://www.ffmpeg.org/ffmpeg.html"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-blue-600"
        >
          FFmpeg documentation
        </a>
        <a
          href="https://github.com/returnkirbo/ffmpeg-visualizer"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-blue-600"
        >
          source code
        </a>
      </div>
    </footer>
  );
}
