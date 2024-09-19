import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Copy } from "lucide-react";

interface FFmpegCommandProps {
  ffmpegCommand: string;
  onFFmpegCommandChange: (value: string) => void;
  onCopyCommand: () => void;
}

export function FFmpegCommand({
  ffmpegCommand,
  onFFmpegCommandChange,
  onCopyCommand,
}: FFmpegCommandProps) {
  return (
    <div className="bg-gray-100 p-4 rounded-lg shadow-md mt-6">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-semibold">FFmpeg Command:</h2>
        <Button
          onClick={onCopyCommand}
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
        >
          <Copy className="h-4 w-4" />
          Copy
        </Button>
      </div>
      <Textarea
        value={ffmpegCommand}
        onChange={(e) => onFFmpegCommandChange(e.target.value)}
        className="w-full h-24 text-sm font-mono"
      />
    </div>
  );
}
