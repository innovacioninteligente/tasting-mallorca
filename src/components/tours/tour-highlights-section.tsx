
'use client';
import { CheckCircle } from 'lucide-react';

interface TourHighlightsSectionProps {
    dictionary: {
        title: string;
        highlights: string[];
    };
}

export function TourHighlightsSection({ dictionary }: TourHighlightsSectionProps) {
    return (
        <section>
            <h2 className="text-3xl font-bold mb-6">{dictionary.title}</h2>
            <ul className="space-y-4">
                {dictionary.highlights.map((highlight, index) => (
                    <li key={index} className="flex items-start gap-3">
                        <CheckCircle className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                        <span className="text-lg text-muted-foreground">{highlight}</span>
                    </li>
                ))}
            </ul>
        </section>
    );
}
