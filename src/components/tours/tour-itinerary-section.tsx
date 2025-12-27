
'use client';
import { VisualItinerary } from './visual-itinerary';

interface TourItinerarySectionProps {
  dictionary: {
    title: string;
    pickupTitle: string;
    pickupPoints: string[];
    seeMore: string;
    seeLess: string;
    stops: {
      type: 'travel' | 'stop';
      icon: string; // Relaxed type to match VisualItinerary
      title: string;
      duration: string;
      activities: string[];
    }[];
    dropoffTitle: string;
    dropoffPoints: string[];
  };
}

export function TourItinerarySection({
  dictionary,
}: TourItinerarySectionProps) {
  return (
    <section>
      <h2 className="text-3xl font-bold mb-8">{dictionary.title}</h2>
      <VisualItinerary
        items={dictionary.stops}
        pickupTitle={dictionary.pickupTitle}
        pickupPoints={dictionary.pickupPoints}
        dropoffTitle={dictionary.dropoffTitle}
        dropoffPoints={dictionary.dropoffPoints}
      />
    </section>
  );
}
