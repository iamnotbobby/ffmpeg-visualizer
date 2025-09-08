'use client'

import { useState, useEffect } from 'react'
import { Copy, Check, Edit, RotateCcw, AlertTriangle } from 'lucide-react'

interface CommandOutputProps {
    command: string
    fileName: string
    outputFileName: string
    onCommandChange?: (command: string, isModified: boolean) => void
}

export function CommandOutput({
    command,
    fileName,
    outputFileName,
    onCommandChange,
}: CommandOutputProps) {
    const [copied, setCopied] = useState(false)
    const [isEditing, setIsEditing] = useState(false)
    const [editedCommand, setEditedCommand] = useState(command)
    const [isModified, setIsModified] = useState(false)
    const [originalCommand, setOriginalCommand] = useState(command)

    useEffect(() => {
        if (!isModified) {
            setOriginalCommand(command)
            setEditedCommand(command)
        }
    }, [command, isModified])

    useEffect(() => {
        if (onCommandChange) {
            onCommandChange(editedCommand, isModified)
        }
    }, [editedCommand, isModified, onCommandChange])

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(editedCommand)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        } catch (error) {
            console.error('Failed to copy to clipboard:', error)
        }
    }

    const handleEditToggle = () => {
        if (isEditing) {
            if (editedCommand !== originalCommand) {
                setIsModified(true)
            }
        }
        setIsEditing(!isEditing)
    }

    const handleReset = () => {
        setEditedCommand(originalCommand)
        setIsModified(false)
        setIsEditing(false)
    }

    const handleCommandChange = (newCommand: string) => {
        setEditedCommand(newCommand)
    }

    if (!command) return null

    return (
        <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-800">
                    FFmpeg Command
                </h2>
                <div className="flex items-center gap-2">
                    {isModified && (
                        <button
                            onClick={handleReset}
                            className="flex items-center gap-2 px-3 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors"
                        >
                            <RotateCcw className="h-4 w-4" />
                            Reset
                        </button>
                    )}
                    <button
                        onClick={handleEditToggle}
                        className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${
                            isEditing
                                ? 'bg-green-600 text-white hover:bg-green-700'
                                : 'bg-gray-600 text-white hover:bg-gray-700'
                        }`}
                    >
                        <Edit className="h-4 w-4" />
                        {isEditing ? 'Save' : 'Edit'}
                    </button>
                    <button
                        onClick={copyToClipboard}
                        className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                        {copied ? (
                            <>
                                <Check className="h-4 w-4" />
                                <span>Copied!</span>
                            </>
                        ) : (
                            <>
                                <Copy className="h-4 w-4" />
                                <span>Copy</span>
                            </>
                        )}
                    </button>
                </div>
            </div>

            {isModified && (
                <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                    <div className="flex items-start gap-2">
                        <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="text-amber-800 font-medium">
                                Command Modified
                            </p>
                            <p className="text-amber-700 text-sm mt-1">
                                You have manually edited the FFmpeg command.
                                Changes to settings will not update this command
                                automatically. Use the "Reset" button to return
                                to the auto-generated command.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            <div className="space-y-4">
                {isEditing ? (
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                            Edit FFmpeg Command:
                        </label>
                        <textarea
                            value={editedCommand}
                            onChange={(e) =>
                                handleCommandChange(e.target.value)
                            }
                            className="w-full h-32 p-3 bg-gray-900 text-gray-100 font-mono text-sm rounded-md border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-vertical"
                            placeholder="Enter FFmpeg command..."
                        />
                        <p className="text-xs text-gray-600">
                            Tip: Use proper FFmpeg syntax. The command will be
                            executed as-is when processing.
                        </p>
                    </div>
                ) : (
                    <div className="bg-gray-900 text-gray-100 p-4 rounded-md font-mono text-sm overflow-x-auto">
                        <pre className="whitespace-pre-wrap break-all">
                            {editedCommand}
                        </pre>
                    </div>
                )}
            </div>
        </div>
    )
}
