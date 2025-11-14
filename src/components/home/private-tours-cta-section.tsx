
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Map, Users, Clock, ArrowRight } from 'lucide-react';
import { type getDictionary } from '@/dictionaries/get-dictionary';

type PrivateToursCtaProps = {
    dictionary: Awaited<ReturnType<typeof getDictionary>>['privateToursCta'];
    lang: string;
}

export function PrivateToursCtaSection({ dictionary, lang }: PrivateToursCtaProps) {
    
    const benefits = [
        { icon: <Map className="w-6 h-6 text-accent" />, text: dictionary.benefit1 },
        { icon: <Users className="w-6 h-6 text-accent" />, text: dictionary.benefit2 },
        { icon: <Clock className="w-6 h-6 text-accent" />, text: dictionary.benefit3 },
    ];

    return (
        <section className="relative py-24 bg-background">
            <div className="absolute inset-0">
                <Image
                    src="https://firebasestorage.googleapis.com/v0/b/tasting-mallorca.firebasestorage.app/o/web%2FFoto%20fondo%20Private%20Tour%2FDSC09705-Mejorado-NR.jpg?alt=media&token=11e66546-a510-4421-9a5c-9e68d3db28f4"
                    alt="Exclusive view of a Mallorcan cove"
                    fill
                    className="object-cover"
                    data-ai-hint="mallorca cove exclusive"
                />
                <div className="absolute inset-0 bg-white/50 backdrop-blur-sm"></div>
            </div>
            
            <div className="relative container mx-auto w-full md:w-[90vw] px-4 md:px-0 text-center">
                <div className="max-w-3xl mx-auto bg-background/80 backdrop-blur-md p-8 md:p-12 rounded-2xl shadow-xl border border-white/20">
                    <h2 className="text-4xl md:text-5xl font-extrabold text-foreground">{dictionary.title}</h2>
                    <p className="mt-4 text-lg text-muted-foreground">
                        {dictionary.description}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mt-12 text-left">
                        {benefits.map((benefit, index) => (
                             <div key={index} className="flex items-start gap-4">
                                <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                                    {benefit.icon}
                                </div>
                                <p className="font-semibold text-foreground">{benefit.text}</p>
                            </div>
                        ))}
                    </div>

                    <div className="mt-12">
                        <Button asChild size="lg" className="font-bold text-base rounded-full px-8 py-7 bg-accent hover:bg-accent/90 text-accent-foreground group">
                            <Link href={`/${lang}/private-tours-mallorca`}>
                                {dictionary.ctaButton}
                                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    );
}
