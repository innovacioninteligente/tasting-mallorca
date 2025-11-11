
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHeader, TableHead, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { CsvRow } from './csv-importer';
import { useRouter } from 'next/navigation';
import { importMeetingPointsFromCsv } from '@/app/server-actions/meeting-points/importMeetingPointsFromCsv';
import { Loader2 } from 'lucide-react';

interface ColumnMappingStepProps {
    file: File;
    headers: string[];
    data: CsvRow[];
    onBack: () => void;
    setSheetOpen: (open: boolean) => void;
}

const meetingPointFields = [
    { value: 'name', label: 'Nombre del Punto' },
    { value: 'address', label: 'Dirección' },
    { value: 'region', label: 'Región' },
    { value: 'googleMapsUrl', label: 'URL de Google Maps' },
];

export function ColumnMappingStep({ file, headers, data, onBack, setSheetOpen }: ColumnMappingStepProps) {
    const [mapping, setMapping] = useState<{ [key: string]: string }>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { toast } = useToast();
    const router = useRouter();

    const handleMappingChange = (csvHeader: string, dbField: string) => {
        setMapping(prev => ({ ...prev, [csvHeader]: dbField }));
    };
    
    const handleSubmit = async () => {
        const requiredFields = ['name', 'region', 'googleMapsUrl'];
        const mappedDbFields = Object.values(mapping);

        const missingFields = requiredFields.filter(field => !mappedDbFields.includes(field));
        if (missingFields.length > 0) {
            toast({
                variant: 'destructive',
                title: 'Mapeo Incompleto',
                description: `Por favor, mapea los siguientes campos requeridos: ${missingFields.join(', ')}`,
            });
            return;
        }

        setIsSubmitting(true);
        try {
            const result = await importMeetingPointsFromCsv({
                fileContent: await file.text(),
                columnMapping: mapping,
            });

            if (result.error) throw new Error(result.error);
            
            toast({
                title: 'Importación Exitosa',
                description: `${result.data?.importedCount} puntos de encuentro han sido importados.`,
            });
            router.refresh();
            setSheetOpen(false);

        } catch (error: any) {
            toast({
                variant: 'destructive',
                title: 'Error en la Importación',
                description: error.message,
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-6">
            <p className="text-sm text-muted-foreground">
                Asigna cada columna de tu archivo CSV al campo correspondiente de la base de datos.
            </p>
            <div className="max-h-[50vh] overflow-y-auto border rounded-md">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Columna del CSV</TableHead>
                            <TableHead>Campo de la Base de Datos</TableHead>
                            <TableHead>Dato de Ejemplo</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {headers.map(header => (
                            <TableRow key={header}>
                                <TableCell className="font-semibold">{header}</TableCell>
                                <TableCell>
                                    <Select onValueChange={(value) => handleMappingChange(header, value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Seleccionar campo..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="ignore">Ignorar esta columna</SelectItem>
                                            {meetingPointFields.map(field => (
                                                <SelectItem key={field.value} value={field.value}>
                                                    {field.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </TableCell>
                                <TableCell className="text-muted-foreground truncate max-w-xs">{data[0]?.[header]}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
            <div className="flex justify-between items-center pt-4">
                <Button variant="outline" onClick={onBack} disabled={isSubmitting}>Volver</Button>
                <Button onClick={handleSubmit} disabled={isSubmitting}>
                     {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Iniciar Importación
                </Button>
            </div>
        </div>
    );
}
