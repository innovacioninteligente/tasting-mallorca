
'use client';

import Image from 'next/image';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import Autoplay from "embla-carousel-autoplay";
import { useRef } from 'react';
import { Quote, Star } from 'lucide-react';
import { type getDictionary } from '@/dictionaries/get-dictionary';

type TestimonialsSectionProps = {
    dictionary: Awaited<ReturnType<typeof getDictionary>>['testimonials'];
}

const testimonials = [
  {
    quote: "Jako was very enthusiastic and welcoming. The trip was well planned. It would have been nice to be able to buy water on the bus.",
    author: "Winnie Petersen",
    role: "Danish - 09/02/2025",
    rating: 5,
  },
  {
    quote: "Very interesting excursion, accompanied by Clément, a friendly and competent guide. A must-do.",
    author: "Alain",
    role: "French - 08/27/2025",
    rating: 5,
  },
  {
    quote: "Wonderful excursion with an excellent guide. Complete information (historical, geographical and cultural), interaction with the group. Clément is very professional and led the day with many anecdotes and humor. We had an excellent day.",
    author: "Soldera",
    role: "French - 08/26/2025",
    rating: 5,
  },
  {
    quote: "A very good day wonderfully animated by Clément, who captivated us with his historical and geographical knowledge. Highly recommended.",
    author: "Fardel",
    role: "French - 08/26/2025",
    rating: 5,
  },
  {
    quote: "A beautiful discovery.",
    author: "Etienne",
    role: "French - 08/26/2025",
    rating: 5,
  },
  {
    quote: "Excellent, congratulations.",
    author: "Letourmy",
    role: "French - 08/26/2025",
    rating: 5,
  },
  {
    quote: "Lovely experience today around the market and the Aloe Vera farm, and our very first tapas was delightful.",
    author: "Ian & Lorraine Archibald",
    role: "British - 08/26/2025",
    rating: 5,
  },
  {
    quote: "Very comprehensive and interesting. Especially enjoyed the Tramuntana mountains.",
    author: "Toews",
    role: "German - 08/22/2025",
    rating: 5,
  },
  {
    quote: "Excellent, varied and enriching. I recommend it.",
    author: "Dese",
    role: "French - 08/12/2025",
    rating: 5,
  },
  {
    quote: "Jako was a funny and approachable guide, we were very satisfied with him. We experienced a really great trip, exactly what we imagined.",
    author: "Schultz Andras",
    role: "Hungarian - 08/08/2025",
    rating: 5,
  },
  {
    quote: "It was beautiful, interesting, and delicious.",
    author: "Elisabeth Schmidt",
    role: "German - 08/08/2025",
    rating: 5,
  },
  {
    quote: "Thank you for this wonderful day of discovery. Our guide and driver really did an excellent job, with outstanding knowledge of the island. We truly learned a lot about Mallorca. Well done!",
    author: "Berlendis",
    role: "French - 07/25/2025",
    rating: 5,
  },
];

export function TestimonialsSection({ dictionary }: TestimonialsSectionProps) {
    const autoplayPlugin = useRef(Autoplay({ delay: 5000, stopOnInteraction: true }));
    
    return (
        <section className="py-24 bg-secondary">
            <div className="container mx-auto w-full md:w-[80vw] px-4 md:px-0">
                <div className="text-center mb-12">
                    <p className="text-accent font-cursive font-bold text-lg">{dictionary.subtitle}</p>
                    <h2 className="text-4xl md:text-5xl font-extrabold mt-2 text-foreground">{dictionary.title}</h2>
                    <p className="mt-4 text-lg text-muted-foreground max-w-xl mx-auto">
                        {dictionary.description}
                    </p>
                </div>
                <div className="grid md:grid-cols-2 gap-16 items-center">
                    {/* Image collage */}
                    <div className="relative h-[500px] hidden md:block">
                        <div className="absolute w-[45%] h-[55%] top-0 left-10 overflow-hidden rounded-[4rem] transform rotate-[-15deg]">
                            <Image src="https://firebasestorage.googleapis.com/v0/b/tasting-mallorca.firebasestorage.app/o/web%2Fimages%2Fmedium-shot-smiley-people-hugging.jpg?alt=media&token=bb3ba8f4-6d36-4a99-adb2-174e805509b9" alt="Happy tourist" fill className="object-cover" data-ai-hint="happy people" />
                        </div>
                        <div className="absolute w-[35%] h-[40%] top-5 right-5 overflow-hidden rounded-[3rem] transform rotate-[10deg]">
                            <Image src="https://firebasestorage.googleapis.com/v0/b/tasting-mallorca.firebasestorage.app/o/web%2Fimages%2F034.PNG?alt=media&token=1571c577-5efd-4437-b7ee-48837385ad3d" alt="Smiling customer" fill className="object-cover" data-ai-hint="smiling person" />
                        </div>
                        <div className="absolute w-[30%] h-[35%] bottom-10 left-0 overflow-hidden rounded-[3rem] transform rotate-[5deg]">
                            <Image src="https://firebasestorage.googleapis.com/v0/b/tasting-mallorca.firebasestorage.app/o/web%2Fimages%2Fhappy-senior-couple-taking-selfie-with-vintage-camera.jpg?alt=media&token=d29a831a-d0fe-4ddf-8ff8-b9adce5e8d09" alt="Another smiling customer" fill className="object-cover" data-ai-hint="senior couple" />
                        </div>
                        <div className="absolute w-[40%] h-[45%] bottom-0 right-[-1rem] overflow-hidden rounded-[4rem] transform rotate-[-5deg]">
                            <Image src="https://firebasestorage.googleapis.com/v0/b/tasting-mallorca.firebasestorage.app/o/web%2Fimages%2Fmedium-shot-woman-with-sunglasses-hat.jpg?alt=media&token=3dce95d5-47ff-4c48-ba13-3b355a2cc1b6" alt="Joyful traveler" fill className="object-cover" data-ai-hint="woman sunglasses" />
                        </div>
                    </div>

                    {/* Testimonial Carousel */}
                    <div className="relative overflow-hidden">
                        <Carousel
                            plugins={[autoplayPlugin.current]}
                            className="w-full"
                            onMouseEnter={autoplayPlugin.current.stop}
                            onMouseLeave={autoplayPlugin.current.reset}
                        >
                            <CarouselContent>
                                {testimonials.map((testimonial, index) => (
                                    <CarouselItem key={index}>
                                        <div className="px-8">
                                            <Quote className="w-16 h-16 text-primary" />
                                            <div className="flex my-4">
                                                {Array.from({ length: 5 }).map((_, i) => (
                                                    <Star
                                                        key={i}
                                                        className={`w-6 h-6 ${i < testimonial.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                                                    />
                                                ))}
                                            </div>
                                            <p className="text-xl md:text-2xl font-medium text-foreground/80 leading-relaxed">
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
