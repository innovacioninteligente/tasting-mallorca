
'use client';

import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { UploadStep } from './upload-step';
import { ColumnMappingStep } from './column-mapping-step';

interface CsvImporterProps {
    setSheetOpen: (open: boolean) => void;
}

export interface CsvRow {
    [key: string]: string;
}

export function CsvImporter({ setSheetOpen }: CsvImporterProps) {
    const [step, setStep] = useState(1);
    const [file, setFile] = useState<File | null>(null);
    const [headers, setHeaders] = useState<string[]>([]);
    const [data, setData] = useState<CsvRow[]>([]);

    const handleFileProcessed = (file: File, headers: string[], data: CsvRow[]) => {
        setFile(file);
        setHeaders(headers);
        setData(data);
        setStep(2);
    };

    const handleBack = () => {
        setStep(1);
        setFile(null);
        setHeaders([]);
        setData([]);
    };
    
    return (
        <div className="pt-8">
            <AnimatePresence mode="wait">
                {step === 1 && (
                    <UploadStep key="step1" onFileProcessed={handleFileProcessed} />
                )}
                {step === 2 && file && (
                     <ColumnMappingStep
                        key="step2"
                        file={file}
                        headers={headers}
                        data={data}
                        onBack={handleBack}
                        setSheetOpen={setSheetOpen}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}

