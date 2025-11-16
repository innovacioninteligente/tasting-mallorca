
'use client';

import { UploadCloud, X } from 'lucide-react';
import Image from 'next/image';
import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ImageUploadProps {
  onChange: (files: any) => void;
  onRemove: (file: any) => void;
  value: (File | string)[];
  multiple?: boolean;
  onServerImageDelete?: (imageUrl: string) => void; 
}

export function ImageUpload({
  onChange,
  onRemove,
  value,
  multiple = false,
  onServerImageDelete
}: ImageUploadProps) {

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = multiple ? [...value, ...acceptedFiles] : acceptedFiles;
    if (multiple) {
        onChange(newFiles);
    } else {
        onChange(acceptedFiles[0]);
    }
  }, [onChange, multiple, value]);

  const handleRemove = (file: File | string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (typeof file === 'string' && onServerImageDelete) {
        onServerImageDelete(file);
    } else {
        onRemove(file);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/png': ['.png'],
      'image/jpeg': ['.jpeg', '.jpg'],
      'image/webp': ['.webp'],
    },
    multiple,
  });

  const getPreviewUrl = (file: File | string) => {
    if (!file) return '';
    if (typeof file === 'string') {
      return file;
    }
    return URL.createObjectURL(file);
  }

  const filesToDisplay = Array.isArray(value) ? value : (value ? [value] : []);


  return (
    <div>
      <div
        {...getRootProps()}
        className={cn(
          'relative flex cursor-pointer flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed border-muted-foreground/30 bg-secondary/50 p-8 text-center text-muted-foreground transition-colors hover:border-primary/50 hover:bg-secondary',
          isDragActive && 'border-primary bg-primary/10',
          (filesToDisplay.length > 0 && !multiple) && 'hidden'
        )}
      >
        <input {...getInputProps()} />
        <UploadCloud className="h-12 w-12" />
        <p className="font-semibold">
          {isDragActive
            ? 'Suelta las imágenes aquí'
            : 'Arrastra y suelta imágenes, o haz clic para seleccionar'}
        </p>
        <p className="text-xs">
          {multiple ? 'Puedes subir varias imágenes' : 'Sube una imagen'} (Max 100MB por archivo)
        </p>
      </div>

      {filesToDisplay && filesToDisplay.length > 0 && (
        <div className={cn(
            "mt-4 grid gap-4",
            multiple ? "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5" : "max-w-xs"
        )}>
          {filesToDisplay.map((file, i) => {
            if (!file) return null;
            const previewUrl = getPreviewUrl(file);
            return (
              <div key={i} className="relative aspect-square overflow-hidden rounded-md">
                <Image
                  src={previewUrl}
                  alt={`Preview ${i}`}
                  fill
                  className="object-cover"
                  onLoad={() => {
                      if (file instanceof File) {
                          URL.revokeObjectURL(previewUrl);
                      }
                  }}
                />
                <div className="absolute right-1 top-1">
                  <Button
                    onClick={(e) => handleRemove(file, e)}
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="h-7 w-7"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  );
}
