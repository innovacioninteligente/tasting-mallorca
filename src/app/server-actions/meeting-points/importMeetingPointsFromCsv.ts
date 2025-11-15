
'use server';

import { createSafeAction } from '@/app/server-actions/lib/safe-action';
import { FirestoreMeetingPointRepository } from '@/backend/meeting-points/infrastructure/firestore-meeting-point.repository';
import { createMeetingPoint as createMeetingPointUseCase } from '@/backend/meeting-points/application/createMeetingPoint';
import { MeetingPoint, MeetingPointRegion } from '@/backend/meeting-points/domain/meeting-point.model';
import { z } from 'zod';
import { parse } from 'papaparse';
import { getCoordsFromUrl } from './utils/getCoordsFromUrl';

const importSchema = z.object({
  fileContent: z.string(),
  columnMapping: z.record(z.string()),
});

type CsvRow = { [key: string]: string };

const meetingPointSchemaForValidation = z.object({
  name: z.string().min(1),
  region: z.enum(["North", "East", "South", "West", "Central"]),
  address: z.string().optional(),
  googleMapsUrl: z.string().url(),
  time: z.string().optional(),
});

const regionTranslationMap: { [key: string]: MeetingPointRegion } = {
    'north': 'North',
    'norte': 'North',
    'east': 'East',
    'este': 'East',
    'south': 'South',
    'sur': 'South',
    'west': 'West',
    'oeste': 'West',
    'central': 'Central'
};

export const importMeetingPointsFromCsv = createSafeAction(
  {
    allowedRoles: ['admin'],
    inputSchema: importSchema,
  },
  async (
    { fileContent, columnMapping }
  ): Promise<{ data?: { importedCount: number }; error?: string }> => {
    try {
      const meetingPointRepository = new FirestoreMeetingPointRepository();
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
        const pointData: Partial<Omit<MeetingPoint, 'id' | 'latitude' | 'longitude'>> = {};
        
        for (const csvHeader in columnMapping) {
            const dbField = columnMapping[csvHeader];
            if (dbField !== 'ignore' && row[csvHeader]) {
                 (pointData as any)[dbField] = row[csvHeader];
            }
        }
        
        if (pointData.region) {
            const normalizedRegionKey = pointData.region.trim().toLowerCase();
            const translatedRegion = regionTranslationMap[normalizedRegionKey];
            if (translatedRegion) {
                pointData.region = translatedRegion;
            } else {
                console.warn(`Skipping row due to unmappable region: '${pointData.region}'`, row);
                continue;
            }
        }
        
        const validation = meetingPointSchemaForValidation.safeParse(pointData);

        if (!validation.success) {
            console.warn('Skipping row due to validation errors:', row, validation.error.format());
            continue;
        }

        const validatedData = validation.data;
        const { latitude, longitude } = await getCoordsFromUrl(validatedData.googleMapsUrl);
        
        const newMeetingPoint: MeetingPoint = {
            id: crypto.randomUUID(),
            name: validatedData.name,
            address: validatedData.address ?? '',
            region: validatedData.region,
            googleMapsUrl: validatedData.googleMapsUrl,
            time: validatedData.time,
            latitude,
            longitude,
        };
        
        await createMeetingPointUseCase(meetingPointRepository, newMeetingPoint);
        importedCount++;
      }

      return { data: { importedCount } };
    } catch (error: any) {
      console.error("Error importing meeting points:", error);
      return { error: error.message || 'Failed to import meeting points from CSV.' };
    }
  }
);
