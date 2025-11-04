'use client';

import Image from 'next/image';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import Autoplay from "embla-carousel-autoplay";
import { useRef } from 'react';
import { Quote, Star } from 'lucide-react';

const testimonials = [
    {
      quote: "Tasting Mallorca's work helped us save a significant percentage of our tour plan. We are happy with all experiences & all services.",
      author: "Tomas Widdin",
      role: "Web Developer",
      rating: 5,
    },
    {
      quote: "An absolutely unforgettable experience. The guides were knowledgeable and friendly, and the landscapes were breathtaking. Highly recommended!",
      author: "Sarah Johnson",
      role: "Travel Blogger",
      rating: 5,
    },
    {
      quote: "The best way to see the real Mallorca. We avoided the crowds and discovered hidden gems we would have never found on our own. Will book again!",
      author: "David & Emily",
      role: "Tourists",
      rating: 4,
    },
  ];

export function TestimonialsSection() {
    const autoplayPlugin = useRef(Autoplay({ delay: 5000, stopOnInteraction: true }));
    
    return (
        <section className="py-24 bg-secondary overflow-hidden">
            <div className="container w-full px-4 md:px-0 md:w-[90vw] mx-auto">
            <div className="grid md:grid-cols-2 gap-16 items-center">
                {/* Image collage */}
                <div className="relative h-[500px] hidden md:block">
                <div className="absolute w-[45%] h-[55%] top-0 left-10 overflow-hidden rounded-[4rem] transform rotate-[-15deg]">
                    <Image src="https://picsum.photos/seed/testimonial1/400/600" alt="Hiker with backpack" fill objectFit="cover" data-ai-hint="hiker travel" />
                </div>
                <div className="absolute w-[35%] h-[40%] top-5 right-5 overflow-hidden rounded-[3rem] transform rotate-[10deg]">
                    <Image src="https://picsum.photos/seed/testimonial2/400/400" alt="Woman on cliff" fill objectFit="cover" data-ai-hint="woman cliff view" />
                </div>
                <div className="absolute w-[30%] h-[35%] bottom-10 left-0 overflow-hidden rounded-[3rem] transform rotate-[5deg]">
                    <Image src="https://picsum.photos/seed/testimonial3/400/400" alt="Family at airport" fill objectFit="cover" data-ai-hint="family travel airport" />
                </div>
                <div className="absolute w-[40%] h-[45%] bottom-0 right-[-1rem] overflow-hidden rounded-[4rem] transform rotate-[-5deg]">
                    <Image src="https://picsum.photos/seed/testimonial4/400/500" alt="Woman in yellow dress" fill objectFit="cover" data-ai-hint="woman beach travel" />
                </div>
                </div>

                {/* Testimonial Carousel */}
                <div className="relative">
                <Carousel
                    plugins={[autoplayPlugin.current]}
                    className="w-full"
                    onMouseEnter={autoplayPlugin.current.stop}
                    onMouseLeave={autoplayPlugin.current.reset}
                >
                    <CarouselContent>
                    {testimonials.map((testimonial, index) => (
                        <CarouselItem key={index}>
                        <div className="pl-4">
                            <Quote className="w-16 h-16 text-primary" />
                            <div className="flex my-4">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <Star
                                    key={i}
                                    className={`w-6 h-6 ${i < testimonial.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                                    />
                                ))}
                            </div>
                            <p className="text-2xl md:text-3xl font-medium text-foreground/80 leading-relaxed">
                            {testimonial.quote}
                            </p>
                            <div className="mt-6">
                            <p className="text-xl font-bold">{testimonial.author}</p>
                            <p className="text-muted-foreground">{testimonial.role}</p>
                            </div>
                        </div>
                        </CarouselItem>
                    ))}
                    </CarouselContent>
                </Carousel>
                </div>
            </div>
            </div>
        </section>
    );
}
