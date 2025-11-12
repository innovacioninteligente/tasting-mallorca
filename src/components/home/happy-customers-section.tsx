
'use client';

import Image from 'next/image';
import { type getDictionary } from '@/dictionaries/get-dictionary';

type HappyCustomersProps = {
    dictionary: Awaited<ReturnType<typeof getDictionary>>['happyCustomers'];
}

export function HappyCustomersSection({ dictionary }: HappyCustomersProps) {
    return (
        <section className="bg-primary-dark text-primary-foreground py-24 relative overflow-hidden">
            <div className="container w-full px-4 md:px-0 md:w-[90vw] mx-auto">
            <div className="relative grid md:grid-cols-2 gap-16 items-center">
                {/* Image collage */}
                <div className="relative h-[500px]">
                <div className="absolute w-[70%] h-[70%] top-0 left-0 overflow-hidden rounded-full">
                    <Image src="https://firebasestorage.googleapis.com/v0/b/tasting-mallorca.firebasestorage.app/o/web%2Fimages%2F002_EDITADA_para_web_v2.jpg?alt=media&token=7b1b205a-0a65-4cde-8fb5-05c0c7dbe3a7" alt="Woman smiling on a boat" fill className="object-cover" data-ai-hint="woman boat travel" />
                </div>
                <div className="absolute w-[40%] h-[40%] top-10 right-0 bg-gray-700 overflow-hidden rounded-full border-4 border-primary-dark">
                    <Image src="https://firebasestorage.googleapis.com/v0/b/tasting-mallorca.firebasestorage.app/o/web%2Fimages%2F006_EDITADA.jpg?alt=media&token=7f865c1a-3c36-47ef-aa9c-b3bd0f9528fa" alt="Happy couple on a tour" fill className="object-cover" data-ai-hint="happy couple tour"/>
                </div>
                <div className="absolute w-[45%] h-[45%] bottom-0 right-1/4 bg-gray-700 overflow-hidden rounded-full border-4 border-primary-dark">
                    <Image src="https://firebasestorage.googleapis.com/v0/b/tasting-mallorca.firebasestorage.app/o/web%2Fimages%2F008_EDITADA.jpg?alt=media&token=e0c87254-14bb-4484-93e5-ed33b9a9508d" alt="Woman enjoying a view in Mallorca" fill className="object-cover" data-ai-hint="woman mallorca view" />
                </div>
                <div className="absolute w-[35%] h-[35%] bottom-0 left-5 bg-gray-700 overflow-hidden rounded-full border-4 border-primary-dark">
                    <Image src="https://firebasestorage.googleapis.com/v0/b/tasting-mallorca.firebasestorage.app/o/web%2Fimages%2F025.jpeg?alt=media&token=41985e36-4728-4c1b-ab2b-dc80520916dd" alt="Group of friends on a boat trip" fill className="object-cover" data-ai-hint="friends boat trip" />
                </div>
                </div>

                {/* Stats */}
                <div className="border-2 border-dashed border-primary-foreground/50 rounded-3xl p-10">
                <div className="grid grid-cols-2 gap-x-8 gap-y-12">
                    <div className="text-left border-b border-primary-foreground/30 pb-6">
                    <p className="text-5xl font-extrabold">10k</p>
                    <p className="text-primary-foreground/80 mt-2">{dictionary.stat1}</p>
                    </div>
                    <div className="text-left border-b border-primary-foreground/30 pb-6">
                    <p className="text-5xl font-extrabold">178</p>
                    <p className="text-primary-foreground/80 mt-2">{dictionary.stat2}</p>
                    </div>
                    <div className="text-left pt-6">
                    <p className="text-5xl font-extrabold">24M</p>
                    <p className="text-primary-foreground/80 mt-2">{dictionary.stat3}</p>
                    </div>
                    <div className="text-left pt-6">
                    <p className="text-5xl font-extrabold">125</p>
                    <p className="text-primary-foreground/80 mt-2">{dictionary.stat4}</p>
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
