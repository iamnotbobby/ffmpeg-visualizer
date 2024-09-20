import { Input } from '@/components/ui/input'

interface FileInputProps {
    onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void
}

export function FileInput({ onFileChange }: FileInputProps) {
    return (
        <Input
            type="file"
            accept="video/*"
            onChange={onFileChange}
            className="mb-4"
        />
    )
}
