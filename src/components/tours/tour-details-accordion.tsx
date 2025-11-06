
'use client';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from "@/components/ui/accordion"
import { Check, X } from 'lucide-react';

interface TourDetailsAccordionProps {
    dictionary: {
        highlightsTitle: string;
        highlights: string[];
        detailTitle: string;
        detailContent: string[];
        includesTitle: string;
        included: string[];
        notIncluded: string[];
        importantInfoTitle: string;
        notSuitableTitle: string;
        notSuitableItems: string[];
        whatToBringTitle: string;
        whatToBringItems: string[];
        beforeYouGoTitle: string;
        beforeYouGoItems: string[];
    };
}

export function TourDetailsAccordion({ dictionary }: TourDetailsAccordionProps) {
    return (
        <Accordion type="multiple" defaultValue={['item-1']} className="w-full">
            <AccordionItem value="item-1">
                <AccordionTrigger className="text-3xl font-bold text-left">{dictionary.highlightsTitle}</AccordionTrigger>
                <AccordionContent>
                    <ul className="space-y-4 text-lg text-muted-foreground pt-4">
                        {dictionary.highlights.map((highlight, index) => (
                            <li key={index} className="flex items-start gap-3">
                                <Check className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                                <span>{highlight}</span>
                            </li>
                        ))}
                    </ul>
                </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
                <AccordionTrigger className="text-3xl font-bold text-left">{dictionary.detailTitle}</AccordionTrigger>
                <AccordionContent>
                    <div className="space-y-4 text-lg text-muted-foreground pt-4">
                        {dictionary.detailContent.map((paragraph, index) => (
                            <p key={index}>{paragraph}</p>
                        ))}
                    </div>
                </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
                <AccordionTrigger className="text-3xl font-bold text-left">{dictionary.includesTitle}</AccordionTrigger>
                <AccordionContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-lg text-muted-foreground pt-4">
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
                </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4">
                <AccordionTrigger className="text-3xl font-bold text-left">{dictionary.importantInfoTitle}</AccordionTrigger>
                <AccordionContent>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                        <div>
                            <h3 className="text-2xl font-bold mb-4">{dictionary.notSuitableTitle}</h3>
                            <ul className="space-y-3 text-lg text-muted-foreground list-disc pl-5">
                                {dictionary.notSuitableItems.map((item, index) => (
                                    <li key={index}>{item}</li>
                                ))}
                            </ul>
                        </div>
                        <div>
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
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    );
}
