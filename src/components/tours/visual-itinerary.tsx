'use client';

import { cn } from "@/lib/utils";
import { Circle, MapPin, Bus, Flag, CheckCircle2 } from "lucide-react";

interface ItineraryItem {
    id?: string;
    type: 'stop' | 'travel';
    icon: string;
    title: string;
    duration: string;
    activities: string[];
}

interface VisualItineraryProps {
    items: ItineraryItem[];
    className?: string;
    pickupTitle?: string;
    pickupPoints?: string[];
    dropoffTitle?: string;
    dropoffPoints?: string[];
}

export function VisualItinerary({ items, className, pickupTitle, pickupPoints, dropoffTitle, dropoffPoints }: VisualItineraryProps) {
    return (
        <div className={cn("relative space-y-0 text-foreground ml-2", className)}>
            {/* Pickup Node */}
            {pickupTitle && (
                <div className="relative pl-12 pb-10 border-l-[3px] border-primary/20 last:border-0 last:pb-0">
                    <div className="absolute left-[-1.5px] -translate-x-1/2 top-0 bg-emerald-50 p-2 rounded-full border-2 border-emerald-200 z-10 mb-2">
                        <MapPin className="w-5 h-5 text-emerald-600 fill-emerald-100" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-emerald-900">{pickupTitle}</h3>
                        {pickupPoints && pickupPoints.length > 0 && (
                            <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{pickupPoints.join(', ')}</p>
                        )}
                    </div>
                </div>
            )}

            {items.map((item, index) => {
                const isLast = index === items.length - 1 && !dropoffTitle;
                const Icon = item.type === 'travel' ? Bus : MapPin;

                // Center logic:
                // Border width: 3px. Center is at 1.5px.
                // Icon container:
                // 'travel': w-4 icon + p-2 (8px*2) + border-2 (2px*2) = 16+16+4 = 36px approx? No.
                // Let's use flexible centering with -translate-x-1/2

                return (
                    <div key={index} className={cn("relative pl-12 pb-12 border-l-[3px]",
                        item.type === 'travel' ? "border-dashed border-gray-300" : "border-solid border-primary/20",
                        isLast ? "border-transparent pb-0" : ""
                    )}>
                        <div className={cn("absolute left-[-1.5px] -translate-x-1/2 top-0 p-2 rounded-full border-[3px] bg-background z-10",
                            item.type === 'travel' ? "border-gray-200 text-gray-400" : "border-amber-200 text-amber-600 shadow-sm"
                        )}>
                            <Icon className={cn("w-5 h-5", item.type === 'travel' && "w-4 h-4")} />
                        </div>
                        <div className={cn("flex flex-col gap-3 p-5 rounded-2xl transition-all duration-300",
                            item.type === 'travel' ? "bg-transparent pl-0" : "bg-white shadow-md border border-gray-100 hover:shadow-lg"
                        )}>
                            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:justify-between">
                                <h3 className={cn("text-xl font-bold leading-tight", item.type === 'travel' ? "text-gray-500 text-base font-medium" : "text-gray-900")}>
                                    {item.title}
                                </h3>
                                {item.duration && (
                                    <span className={cn("text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg whitespace-nowrap self-start sm:self-auto shrink-0",
                                        item.type === 'travel' ? "bg-gray-100 text-gray-500" : "bg-amber-100 text-amber-700"
                                    )}>
                                        {item.duration}
                                    </span>
                                )}
                            </div>

                            {item.activities && item.activities.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-1">
                                    {item.activities.map((act, i) => (
                                        <span key={i} className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-primary/5 text-primary border border-primary/10">
                                            {act}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                );
            })}

            {/* Dropoff Node */}
            {dropoffTitle && (
                <div className="relative pl-12 pt-0 border-l-[3px] border-transparent">
                    <div className="absolute left-[-1.5px] -translate-x-1/2 top-0 bg-emerald-50 p-2 rounded-full border-2 border-emerald-200 z-10">
                        <Flag className="w-5 h-5 text-emerald-600 fill-emerald-100" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-emerald-900">{dropoffTitle}</h3>
                        {dropoffPoints && dropoffPoints.length > 0 && (
                            <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{dropoffPoints.join(', ')}</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
