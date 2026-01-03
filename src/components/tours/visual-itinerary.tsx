
import { Tour } from '@/backend/tours/domain/tour.model';
import { MapPin, Bus, Clock } from 'lucide-react';
import { Locale } from '@/dictionaries/config';
import { cn } from '@/lib/utils';

interface VisualItineraryProps {
    tour: Tour;
    lang: Locale;
}

type UnifiedNode = {
    id: string;
    type: 'pickup' | 'stop' | 'travel';
    title: string;
    description?: string;
    duration?: string;
    activities?: string[];
};

export function VisualItinerary({ tour, lang }: VisualItineraryProps) {
    if (!tour.itinerary || tour.itinerary.length === 0) {
        return null;
    }

    // 1. Create Pickup Node (Resolved to String)
    const pickupNode: UnifiedNode = {
        id: 'pickup',
        type: 'pickup',
        title: tour.pickupPoint?.title?.[lang] || tour.pickupPoint?.title?.en || 'Pickup Location',
        description: tour.pickupPoint?.description?.[lang] || tour.pickupPoint?.description?.en || '',
    };

    // 2. Map Itinerary Items (Resolved to Strings)
    const itineraryNodes: UnifiedNode[] = tour.itinerary.map(item => ({
        id: item.id,
        type: item.type as 'stop' | 'travel', // cast safe if model matches
        title: item.title[lang] || item.title['en'], // RESOLVE TO STRING
        duration: item.duration,
        activities: item.activities?.[lang] || [], // Resolve activities for this lang
        description: undefined // Itinerary items use 'activities', not description text
    }));

    // 3. Combine
    const allNodes = [pickupNode, ...itineraryNodes];

    return (
        <div className="relative py-4">
            <div className="space-y-0">
                {allNodes.map((item, index) => {
                    const isLast = index === allNodes.length - 1;

                    const isPickup = item.type === 'pickup';
                    const isTravel = item.type === 'travel';
                    const isStop = item.type === 'stop';

                    // Line logic: Solid if current is Location (Pickup/Stop), Dashed if Travel
                    const isLineSolid = isPickup || isStop;

                    return (
                        <div key={item.id} className="relative pl-12 pb-10 last:pb-0">
                            {/* Connecting Line */}
                            {!isLast && (
                                <div
                                    className={cn(
                                        "absolute left-[19px] top-10 bottom-0 w-0.5",
                                        isLineSolid ? "bg-slate-300" : "border-l-2 border-dashed border-slate-300"
                                    )}
                                />
                            )}

                            {/* Node Icon */}
                            <div className={cn(
                                "absolute left-0 top-0 w-10 h-10 rounded-full border-2 flex items-center justify-center z-10 shadow-sm bg-white",
                                isPickup && "border-emerald-400 text-emerald-500 bg-emerald-50",
                                isStop && "border-amber-300 text-amber-600 bg-amber-50",
                                isTravel && "border-slate-200 text-slate-400 bg-slate-50"
                            )}>
                                {isPickup && <MapPin className="w-5 h-5" />}
                                {isStop && <MapPin className="w-5 h-5" />}
                                {isTravel && <Bus className="w-4 h-4" />}
                            </div>

                            {/* Node Content */}
                            <div className="pt-0.5">
                                {isPickup && (
                                    <div className="mt-1">
                                        <h3 className="font-bold text-lg text-emerald-900 mb-1 leading-none">
                                            {item.title}
                                        </h3>
                                        <div className="text-muted-foreground text-sm leading-relaxed max-w-2xl mt-2">
                                            {item.description}
                                        </div>
                                    </div>
                                )}

                                {isTravel && (
                                    <div className="flex items-center justify-between mt-2 pr-2">
                                        <span className="text-slate-500 font-medium bg-slate-100/50 px-2 py-1 rounded">
                                            {item.title}
                                        </span>
                                        {item.duration && (
                                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">
                                                {item.duration}
                                            </span>
                                        )}
                                    </div>
                                )}

                                {isStop && (
                                    <div className="bg-white rounded-xl shadow-lg border border-border/40 p-5 mt-2 hover:shadow-xl transition-shadow duration-300">
                                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                                            <h3 className="font-bold text-xl text-foreground">
                                                {item.title}
                                            </h3>
                                            {item.duration && (
                                                <div className="flex-shrink-0 bg-amber-100/80 text-amber-700 px-3 py-1.5 rounded-md text-xs font-bold uppercase tracking-wide flex items-center gap-1.5 self-start">
                                                    <Clock className="w-3.5 h-3.5" />
                                                    {item.duration}
                                                </div>
                                            )}
                                        </div>

                                        {/* Activities */}
                                        {item.activities && item.activities.length > 0 && (
                                            <div className="flex flex-wrap gap-2">
                                                {item.activities.map((activity, i) => (
                                                    <span key={i} className="px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-sm font-medium border border-slate-200">
                                                        {activity}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
