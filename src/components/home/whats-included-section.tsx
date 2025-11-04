'use client';

import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Bus, Users, UtensilsCrossed, Mountain, Landmark, CheckCircle } from 'lucide-react';

const whatsIncludedImage = PlaceHolderImages.find(img => img.id === 'whats-included-picnic');

export function WhatsIncludedSection() {
    return (
        <section className="py-24 bg-background overflow-hidden">
            <div className="container mx-auto w-full md:w-[90vw] px-4 md:px-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    {/* Left Side - Content */}
                    <div className="md:pl-8">
                    <p className="text-primary font-cursive font-bold text-lg">All-Inclusive</p>
                    <h2 className="text-4xl md:text-5xl font-extrabold mt-2">What's Included in Every Tour</h2>
                    <p className="mt-4 text-lg text-muted-foreground max-w-xl">
                        We handle every detail so you can immerse yourself in an authentic, worry-free Mallorcan experience.
                    </p>

                    <div className="mt-10 space-y-8">
                        <div className="flex items-start gap-6">
                        <div className="flex-shrink-0 w-14 h-14 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
                            <Bus className="w-7 h-7" />
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold">Hotel Pickup & Drop-off</h3>
                            <p className="mt-2 text-muted-foreground">
                            We pick you up and drop you off near your accommodation. No hassle, no stress.
                            </p>
                        </div>
                        </div>
                        <div className="flex items-start gap-6">
                        <div className="flex-shrink-0 w-14 h-14 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
                            <Users className="w-7 h-7" />
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold">Local Expert Guides</h3>
                            <p className="mt-2 text-muted-foreground">
                            Our passionate local guides reveal the hidden side of Mallorca with stories, history, and personal insights.
                            </p>
                        </div>
                        </div>
                        <div className="flex items-start gap-6">
                        <div className="flex-shrink-0 w-14 h-14 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
                            <UtensilsCrossed className="w-7 h-7" />
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold">Traditional Mallorcan Lunch</h3>
                            <p className="mt-2 text-muted-foreground">
                            Enjoy a full local meal in a charming countryside setting, including regional wine or sangria.
                            </p>
                        </div>
                        </div>
                        <div className="flex items-start gap-6">
                        <div className="flex-shrink-0 w-14 h-14 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
                            <Mountain className="w-7 h-7" />
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold">Stunning Landscapes</h3>
                            <p className="mt-2 text-muted-foreground">
                            Explore Mallorca’s most scenic viewpoints and rural corners, perfect for unforgettable photos.
                            </p>
                        </div>
                        </div>
                        <div className="flex items-start gap-6">
                        <div className="flex-shrink-0 w-14 h-14 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
                            <Landmark className="w-7 h-7" />
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold">Cultural & Historic Sites</h3>
                            <p className="mt-2 text-muted-foreground">
                            Visit peaceful villages, ancient monasteries, and discover the island’s rich heritage beyond the beaches.
                            </p>
                        </div>
                        </div>
                    </div>
                    </div>
                    
                    {/* Right Side - Image */}
                    <div className="relative order-first md:order-last">
                    {whatsIncludedImage && (
                        <div className="relative aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl max-w-md mx-auto">
                        <Image
                            src={whatsIncludedImage.imageUrl}
                            alt={whatsIncludedImage.description}
                            fill
                            className="object-cover"
                            data-ai-hint={whatsIncludedImage.imageHint}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                        </div>
                    )}
                        <div className="absolute bottom-8 -right-8 h-20 w-20 bg-primary rounded-full flex items-center justify-center transform transition-transform duration-300 hover:scale-110 cursor-pointer">
                            <CheckCircle className="h-10 w-10 text-primary-foreground" />
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
