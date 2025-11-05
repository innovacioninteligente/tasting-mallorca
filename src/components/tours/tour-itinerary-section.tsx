
'use client';
import {
  MapPin,
  Camera,
  Bus,
  UtensilsCrossed,
  ShoppingBag,
  CircleUser,
} from 'lucide-react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface TourItinerarySectionProps {
  dictionary: {
    title: string;
    pickupTitle: string;
    pickupPoints: string[];
    seeMore: string;
    seeLess: string;
    stops: {
      type: 'travel' | 'stop';
      icon: 'Bus' | 'MapPin' | 'Camera' | 'UtensilsCrossed' | 'ShoppingBag';
      title: string;
      duration: string;
      activities: string[];
    }[];
    dropoffTitle: string;
    dropoffPoints: string[];
  };
}

const iconMap = {
  Bus: <Bus className="h-6 w-6 text-primary" />,
  MapPin: <MapPin className="h-6 w-6 text-primary" />,
  Camera: <Camera className="h-6 w-6 text-primary" />,
  UtensilsCrossed: <UtensilsCrossed className="h-6 w-6 text-primary" />,
  ShoppingBag: <ShoppingBag className="h-6 w-6 text-primary" />,
  CircleUser: <CircleUser className="h-6 w-6 text-primary" />,
};

export function TourItinerarySection({
  dictionary,
}: TourItinerarySectionProps) {
  return (
    <section>
      <h2 className="text-3xl font-bold mb-8">{dictionary.title}</h2>
      <div className="relative">
        {/* Pickup Point */}
        <div className="relative flex items-start gap-6">
          <div className="flex flex-col items-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              {iconMap['CircleUser']}
            </div>
          </div>
          <div className="flex-1 pb-10">
            <h3 className="text-xl font-bold">{dictionary.pickupTitle}</h3>
            <Collapsible>
              <CollapsibleContent className="mt-2 text-muted-foreground text-sm">
                {dictionary.pickupPoints.join(', ')}
              </CollapsibleContent>
              <CollapsibleTrigger asChild>
                <Button variant="link" className="p-0 text-primary">
                  {dictionary.seeMore}
                </Button>
              </CollapsibleTrigger>
            </Collapsible>
          </div>
        </div>

        {/* Itinerary Stops */}
        {dictionary.stops.map((stop, index) => (
          <div key={index} className="relative flex items-start gap-6">
            <div className="absolute left-6 top-0 h-full w-0.5 bg-border -translate-x-1/2"></div>
            <div className="z-10 flex flex-col items-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                {iconMap[stop.icon as keyof typeof iconMap]}
              </div>
            </div>
            <div className="flex-1 pb-12">
              {stop.type === 'travel' ? (
                <div className="pt-3">
                  <p className="font-semibold text-muted-foreground">
                    {stop.title} ({stop.duration})
                  </p>
                </div>
              ) : (
                <Card className="shadow-md">
                  <CardContent className="p-6">
                    <p className="font-semibold text-primary">
                      {stop.duration}
                    </p>
                    <h3 className="text-xl font-bold mt-1">{stop.title}</h3>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {stop.activities.map((activity, i) => (
                        <span
                          key={i}
                          className="text-xs font-medium bg-secondary text-secondary-foreground px-2 py-1 rounded-full"
                        >
                          {activity}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        ))}
        
        {/* Dropoff Point */}
        <div className="relative flex items-start gap-6">
            <div className="absolute left-6 bottom-full h-12 w-0.5 bg-border -translate-x-1/2"></div>
            <div className="z-10 flex flex-col items-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                {iconMap['CircleUser']}
                </div>
            </div>
            <div className="flex-1">
                <h3 className="text-xl font-bold">{dictionary.dropoffTitle}</h3>
                <Collapsible>
                <CollapsibleContent className="mt-2 text-muted-foreground text-sm">
                    {dictionary.dropoffPoints.join(', ')}
                </CollapsibleContent>
                <CollapsibleTrigger asChild>
                    <Button variant="link" className="p-0 text-primary">
                    {dictionary.seeMore}
                    </Button>
                </CollapsibleTrigger>
                </Collapsible>
            </div>
        </div>

      </div>
    </section>
  );
}
