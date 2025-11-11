
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
                (hotelData as any)[dbField] = row[csvHeader];
            }
        }
        
        // Basic validation and type coercion
        if (!hotelData.name || !hotelData.address || !hotelData.region || !hotelData.subRegion || !hotelData.latitude || !hotelData.longitude) {
            console.warn('Skipping row due to missing required fields:', row);
            continue;
        }

        const newHotel: Hotel = {
            id: crypto.randomUUID(),
            name: hotelData.name,
            address: hotelData.address,
            region: hotelData.region as HotelRegion,
            subRegion: hotelData.subRegion,
            latitude: parseFloat(hotelData.latitude as any),
            longitude: parseFloat(hotelData.longitude as any),
        };

        if (isNaN(newHotel.latitude) || isNaN(newHotel.longitude)) {
             console.warn('Skipping row due to invalid coordinates:', row);
            continue;
        }
        
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
