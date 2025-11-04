'use client';

import Image from 'next/image';
import Link from 'next/link';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Button } from '@/components/ui/button';
import { Briefcase, Map, CheckCircle, ArrowUpRight } from 'lucide-react';

const aboutUsImage = PlaceHolderImages.find(img => img.id === 'about-us-philosophy');
const testimonialAvatar1 = PlaceHolderImages.find(img => img.id === 'testimonial-avatar-1');
const testimonialAvatar2 = PlaceHolderImages.find(img => img.id === 'testimonial-avatar-2');
const testimonialAvatar3 = PlaceHolderImages.find(img => img.id === 'testimonial-avatar-3');

export function WhyChooseUsSection() {
    return (
        <section className="py-24 bg-secondary overflow-hidden">
            <div className="container mx-auto w-full md:w-[90vw] px-4 md:px-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                {/* Left Side - Image */}
                <div className="relative">
                <div className="absolute -top-4 -left-4 w-24 h-24">
                    <Image src="/doodle-arrow.svg" alt="Doodle arrow" fill className="object-contain" />
                </div>
                {aboutUsImage && (
                    <div className="relative aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl max-w-md mx-auto">
                    <Image
                        src={aboutUsImage.imageUrl}
                        alt={aboutUsImage.description}
                        fill
                        className="object-cover"
                        data-ai-hint={aboutUsImage.imageHint}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                    </div>
                )}
                <div className="absolute bottom-8 -left-12 bg-card p-4 rounded-xl shadow-lg flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                        <CheckCircle className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <div>
                        <p className="font-bold">Trusted by</p>
                        <p className="text-sm text-muted-foreground">Trustpilot & rating</p>
                    </div>
                </div>
                    <div className="absolute bottom-8 -right-8 h-20 w-20 bg-primary rounded-full flex items-center justify-center transform transition-transform duration-300 hover:scale-110 cursor-pointer">
                        <ArrowUpRight className="h-10 w-10 text-primary-foreground" />
                    </div>
                </div>

                {/* Right Side - Content */}
                <div className="md:pr-8">
                <h2 className="text-4xl md:text-5xl font-extrabold">Why Choose Us</h2>
                <p className="mt-4 text-lg text-muted-foreground max-w-xl">
                    Content of a page when looking at layout the point of using lorem the is Ipsum less
                </p>

                <div className="mt-10 space-y-8">
                    <div className="flex items-start gap-6">
                    <div className="flex-shrink-0 w-14 h-14 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
                        <Briefcase className="w-7 h-7" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold">Personalized Trips</h3>
                        <p className="mt-2 text-muted-foreground">
                        Content of a page when looking at layout the point of using lorem the is Ipsum less normal
                        </p>
                    </div>
                    </div>
                    <div className="flex items-start gap-6">
                    <div className="flex-shrink-0 w-14 h-14 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
                        <Map className="w-7 h-7" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold">Trusted Travel Guide</h3>
                        <p className="mt-2 text-muted-foreground">
                        Content of a page when looking at layout the point of using lorem the is Ipsum less normal
                        </p>
                    </div>
                    </div>
                </div>

                <div className="mt-12 flex flex-col sm:flex-row items-center gap-6">
                    <Button asChild size="lg" className="font-bold text-base rounded-full px-8 py-7 bg-primary hover:bg-primary/90 text-primary-foreground">
                    <Link href="/tours">Start Booking</Link>
                    </Button>
                    <div className="flex items-center">
                    <div className="flex -space-x-4">
                        {testimonialAvatar1 && <Image className="inline-block h-12 w-12 rounded-full ring-2 ring-background object-cover" src={testimonialAvatar1.imageUrl} alt="User 1" data-ai-hint={testimonialAvatar1.imageHint} width={48} height={48} />}
                        {testimonialAvatar2 && <Image className="inline-block h-12 w-12 rounded-full ring-2 ring-background" src={testimonialAvatar2.imageUrl} alt="User 2" data-ai-hint={testimonialAvatar2.imageHint} width={48} height={48}/>}
                        {testimonialAvatar3 && <Image className="inline-block h-12 w-12 rounded-full ring-2 ring-background" src={testimonialAvatar3.imageUrl} alt="User 3" data-ai-hint={testimonialAvatar3.imageHint} width={48} height={48}/>}
                        <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center ring-2 ring-background">
                        <span className="text-muted-foreground font-bold text-lg">+</span>
                        </div>
                    </div>
                    <div className="ml-4">
                        <p className="font-bold text-xl">18k+</p>
                        <p className="text-sm text-muted-foreground">Individual Traveller</p>
                    </div>
                    </div>
                </div>

                </div>
                </div>
            </div>
        </section>
    );
}
