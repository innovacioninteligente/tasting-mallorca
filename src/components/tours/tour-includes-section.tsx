
'use client';
import { Check, X } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface TourIncludesSectionProps {
    dictionary: {
        detailTitle: string;
        detailContent: string[];
        includesTitle: string;
        included: string[];
        notIncluded: string[];
        notSuitableTitle: string;
        notSuitableItems: string[];
        importantInfoTitle: string;
        whatToBringTitle: string;
        whatToBringItems: string[];
        beforeYouGoTitle: string;
        beforeYouGoItems: string[];

    };
}

export function TourIncludesSection({ dictionary }: TourIncludesSectionProps) {
    return (
        <section className="space-y-12">
            <div>
                <h2 className="text-3xl font-bold mb-6">{dictionary.detailTitle}</h2>
                <div className="space-y-4 text-lg text-muted-foreground">
                    {dictionary.detailContent.map((paragraph, index) => (
                        <p key={index}>{paragraph}</p>
                    ))}
                </div>
            </div>

            <Separator />
            
            <div>
                <h2 className="text-3xl font-bold mb-6">{dictionary.includesTitle}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-lg text-muted-foreground">
                    <div>
                        <ul className="space-y-3">
                            {dictionary.included.map((item, index) => (
                                <li key={index} className="flex items-center gap-3">
                                    <Check className="w-6 h-6 text-green-500" />
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <ul className="space-y-3">
                            {dictionary.notIncluded.map((item, index) => (
                                <li key={index} className="flex items-center gap-3">
                                    <X className="w-6 h-6 text-red-500" />
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            <Separator />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div>
                    <h3 className="text-2xl font-bold mb-4">{dictionary.notSuitableTitle}</h3>
                    <ul className="space-y-3 text-lg text-muted-foreground list-disc pl-5">
                        {dictionary.notSuitableItems.map((item, index) => (
                            <li key={index}>{item}</li>
                        ))}
                    </ul>
                </div>
                <div>
                    <h3 className="text-2xl font-bold mb-4">{dictionary.importantInfoTitle}</h3>
                     <h4 className="font-bold mt-4 mb-2 text-lg">{dictionary.whatToBringTitle}</h4>
                     <ul className="space-y-2 text-lg text-muted-foreground list-disc pl-5">
                        {dictionary.whatToBringItems.map((item, index) => (
                            <li key={index}>{item}</li>
                        ))}
                    </ul>
                </div>
            </div>
            
            <div>
                <h4 className="font-bold mt-4 mb-2 text-lg">{dictionary.beforeYouGoTitle}</h4>
                <ul className="space-y-2 text-lg text-muted-foreground list-disc pl-5">
                    {dictionary.beforeYouGoItems.map((item, index) => (
                        <li key={index}>{item}</li>
                    ))}
                </ul>
            </div>


        </section>
    );
}
