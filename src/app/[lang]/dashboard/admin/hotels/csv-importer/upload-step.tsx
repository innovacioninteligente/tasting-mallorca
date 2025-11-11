
'use client';

import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { parse } from 'papaparse';
import { CsvRow } from './csv-importer';

interface UploadStepProps {
    onFileProcessed: (file: File, headers: string[], data: CsvRow[]) => void;
}

export function UploadStep({ onFileProcessed }: UploadStepProps) {
    const { toast } = useToast();

    const onDrop = useCallback((acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        if (file) {
            if (file.type !== 'text/csv') {
                toast({
                    variant: 'destructive',
                    title: 'Invalid File Type',
                    description: 'Please upload a valid .csv file.',
                });
                return;
            }

            parse(file, {
                header: true,
                skipEmptyLines: true,
                complete: (results) => {
                    const headers = results.meta.fields || [];
                    const data = results.data as CsvRow[];
                    onFileProcessed(file, headers, data);
                },
                error: (error: any) => {
                    toast({
                        variant: 'destructive',
                        title: 'Error parsing CSV',
                        description: error.message,
                    });
                }
            });
        }
    }, [onFileProcessed, toast]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'text/csv': ['.csv'] },
        multiple: false,
    });

    return (
        <div
            {...getRootProps()}
            className={`cursor-pointer rounded-lg border-2 border-dashed p-12 text-center transition-colors ${
                isDragActive ? 'border-primary bg-primary/10' : 'border-muted-foreground/30 hover:border-primary/50'
            }`}
        >
            <input {...getInputProps()} />
            <UploadCloud className="mx-auto h-12 w-12 text-muted-foreground" />
            <p className="mt-4 font-semibold text-foreground">Arrastra y suelta un archivo CSV aquí, o haz clic para seleccionar</p>
            <p className="mt-2 text-sm text-muted-foreground">El archivo debe ser un .csv con cabeceras.</p>
        </div>
    );
}

