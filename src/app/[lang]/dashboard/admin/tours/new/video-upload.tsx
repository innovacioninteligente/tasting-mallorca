'use client';

import { UploadCloud, X, Film } from 'lucide-react';
import { useCallback, useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface VideoUploadProps {
    onChange: (file: File | string | undefined) => void;
    value: File | string | undefined;
    onServerVideoDelete?: (videoUrl: string) => void;
}

export function VideoUpload({
    onChange,
    value,
    onServerVideoDelete
}: VideoUploadProps) {
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    useEffect(() => {
        if (typeof value === 'string') {
            setPreviewUrl(value);
        } else if (value instanceof File) {
            const url = URL.createObjectURL(value);
            setPreviewUrl(url);
            return () => URL.revokeObjectURL(url);
        } else {
            setPreviewUrl(null);
        }
    }, [value]);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            onChange(acceptedFiles[0]);
        }
    }, [onChange]);

    const handleRemove = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (typeof value === 'string' && onServerVideoDelete) {
            onServerVideoDelete(value);
        }
        onChange(undefined);
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'video/mp4': ['.mp4'],
            'video/webm': ['.webm'],
            'video/quicktime': ['.mov'],
        },
        maxFiles: 1,
        maxSize: 200 * 1024 * 1024, // 200MB
        multiple: false
    });

    return (
        <div>
            {!value ? (
                <div
                    {...getRootProps()}
                    className={cn(
                        'relative flex cursor-pointer flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed border-muted-foreground/30 bg-secondary/50 p-8 text-center text-muted-foreground transition-colors hover:border-primary/50 hover:bg-secondary',
                        isDragActive && 'border-primary bg-primary/10'
                    )}
                >
                    <input {...getInputProps()} />
                    <Film className="h-12 w-12" />
                    <p className="font-semibold">
                        {isDragActive
                            ? 'Drop the video here'
                            : 'Drag & drop a video, or click to select'}
                    </p>
                    <p className="text-xs">
                        MP4, WebM or MOV (Max 200MB)
                    </p>
                </div>
            ) : (
                <div className="relative aspect-video w-full max-w-md overflow-hidden rounded-md border bg-black">
                    {previewUrl && (
                        <video
                            src={previewUrl}
                            className="h-full w-full object-contain"
                            controls
                        />
                    )}
                    <div className="absolute right-2 top-2 z-10">
                        <Button
                            onClick={handleRemove}
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="h-8 w-8"
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                    {value instanceof File && (
                        <Alert className="absolute top-2 left-2 w-auto max-w-[70%] bg-black/70 border-none text-white p-2 z-10 pointer-events-none">
                            <AlertDescription className="text-xs truncate">
                                Pending upload: {value.name}
                            </AlertDescription>
                        </Alert>
                    )}
                </div>
            )}
        </div>
    );
}
