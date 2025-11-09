
'use client';

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, Share2, ChevronRight } from "lucide-react";

interface TourHeaderSectionProps {
    tour: {
        title: string;
    };
    dictionary: {
        newActivity: string;
        provider: string;
        addToFavorites: string;
        share: string;
        explore: string;
        seePlaces: string;
    };
}

export function TourHeaderSection({ tour, dictionary }: TourHeaderSectionProps) {
    return (
        <header className="bg-secondary/50 py-8">
            <div className="w-full md:w-[90vw] mx-auto px-4">
                <div className="flex items-center text-sm text-muted-foreground mb-4">
                    <span>{dictionary.explore}</span>
                    <ChevronRight className="w-4 h-4 mx-1" />
                    <span>{dictionary.seePlaces}</span>
                </div>

                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-extrabold text-foreground">
                            {tour.title}
                        </h1>
                        <div className="flex flex-col items-start gap-2 md:flex-row md:items-center md:gap-4 mt-4">
                            <Badge className="bg-accent text-accent-foreground hover:bg-accent/90">{dictionary.newActivity}</Badge>
                            <span className="text-sm text-muted-foreground">
                                {dictionary.provider}: <span className="font-semibold text-primary">Tasting Mallorca</span>
                            </span>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 mt-6 md:mt-0">
                        <Button variant="ghost" className="flex items-center gap-2">
                            <Heart className="w-5 h-5" />
                            <span>{dictionary.addToFavorites}</span>
                        </Button>
                        <Button variant="ghost" className="flex items-center gap-2">
                            <Share2 className="w-5 h-5" />
                            <span>{dictionary.share}</span>
                        </Button>
                    </div>
                </div>
            </div>
        </header>
    );
}
