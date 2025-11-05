
'use client';

import {
  CalendarX,
  CreditCard,
  Clock,
  Languages,
  Bus,
  Icon,
} from 'lucide-react';
import React from 'react';

// Define a type for the icon names for better type safety
type IconName = 'CalendarX' | 'CreditCard' | 'Clock' | 'Languages' | 'Bus';

// Map icon names to actual Lucide components
const iconMap: Record<IconName, Icon> = {
  CalendarX,
  CreditCard,
  Clock,
  Languages,
  Bus,
};

interface TourInfoSectionProps {
  dictionary: {
    mainTitle: string;
    infoPoints: {
      icon: IconName;
      title: string;
      description: string;
    }[];
  };
}

export function TourInfoSection({ dictionary }: TourInfoSectionProps) {
  return (
    <section>
      <h2 className="text-3xl font-bold mb-8">{dictionary.mainTitle}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
        {dictionary.infoPoints.map((point, index) => {
          const IconComponent = iconMap[point.icon];
          return (
            <div key={index} className="flex items-start gap-4">
              <div className="flex-shrink-0 mt-1">
                {IconComponent && (
                  <IconComponent className="w-6 h-6 text-primary" />
                )}
              </div>
              <div>
                <h3 className="font-bold text-lg">{point.title}</h3>
                <p className="text-muted-foreground">{point.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
