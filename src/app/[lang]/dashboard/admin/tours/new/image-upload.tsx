
'use client';

import { UploadCloud, X } from 'lucide-react';
import Image from 'next/image';
import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ImageUploadProps {
  onChange: (file: any) => void;
  onRemove: (file: any) => void;
  value: File[];
  multiple?: boolean;
}

export function ImageUpload({
  onChange,
  onRemove,
  value,
  multiple = false,
}: ImageUploadProps) {
  const [previews, setPreviews] = useState<string[]>([]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newPreviews: string[] = [];
    acceptedFiles.forEach(file => {
      newPreviews.push(URL.createObjectURL(file));
    });

    if (multiple) {
        setPreviews(prev => [...prev, ...newPreviews]);
        onChange([...value, ...acceptedFiles]);
    } else {
        setPreviews(newPreviews);
        onChange(acceptedFiles[0]);
    }
  }, [onChange, multiple, value]);

  const handleRemove = (file: File | string, e: React.MouseEvent) => {
    e.stopPropagation();
    const fileToRemove = typeof file === 'string' ? value.find(f => URL.createObjectURL(f) === file) : file;
    if (fileToRemove) {
      setPreviews(previews.filter(p => p !== (typeof file === 'string' ? file : URL.createObjectURL(file))));
      onRemove(fileToRemove);
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

  return (
    <div>
      <div
        {...getRootProps()}
        className={cn(
          'relative flex cursor-pointer flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed border-muted-foreground/30 bg-secondary/50 p-8 text-center text-muted-foreground transition-colors hover:border-primary/50 hover:bg-secondary',
          isDragActive && 'border-primary bg-primary/10'
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
          {multiple ? 'Puedes subir varias imágenes' : 'Sube una imagen'} (Max 5MB por archivo)
        </p>
      </div>

      {value && value.length > 0 && (
        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {value.map((file, i) => (
            <div key={i} className="relative aspect-square overflow-hidden rounded-md">
              <Image
                src={URL.createObjectURL(file)}
                alt={`Preview ${i}`}
                fill
                className="object-cover"
                onLoad={() => URL.revokeObjectURL(URL.createObjectURL(file))}
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
          ))}
        </div>
      )}
    </div>
  );
}


    