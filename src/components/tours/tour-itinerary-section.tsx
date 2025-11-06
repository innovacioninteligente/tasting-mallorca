'use client';
import {
  MapPin,
  Camera,
  Bus,
  UtensilsCrossed,
  ShoppingBag,
} from 'lucide-react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

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
};

export function TourItinerarySection({
  dictionary,
}: TourItinerarySectionProps) {
  return (
    <section>
      <h2 className="text-3xl font-bold mb-8">{dictionary.title}</h2>
      <div className="relative">
        <div className="absolute left-6 top-0 h-full w-1 bg-border -translate-x-1/2"></div>
        
        {/* Pickup Point */}
        <div className="relative flex items-start gap-6 pb-8">
          <div className="z-10 flex flex-col items-center">
            <div className="h-12 w-12 rounded-full bg-background flex items-center justify-center">
              <div className="w-4 h-4 rounded-full bg-primary ring-4 ring-primary/20"></div>
            </div>
          </div>
          <div className="flex-1 pt-2.5">
            <div className='flex items-center gap-3'>
              <MapPin className="h-6 w-6 text-primary" />
              <h3 className="text-xl font-bold">{dictionary.pickupTitle}</h3>
            </div>
            <Collapsible>
              <CollapsibleContent className="mt-2 text-muted-foreground text-sm pl-9">
                {dictionary.pickupPoints.join(', ')}
              </CollapsibleContent>
              <CollapsibleTrigger asChild>
                <Button variant="link" className="p-0 text-primary pl-9">
                  {dictionary.seeMore}
                </Button>
              </CollapsibleTrigger>
            </Collapsible>
          </div>
        </div>

        {/* Itinerary Stops */}
        {dictionary.stops.map((stop, index) => (
          <div key={index} className="relative flex items-start gap-6 pb-8">
            <div className="z-10 flex flex-col items-center">
               <div className="h-12 w-12 rounded-full bg-background flex items-center justify-center">
                <div className={cn(
                  "w-4 h-4 rounded-full",
                  stop.type === 'stop' ? "bg-primary ring-4 ring-primary/20" : "bg-muted-foreground"
                )}></div>
              </div>
            </div>
            <div className="flex-1">
              {stop.type === 'travel' ? (
                <div className="pt-3 flex items-center gap-3">
                  {iconMap[stop.icon as keyof typeof iconMap]}
                  <p className="font-semibold text-muted-foreground">
                    {stop.title} ({stop.duration})
                  </p>
                </div>
              ) : (
                <Card className="shadow-md border border-border/80 -mt-1">
                  <CardContent className="p-4">
                    <div className='flex items-center gap-3'>
                        {iconMap[stop.icon as keyof typeof iconMap]}
                        <div>
                            <p className="font-semibold text-primary text-sm">
                            {stop.duration}
                            </p>
                            <h3 className="text-lg font-bold">{stop.title}</h3>
                        </div>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2 pl-9">
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
            <div className="z-10 flex flex-col items-center">
                 <div className="h-12 w-12 rounded-full bg-background flex items-center justify-center">
                    <div className="w-4 h-4 rounded-full bg-primary ring-4 ring-primary/20"></div>
                </div>
            </div>
            <div className="flex-1 pt-2.5">
                <div className='flex items-center gap-3'>
                    <MapPin className="h-6 w-6 text-primary" />
                    <h3 className="text-xl font-bold">{dictionary.dropoffTitle}</h3>
                </div>
                <Collapsible>
                <CollapsibleContent className="mt-2 text-muted-foreground text-sm pl-9">
                    {dictionary.dropoffPoints.join(', ')}
                </CollapsibleContent>
                <CollapsibleTrigger asChild>
                    <Button variant="link" className="p-0 text-primary pl-9">
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
