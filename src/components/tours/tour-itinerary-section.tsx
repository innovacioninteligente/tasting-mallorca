
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
            <div className="relative border-l-2 border-primary/20 ml-4">
                {dictionary.stops.map((stop, index) => (
                    <div key={index} className="mb-10 ml-10 relative">
                        <div className="absolute -left-[49px] -top-1 bg-background p-1 rounded-full">
                            <div className="bg-primary text-primary-foreground rounded-full h-10 w-10 flex items-center justify-center ring-4 ring-background">
                                <MapPin className="h-5 w-5" />
                            </div>
                        </div>
                        <p className="text-sm text-primary font-semibold">{stop.duration}</p>
                        <h3 className="text-xl font-bold mt-1 text-foreground">{stop.title}</h3>
                        <p className="text-muted-foreground mt-2">Brief description of the stop. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                    </div>
                ))}
            </div>
        </section>
    );
}
