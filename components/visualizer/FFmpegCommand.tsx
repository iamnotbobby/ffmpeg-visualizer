import React from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Copy, RefreshCw } from 'lucide-react'

interface FFmpegCommandProps {
    ffmpegCommand: string
    onFFmpegCommandChange: (value: string) => void
    onCopyCommand: () => void
    onResetCommand: () => void
    isManuallyEdited: boolean
}

export function FFmpegCommand({
    ffmpegCommand,
    onFFmpegCommandChange,
    onCopyCommand,
    onResetCommand,
    isManuallyEdited,
}: FFmpegCommandProps) {
    return (
        <Card className="mt-6">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-2xl font-bold">
                    FFmpeg Command
                </CardTitle>
                <div className="flex space-x-2">
                    <Button
                        onClick={onCopyCommand}
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-2"
                    >
                        <Copy className="h-4 w-4" />
                        Copy
                    </Button>
                    <Button
                        onClick={onResetCommand}
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-2"
                        disabled={!isManuallyEdited}
                    >
                        <RefreshCw className="h-4 w-4" />
                        Reset
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                {isManuallyEdited && (
                    <Alert variant="destructive" className="mb-4">
                        <AlertDescription>
                            This command has been manually edited. Changes to
                            options will not be reflected unless reset.
                        </AlertDescription>
                    </Alert>
                )}
                <Textarea
                    value={ffmpegCommand}
                    onChange={(e) => onFFmpegCommandChange(e.target.value)}
                    className="font-mono text-sm h-32 resize-none"
                    spellCheck="false"
                />
            </CardContent>
        </Card>
    )
}
