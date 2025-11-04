
'use client';
import { MapPin } from 'lucide-react';

interface TourItinerarySectionProps {
    dictionary: {
        title: string;
        stops: {
            title: string;
            duration: string;
        }[];
    };
}

export function TourItinerarySection({ dictionary }: TourItinerarySectionProps) {
    return (
        <section>
            <h2 className="text-3xl font-bold mb-8">{dictionary.title}</h2>
            <div className="relative border-l-2 border-primary/20 pl-8">
                {dictionary.stops.map((stop, index) => (
                    <div key={index} className="mb-10 relative">
                        <div className="absolute -left-[42px] top-0 bg-primary text-primary-foreground rounded-full h-10 w-10 flex items-center justify-center">
                            <MapPin className="h-5 w-5" />
                        </div>
                        <p className="text-sm text-muted-foreground">{stop.duration}</p>
                        <h3 className="text-xl font-semibold mt-1">{stop.title}</h3>
                    </div>
                ))}
            </div>
        </section>
    );
}
