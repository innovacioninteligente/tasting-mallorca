
'use client';
import { Check, X } from 'lucide-react';

interface TourIncludesSectionProps {
    dictionary: {
        title: string;
        included: string[];
        notIncluded: string[];
    };
}

export function TourIncludesSection({ dictionary }: TourIncludesSectionProps) {
    return (
        <section>
            <h2 className="text-3xl font-bold mb-6">{dictionary.title}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <ul className="space-y-3">
                        {dictionary.included.map((item, index) => (
                            <li key={index} className="flex items-center gap-3">
                                <Check className="w-6 h-6 text-green-500 bg-green-100 rounded-full p-1" />
                                <span className="text-muted-foreground">{item}</span>
                            </li>
                        ))}
                    </ul>
                </div>
                <div>
                     <ul className="space-y-3">
                        {dictionary.notIncluded.map((item, index) => (
                            <li key={index} className="flex items-center gap-3">
                                <X className="w-6 h-6 text-red-500 bg-red-100 rounded-full p-1" />
                                <span className="text-muted-foreground">{item}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </section>
    );
}
