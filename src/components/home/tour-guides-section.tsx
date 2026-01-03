
'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Twitter, Facebook, Instagram } from 'lucide-react';
import { type getDictionary } from '@/dictionaries/get-dictionary';

type TourGuidesSectionProps = {
    dictionary: Awaited<ReturnType<typeof getDictionary>>['tourGuides'];
}

const tourGuides = [
    { name: 'Mike Hardson', image: 'https://picsum.photos/seed/guide1/200/200', hint: 'male guide portrait' },
    { name: 'Leslie Alexander', image: 'https://picsum.photos/seed/guide2/200/200', hint: 'female guide portrait' },
    { name: 'Annette Black', image: 'https://picsum.photos/seed/guide3/200/200', hint: 'female guide smiling' },
    { name: 'Guy Hawkins', image: 'https://picsum.photos/seed/guide4/200/200', hint: 'male guide casual' },
];

export function TourGuidesSection({ dictionary }: TourGuidesSectionProps) {
    return (
        <section className="py-24 bg-secondary">
            <div className="container text-center mb-16">
                <p className="text-accent font-cursive font-bold text-2xl">{dictionary.subtitle}</p>
                <h2 className="text-4xl md:text-5xl font-extrabold mt-2">{dictionary.title}</h2>
                <p className="mt-4 text-lg text-muted-foreground max-w-xl mx-auto">
                    {dictionary.description}
                </p>
            </div>

            <div className="container relative w-full px-4 md:px-0 md:w-[90vw] mx-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {tourGuides.map((guide) => (
                        <div key={guide.name} className="flex flex-col items-center text-center">
                            <div className="relative mb-4">
                                <div className="relative w-40 h-40">
                                    <Image
                                        src={guide.image}
                                        alt={guide.name}
                                        fill
                                        className="rounded-full object-cover border-4 border-background shadow-lg"
                                        sizes="160px"
                                        data-ai-hint={guide.hint}
                                    />
                                </div>
                            </div>
                            <div className="bg-card rounded-2xl p-6 pt-24 -mt-20 w-full shadow-lg">
                                <h3 className="text-xl font-bold">{guide.name}</h3>
                                <p className="text-primary">{dictionary.guideRole}</p>
                                <div className="flex justify-center gap-3 mt-4">
                                    <Button variant="outline" size="icon" className="rounded-full"><Facebook className="h-5 w-5" /></Button>
                                    <Button variant="outline" size="icon" className="rounded-full"><Twitter className="h-5 w-5" /></Button>
                                    <Button variant="outline" size="icon" className="rounded-full"><Instagram className="h-5 w-5" /></Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
