
'use server';

import { createSafeAction } from '@/app/server-actions/lib/safe-action';
import { FirestoreHotelRepository } from '@/backend/hotels/infrastructure/firestore-hotel.repository';
import { createHotel as createHotelUseCase } from '@/backend/hotels/application/createHotel';
import { Hotel, HotelRegion } from '@/backend/hotels/domain/hotel.model';
import { z } from 'zod';
import { parse } from 'papaparse';

const importSchema = z.object({
  fileContent: z.string(),
  columnMapping: z.record(z.string()),
});

type CsvRow = { [key: string]: string };

const hotelSchemaForValidation = z.object({
  name: z.string().min(1),
  region: z.enum(["North", "East", "South", "West", "Central"]),
  subRegion: z.string().min(1),
  latitude: z.number(),
  longitude: z.number(),
  address: z.string().optional(),
});


export const importHotelsFromCsv = createSafeAction(
  {
    allowedRoles: ['admin'],
    inputSchema: importSchema,
  },
  async (
    { fileContent, columnMapping }
  ): Promise<{ data?: { importedCount: number }; error?: string }> => {
    try {
      const hotelRepository = new FirestoreHotelRepository();
      let importedCount = 0;

      const parseResult = await new Promise<{ data: CsvRow[], errors: any[] }>((resolve, reject) => {
        parse(fileContent, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => resolve(results),
          error: (error: any) => reject(error),
        });
      });

      if (parseResult.errors.length > 0) {
        throw new Error(`Error parsing CSV: ${parseResult.errors[0].message}`);
      }

      for (const row of parseResult.data) {
        const hotelData: Partial<Omit<Hotel, 'id'>> = {};
        
        for (const csvHeader in columnMapping) {
            const dbField = columnMapping[csvHeader];
            if (dbField !== 'ignore' && row[csvHeader]) {
                if (dbField === 'region') {
                    // Normalize the region value: trim whitespace and capitalize first letter
                    const rawRegion = row[csvHeader].trim();
                    hotelData.region = (rawRegion.charAt(0).toUpperCase() + rawRegion.slice(1).toLowerCase()) as HotelRegion;
                } else {
                     (hotelData as any)[dbField] = row[csvHeader];
                }
            }
        }
        
        const validationInput = {
            ...hotelData,
            latitude: parseFloat(hotelData.latitude as any),
            longitude: parseFloat(hotelData.longitude as any),
        };

        const validation = hotelSchemaForValidation.safeParse(validationInput);

        if (!validation.success) {
            console.warn('Skipping row due to validation errors:', row, validation.error.format());
            continue;
        }

        const validatedData = validation.data;
        
        const newHotel: Hotel = {
            id: crypto.randomUUID(),
            name: validatedData.name,
            address: validatedData.address,
            region: validatedData.region,
            subRegion: validatedData.subRegion,
            latitude: validatedData.latitude,
            longitude: validatedData.longitude,
        };
        
        await createHotelUseCase(hotelRepository, newHotel);
        importedCount++;
      }

      return { data: { importedCount } };
    } catch (error: any) {
      console.error("Error importing hotels:", error);
      return { error: error.message || 'Failed to import hotels from CSV.' };
    }
  }
);
