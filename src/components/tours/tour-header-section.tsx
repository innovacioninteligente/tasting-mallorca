'use client';

import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Share2 } from "lucide-react";
import { TrustSignals } from "./trust-signals";


interface TourHeaderSectionProps {
    tour: {
        title: string;
    };
    dictionary: {
        share: string;
        freeCancellation: string;
        instantConfirmation: string;
        mobileTicket: string;
        [key: string]: string;
    };
}

export function TourHeaderSection({ tour, dictionary }: TourHeaderSectionProps) {
    const { toast } = useToast();

    const handleShare = async () => {
        const shareData = {
            title: tour.title,
            text: `Check out this tour: ${tour.title}`,
            url: window.location.href,
        };
        try {
            if (navigator.share) {
                await navigator.share(shareData);
            } else {
                await navigator.clipboard.writeText(window.location.href);
                toast({
                    title: "Link Copied!",
                    description: "The tour link has been copied to your clipboard.",
                });
            }
        } catch (error) {
            console.error("Error sharing:", error);
            // Ignore abort errors
        }
    };

    return (
        <header className="bg-secondary/50 py-8">
            <div className="w-full md:w-[80vw] mx-auto px-4">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-extrabold text-foreground mb-4" style={{ viewTransitionName: `tour-title-${tour.title}` }}>
                            {tour.title}
                        </h1>
                        <TrustSignals dictionary={dictionary} />
                    </div>
                    <div className="flex items-center gap-4 mt-6 md:mt-0">
                        <Button variant="ghost" className="flex items-center gap-2" onClick={handleShare}>
                            <Share2 className="w-5 h-5" />
                            <span>{dictionary.share}</span>
                        </Button>
                    </div>
                </div>
            </div>
        </header>
    );
}

