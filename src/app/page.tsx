import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { ArrowRight, Star } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';

const heroImage = PlaceHolderImages.find(img => img.id === 'hero-mallorca');
const vineyardTourImage = PlaceHolderImages.find(img => img.id === 'tour-vineyard');
const marketTourImage = PlaceHolderImages.find(img => img.id === 'tour-market');
const oliveTourImage = PlaceHolderImages.find(img => img.id === 'tour-olive-grove');
const aboutUsImage = PlaceHolderImages.find(img => img.id === 'about-us-philosophy');
const avatar1 = PlaceHolderImages.find(img => img.id === 'testimonial-avatar-1');
const avatar2 = PlaceHolderImages.find(img => img.id === 'testimonial-avatar-2');
const avatar3 = PlaceHolderImages.find(img => img.id === 'testimonial-avatar-3');


const featuredTours = [
  {
    title: 'Vineyard & Wine Tasting',
    description: 'Explore the scenic vineyards of Binissalem and taste exquisite local wines.',
    image: vineyardTourImage,
    price: '€75',
  },
  {
    title: 'Local Market & Paella Workshop',
    description: 'Visit a traditional market and learn to cook an authentic paella.',
    image: marketTourImage,
    price: '€90',
  },
  {
    title: 'Olive Oil Trail',
    description: 'Discover ancient olive groves and taste award-winning olive oils.',
    image: oliveTourImage,
    price: '€65',
  },
];

const testimonials = [
    {
      name: 'John & Mary D.',
      location: 'United Kingdom',
      text: 'The most authentic experience we\'ve had in Spain. The guide was wonderful and the food was incredible. No rushing, just pure enjoyment. Highly recommended!',
      avatar: avatar1,
    },
    {
      name: 'Hélène L.',
      location: 'France',
      text: 'Un tour magnifique! J\'ai découvert des endroits que je n\'aurais jamais trouvés seule. Le rythme était parfait pour moi. Merci Tasting Mallorca!',
      avatar: avatar2,
    },
    {
      name: 'Klaus & Helga S.',
      location: 'Germany',
      text: 'Ein wunderbarer Tag. Die Organisation war perfekt und die Weinprobe war ein Highlight. Wir fühlten uns sehr gut aufgehoben.',
      avatar: avatar3,
    },
];

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-[60vh] md:h-[80vh] w-full flex items-center justify-center text-center text-white">
        {heroImage && (
          <Image
            src={heroImage.imageUrl}
            alt={heroImage.description}
            fill
            className="object-cover"
            priority
            data-ai-hint={heroImage.imageHint}
          />
        )}
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 max-w-4xl px-4 flex flex-col items-center">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold leading-tight drop-shadow-lg">
            Tours auténticos, sin prisa.
          </h1>
          <p className="mt-6 text-xl md:text-2xl max-w-2xl font-body">
            Discover the real Mallorca with us. Unforgettable cultural and culinary experiences designed for you.
          </p>
          <Button asChild size="lg" className="mt-10 text-xl py-8 px-10 font-bold bg-primary hover:bg-primary/90 text-primary-foreground">
            <Link href="/tours">Explore Our Tours</Link>
          </Button>
        </div>
      </section>

      {/* Featured Tours Section */}
      <section id="tours" className="py-20 md:py-28 bg-background">
        <div className="container">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">Our Most Popular Tours</h2>
          <p className="text-xl text-center text-muted-foreground mb-16 max-w-3xl mx-auto">
            Hand-picked experiences that showcase the best of Mallorca's culture and cuisine.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredTours.map((tour) => (
              <Card key={tour.title} className="overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 flex flex-col">
                {tour.image && (
                  <div className="relative h-64 w-full">
                    <Image src={tour.image.imageUrl} alt={tour.image.description} fill className="object-cover" data-ai-hint={tour.image.imageHint}/>
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="text-2xl font-bold">{tour.title}</CardTitle>
                  <p className="text-2xl font-bold text-accent">{tour.price}</p>
                </CardHeader>
                <CardContent className="flex-grow">
                  <CardDescription className="text-base">{tour.description}</CardDescription>
                </CardContent>
                <div className="p-6 pt-0">
                  <Button asChild className="w-full text-lg font-bold bg-accent hover:bg-accent/90 text-accent-foreground">
                    <Link href="/tours">Book Now <ArrowRight className="ml-2 h-5 w-5"/></Link>
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* About Us/Philosophy Section */}
      <section className="py-20 md:py-28 bg-secondary">
        <div className="container grid md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1">
            <h3 className="text-sm font-bold uppercase text-accent tracking-widest">Our Philosophy</h3>
            <h2 className="text-4xl md:text-5xl font-bold mt-4 mb-6">No tourist traps. Just authentic Mallorca.</h2>
            <p className="text-lg text-muted-foreground mb-4">
              We believe in sharing the true spirit of our island. That means no rushed schedules, no crowded tourist spots, and definitely no small portions! 
            </p>
            <p className="text-lg text-muted-foreground">
              Our tours are about generous hospitality, delicious local food, and creating memories that last a lifetime.
            </p>
            <Button asChild size="lg" variant="link" className="text-lg p-0 h-auto mt-6 text-accent hover:text-accent/80">
              <Link href="/about">Learn More About Us <ArrowRight className="ml-2 h-5 w-5"/></Link>
            </Button>
          </div>
          <div className="order-1 md:order-2">
            {aboutUsImage && (
              <Image src={aboutUsImage.imageUrl} alt={aboutUsImage.description} width={800} height={600} className="rounded-lg shadow-xl" data-ai-hint={aboutUsImage.imageHint} />
            )}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 md:py-28 bg-background">
        <div className="container">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">What Our Guests Say</h2>
          <p className="text-xl text-center text-muted-foreground mb-16 max-w-3xl mx-auto">
            We're proud of the experiences we create. Here's what people are saying about their time with us.
          </p>
          <Carousel
            opts={{
              align: "start",
            }}
            className="w-full"
          >
            <CarouselContent>
              {testimonials.map((testimonial, index) => (
                <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                  <div className="p-1 h-full">
                    <Card className="h-full flex flex-col justify-between p-6 shadow-lg">
                      <div>
                        <div className="flex items-center gap-2 mb-4">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} className="h-5 w-5 text-primary fill-primary" />
                            ))}
                        </div>
                        <p className="text-lg text-foreground/90 italic">"{testimonial.text}"</p>
                      </div>
                      <div className="flex items-center gap-4 mt-6">
                        {testimonial.avatar && (
                           <Avatar className="h-16 w-16">
                             <AvatarImage src={testimonial.avatar.imageUrl} alt={testimonial.avatar.description} data-ai-hint={testimonial.avatar.imageHint} />
                             <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                           </Avatar>
                        )}
                        <div>
                          <p className="text-lg font-bold">{testimonial.name}</p>
                          <p className="text-muted-foreground">{testimonial.location}</p>
                        </div>
                      </div>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="ml-14" />
            <CarouselNext className="mr-14" />
          </Carousel>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 md:py-28 bg-accent text-accent-foreground">
        <div className="container text-center flex flex-col items-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready for an Unforgettable Experience?</h2>
          <p className="text-xl max-w-3xl mb-10">
            Browse our carefully curated tours and find the perfect Mallorcan adventure for you.
          </p>
          <Button asChild size="lg" className="text-xl py-8 px-10 font-bold bg-primary hover:bg-primary/90 text-primary-foreground">
            <Link href="/tours">View All Tours</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
