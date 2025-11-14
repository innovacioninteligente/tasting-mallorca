
'use client';

import Image from 'next/image';
import { type getDictionary } from '@/dictionaries/get-dictionary';

type HappyCustomersProps = {
    dictionary: Awaited<ReturnType<typeof getDictionary>>['happyCustomers'];
}

export function HappyCustomersSection({ dictionary }: HappyCustomersProps) {
    const stats = dictionary.stats;

    return (
        <section className="bg-primary-dark text-primary-foreground py-24 relative overflow-hidden">
            <div className="container w-full px-4 md:px-0 md:w-[80vw] mx-auto">
                 <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-extrabold text-primary-foreground">{dictionary.title}</h2>
                    <p className="mt-4 text-lg text-primary-foreground/80 max-w-xl mx-auto">
                        {dictionary.subtitle}
                    </p>
                </div>
            <div className="relative grid md:grid-cols-2 gap-16 items-center">
                {/* Image collage */}
                <div className="relative h-[500px]">
                <div className="absolute w-[70%] h-[70%] top-0 left-0 overflow-hidden rounded-full">
                    <Image src="https://firebasestorage.googleapis.com/v0/b/tasting-mallorca.firebasestorage.app/o/web%2Ffotos%20seccion%20Why%20travelers%20choose%20us%2FDSC07627-Mejorado-NR-2.jpg?alt=media&token=4031fc96-1a4a-423c-85a4-c68eb8d461c7" alt="Woman smiling on a boat" fill className="object-cover" data-ai-hint="woman boat travel" />
                </div>
                <div className="absolute w-[40%] h-[40%] top-10 right-0 bg-gray-700 overflow-hidden rounded-full border-4 border-primary-dark">
                    <Image src="https://firebasestorage.googleapis.com/v0/b/tasting-mallorca.firebasestorage.app/o/web%2Ffotos%20seccion%20Why%20travelers%20choose%20us%2FDSC07923-Mejorado-NR-2.jpg?alt=media&token=5dc22bfb-2a8f-4add-ad96-f00d603289b0" alt="Happy couple on a tour" fill className="object-cover" data-ai-hint="happy couple tour"/>
                </div>
                <div className="absolute w-[45%] h-[45%] bottom-0 right-1/4 bg-gray-700 overflow-hidden rounded-full border-4 border-primary-dark">
                    <Image src="https://firebasestorage.googleapis.com/v0/b/tasting-mallorca.firebasestorage.app/o/web%2Ffotos%20seccion%20Why%20travelers%20choose%20us%2FDSC08002-Mejorado-NR-2.jpg?alt=media&token=0aa4bd95-1b32-4650-b338-59ec2b8aab3a" alt="Woman enjoying a view in Mallorca" fill className="object-cover" data-ai-hint="woman mallorca view" />
                </div>
                <div className="absolute w-[35%] h-[35%] bottom-0 left-5 bg-gray-700 overflow-hidden rounded-full border-4 border-primary-dark">
                    <Image src="https://firebasestorage.googleapis.com/v0/b/tasting-mallorca.firebasestorage.app/o/web%2Ffotos%20seccion%20Why%20travelers%20choose%20us%2FDSC09752-Mejorado-NR.jpg?alt=media&token=bf9bec5a-b459-46af-82c4-5cdb8d4ef1ea" alt="Group of friends on a boat trip" fill className="object-cover" data-ai-hint="friends boat trip" />
                </div>
                </div>

                {/* Stats */}
                <div className="border-2 border-dashed border-primary-foreground/50 rounded-3xl p-10">
                <div className="grid grid-cols-2 gap-x-8 gap-y-12">
                    <div className="text-left border-b border-primary-foreground/30 pb-6">
                    <p className="text-5xl font-extrabold">{stats.stat1.value}</p>
                    <p className="text-primary-foreground/80 mt-2">{stats.stat1.label}</p>
                    </div>
                    <div className="text-left border-b border-primary-foreground/30 pb-6">
                    <p className="text-5xl font-extrabold">{stats.stat2.value}</p>
                    <p className="text-primary-foreground/80 mt-2">{stats.stat2.label}</p>
                    </div>
                    <div className="text-left pt-6">
                    <p className="text-5xl font-extrabold">{stats.stat3.value}</p>
                    <p className="text-primary-foreground/80 mt-2">{stats.stat3.label}</p>
                    </div>
                    <div className="text-left pt-6">
                    <p className="text-5xl font-extrabold">{stats.stat4.value}</p>
                    <p className="text-primary-foreground/80 mt-2">{stats.stat4.label}</p>
                    </div>
                </div>
                </div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="w-32 h-32 bg-background rounded-full flex items-center justify-center border-4 border-dashed border-primary-foreground/50">
                    <p className="text-4xl font-bold text-primary">4.8</p>
                </div>
                </div>
            </div>
            </div>
      </section>
    );
}

    