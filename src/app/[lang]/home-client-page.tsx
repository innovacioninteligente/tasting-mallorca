'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Badge } from '@/components/ui/badge';
import { ArrowUpRight, Sprout, Briefcase, Map, CheckCircle, Heart, Star, MapPin, Camera, Twitter, Facebook, Instagram, Quote, CalendarDays, MessageCircle } from 'lucide-react';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import Autoplay from "embla-carousel-autoplay";
import { useRef } from 'react';
import { type getDictionary } from '@/dictionaries/get-dictionary';


const hikerImage = PlaceHolderImages.find(img => img.id === 'hiker-with-backpack');
const travelGirlImage = PlaceHolderImages.find(img => img.id === 'girl-travel-view');
const aboutUsImage = PlaceHolderImages.find(img => img.id === 'about-us-philosophy');
const testimonialAvatar1 = PlaceHolderImages.find(img => img.id === 'testimonial-avatar-1');
const testimonialAvatar2 = PlaceHolderImages.find(img => img.id === 'testimonial-avatar-2');
const testimonialAvatar3 = PlaceHolderImages.find(img => img.id === 'testimonial-avatar-3');


const destinations = [
  {
    name: 'New York',
    listings: 12,
    image: 'https://picsum.photos/seed/ny/400/600',
    imageHint: 'new york city',
  },
  {
    name: 'London',
    listings: 22,
    image: 'https://picsum.photos/seed/london/400/600',
    imageHint: 'london city',
  },
  {
    name: 'San Francisco',
    listings: 10,
    image: 'https://picsum.photos/seed/sf/400/600',
    imageHint: 'san francisco bridge',
  },
  {
    name: 'Paris',
    listings: 12,
    image: 'https://picsum.photos/seed/paris/400/600',
    imageHint: 'paris eiffel tower',
  },
];

const featuredTours = [
  {
    title: 'Turkish Waves',
    location: 'US, Alaska',
    price: 385,
    rating: 5.0,
    reviews: 245,
    discount: '40% off',
    image: 'https://picsum.photos/seed/turkey/600/800',
    imageHint: 'turkey coast waves',
  },
  {
    title: 'Rome Waves',
    location: 'Rome',
    price: 395,
    rating: 5.0,
    reviews: 245,
    discount: '60% off',
    image: 'https://picsum.photos/seed/rome-waves/600/800',
    imageHint: 'rome waves',
  },
  {
    title: 'United Waves',
    location: 'US, Florida',
    price: 365,
    rating: 5.0,
    reviews: 245,
    discount: '20% off',
    image: 'https://picsum.photos/seed/florida-waves/600/800',
    imageHint: 'florida waves',
  },
  {
    title: 'Mallorca Dreams',
    location: 'Spain, Mallorca',
    price: 420,
    rating: 4.9,
    reviews: 310,
    discount: '30% off',
    image: 'https://picsum.photos/seed/mallorca-dreams/600/800',
    imageHint: 'mallorca beach',
  },
];

const galleryImages = [
  { src: 'https://picsum.photos/seed/gallery1/500/800', hint: 'happy couple travel' },
  { src: 'https://picsum.photos/seed/gallery2/600/400', hint: 'woman travel backpack' },
  { src: 'https://picsum.photos/seed/gallery3/500/600', hint: 'hiker mountain view' },
  { src: 'https://picsum.photos/seed/gallery4/600/400', hint: 'traveler city skyline' },
  { src: 'https://picsum.photos/seed/gallery5/500/700', hint: 'tropical huts water' },
  { src: 'https://picsum.photos/seed/gallery6/600/400', hint: 'woman pink dress cliff' },
  { src: 'https://picsum.photos/seed/gallery7/500/600', hint: 'happy man beach' },
  { src: 'https://picsum.photos/seed/gallery8/600/800', hint: 'family airport travel' },
  { src: 'https://picsum.photos/seed/gallery9/500/500', hint: 'hiker looking at cliffs' },
  { src: 'https://picsum.photos/seed/gallery10/600/900', hint: 'woman yellow dress beach' },
  { src: 'https://picsum.photos/seed/gallery11/500/700', hint: 'couple walking city' },
];

const tourGuides = [
  { name: 'Mike Hardson', image: 'https://picsum.photos/seed/guide1/200/200', hint: 'male guide portrait' },
  { name: 'Leslie Alexander', image: 'https://picsum.photos/seed/guide2/200/200', hint: 'female guide portrait' },
  { name: 'Annette Black', image: 'https://picsum.photos/seed/guide3/200/200', hint: 'female guide smiling' },
  { name: 'Guy Hawkins', image: 'https://picsum.photos/seed/guide4/200/200', hint: 'male guide casual' },
];

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

  const blogPosts = [
    {
        title: "Living Sustainability: A Day In The Life Atrealar....",
        date: "24 Dec, 2024",
        comments: 2,
        image: 'https://picsum.photos/seed/blog1/400/500',
        imageHint: 'thailand island boat'
    },
    {
        title: "Psychology Is A Broad Field So Consider Narrowing",
        date: "25 Dec, 2024",
        comments: 5,
        image: 'https://picsum.photos/seed/blog2/400/500',
        imageHint: 'moscow cathedral colorful'
    },
    {
        title: "Affordable Therapy Options For The People Need Help",
        date: "26 Dec, 2024",
        comments: 1,
        image: 'https://picsum.photos/seed/blog3/400/500',
        imageHint: 'florence cathedral sunset'
    },
  ];

export default function HomeClientPage({
  dictionary,
}: {
  dictionary: Awaited<ReturnType<typeof getDictionary>>['home'];
}) {
  const autoplayPlugin = useRef(Autoplay({ delay: 5000, stopOnInteraction: true }));
  return (
    <div className="flex flex-col bg-background overflow-hidden">
      {/* Hero Section */}
      <section className="relative w-full overflow-hidden">
        <div className="container py-20 md:py-32">
          <div className="grid grid-cols-12 gap-8 items-center">
            {/* Left Image */}
            <div className="col-span-3 hidden md:flex flex-col items-center justify-end h-full">
              {hikerImage && (
                <div className="relative w-56 h-56">
                  <Image
                    src={hikerImage.imageUrl}
                    alt={hikerImage.description}
                    fill
                    className="object-cover rounded-full"
                    data-ai-hint={hikerImage.imageHint}
                  />
                </div>
              )}
            </div>

            {/* Main Content */}
            <div className="col-span-12 md:col-span-6 text-center z-10">
              <div className="flex justify-center items-center gap-4 mb-4">
                  <div className="relative w-32 h-32">
                      <Image
                          src={'https://firebasestorage.googleapis.com/v0/b/amparo-aesthetics.firebasestorage.app/o/tasting-mallorca%2Fimages%2FDSC07762-Mejorado-NR.jpg?alt=media&token=f7c4d121-a97f-4103-95b1-c70702fccd5f'}
                          alt="Tasting Mallorca experience"
                          fill
                          className="object-cover rounded-full"
                          data-ai-hint="mallorca experience"
                      />
                  </div>
              </div>
              <h2 className="text-lg font-semibold text-primary mb-2">{dictionary.welcome}</h2>
              <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter leading-tight">
                {dictionary.title}
              </h1>
              <p className="mt-6 text-lg text-muted-foreground max-w-xl mx-auto">
                {dictionary.subtitle}
              </p>
               <div className="flex justify-center items-center gap-4 mt-4">
                  <div className="relative w-32 h-32">
                      <Image
                          src={'https://firebasestorage.googleapis.com/v0/b/amparo-aesthetics.firebasestorage.app/o/tasting-mallorca%2Fimages%2FDSC08080-Mejorado-NR.jpg?alt=media&token=aec8e49c-de55-4828-9667-4788f8f6c306'}
                          alt="Tasting Mallorca tour"
                          fill
                          className="object-cover rounded-full"
                          data-ai-hint="mallorca tour"
                      />
                  </div>
              </div>
            </div>

            {/* Right Image */}
            <div className="col-span-3 hidden md:flex flex-col items-center justify-start h-full">
               {travelGirlImage && (
                <div className="relative w-56 h-56">
                  <Image
                    src={travelGirlImage.imageUrl}
                    alt={travelGirlImage.description}
                    fill
                    className="object-cover rounded-full"
                    data-ai-hint={travelGirlImage.imageHint}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
      
      {/* Top Destinations Section */}
      <section className="py-24 bg-background">
        <div className="container text-center mb-12">
            <div className='flex justify-center items-center gap-2'>
              <Sprout className="w-6 h-6 text-primary" />
              <p className="text-primary font-semibold text-lg">Destinations</p>
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold mt-2">Top Destinations</h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-xl mx-auto">
              Content of a page when looking at layout the point of using lorem the is Ipsum less
            </p>
          </div>
          <div className="w-full px-4 md:px-0 md:w-[90vw] mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {destinations.map((dest) => (
                <div key={dest.name} className="relative rounded-2xl overflow-hidden group h-[400px]">
                  <Image
                    src={dest.image}
                    alt={dest.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    data-ai-hint={dest.imageHint}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 p-6 text-white">
                    <h3 className="text-2xl font-bold">{dest.name}</h3>
                    <Badge variant="secondary" className="mt-2 bg-white/30 text-white backdrop-blur-sm border-0">
                      {dest.listings} Listing
                    </Badge>
                  </div>
                  <div className="absolute top-4 right-4 h-12 w-12 bg-primary rounded-full flex items-center justify-center transform transition-transform duration-300 group-hover:rotate-45">
                    <ArrowUpRight className="h-6 w-6 text-primary-foreground" />
                  </div>
                </div>
              ))}
            </div>
        </div>
      </section>

       {/* Why Choose Us Section */}
       <section className="py-24 bg-background overflow-hidden">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Left Side - Image */}
            <div className="relative">
              <div className="absolute -top-4 -left-4 w-24 h-24">
                <Image src="/doodle-arrow.svg" alt="Doodle arrow" fill className="object-contain" />
              </div>
               {aboutUsImage && (
                <div className="relative aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl max-w-md mx-auto">
                   <Image
                     src={"https://firebasestorage.googleapis.com/v0/b/amparo-aesthetics.firebasestorage.app/o/tasting-mallorca%2Fimages%2FDSC07762-Mejorado-NR.jpg?alt=media&token=f7c4d121-a97f-4103-95b1-c70702fccd5f"}
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

      {/* Featured Tours Section */}
      <section className="py-24 bg-secondary">
        <div className="container text-center mb-12">
            <p className="text-primary font-semibold text-lg">Featured Tours</p>
            <h2 className="text-4xl md:text-5xl font-extrabold mt-2">Amazing Tours</h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-xl mx-auto">
              Discover our handpicked selection of the most popular and breathtaking tours.
            </p>
        </div>
        <div className="w-full px-4 md:px-0 md:w-[90vw] mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredTours.map((tour) => (
              <div key={tour.title} className="bg-card rounded-2xl overflow-hidden group shadow-lg">
                <div className="relative h-64">
                  <Image
                    src={tour.image}
                    alt={tour.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    data-ai-hint={tour.imageHint}
                  />
                  <Badge className="absolute top-4 left-4 bg-yellow-400 text-black border-none font-bold">{tour.discount}</Badge>
                  <Button size="icon" variant="secondary" className="absolute top-4 right-4 rounded-full h-9 w-9 bg-white/20 backdrop-blur-sm border-0 text-white hover:bg-white/30">
                    <Heart className="h-5 w-5" />
                  </Button>
                </div>
                <div className="p-5">
                   <Badge variant="outline" className="border-primary text-primary mb-3">Featured</Badge>
                   <h3 className="text-xl font-bold">Over {tour.title}</h3>
                   <p className="text-2xl font-extrabold text-primary mb-4">${tour.price.toFixed(2)}</p>
                   <div className="flex items-center text-sm text-muted-foreground gap-4">
                     <div className="flex items-center gap-1">
                       <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                       <span className="font-bold">{tour.rating}</span> 
                       <span>({tour.reviews} Rating)</span>
                     </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span>{tour.location}</span>
                      </div>
                   </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Gallery Section */}
      <section className="py-24 bg-background">
        <div className="container text-center mb-12">
            <div className='flex justify-center items-center gap-2'>
              <Camera className="w-6 h-6 text-primary" />
              <p className="text-primary font-semibold text-lg">Our beautiful moment</p>
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold mt-2">Recent Gallery</h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-xl mx-auto">
              Content of a page when looking at layout the point of using lorem the is Ipsum less
            </p>
        </div>
        <div className="w-full px-4 md:px-0 md:w-[90vw] mx-auto">
          <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
            {galleryImages.map((img, index) => (
              <div key={index} className="break-inside-avoid">
                <Image 
                  src={img.src} 
                  alt={`Gallery image ${index + 1}`} 
                  width={500} 
                  height={500} 
                  className="w-full h-auto object-cover rounded-2xl" 
                  data-ai-hint={img.hint}
                />
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Happy Customers Section */}
      <section className="bg-primary-dark text-primary-foreground py-24 relative overflow-hidden">
        <div className="container w-full px-4 md:px-0 md:w-[90vw] mx-auto">
          <div className="relative grid md:grid-cols-2 gap-16 items-center">
            {/* Image collage */}
            <div className="relative h-[500px]">
              <div className="absolute w-[70%] h-[70%] top-0 left-0 overflow-hidden rounded-full">
                <Image src="https://picsum.photos/seed/happy-cust1/800/800" alt="Tropical boat view" fill objectFit="cover" data-ai-hint="thailand boat beach" />
              </div>
              <div className="absolute w-[40%] h-[40%] top-10 right-0 bg-gray-700 overflow-hidden rounded-full border-4 border-primary-dark">
                <Image src="https://picsum.photos/seed/happy-cust2/400/400" alt="Woman in pink dress" fill objectFit="cover" data-ai-hint="woman hat travel"/>
              </div>
              <div className="absolute w-[45%] h-[45%] bottom-0 right-1/4 bg-gray-700 overflow-hidden rounded-full border-4 border-primary-dark">
                 <Image src="https://picsum.photos/seed/happy-cust3/400/400" alt="Moscow cathedral" fill objectFit="cover" data-ai-hint="moscow cathedral" />
              </div>
              <div className="absolute w-[35%] h-[35%] bottom-0 left-5 bg-gray-700 overflow-hidden rounded-full border-4 border-primary-dark">
                <Image src="https://picsum.photos/seed/happy-cust4/400/400" alt="Hiker looking at view" fill objectFit="cover" data-ai-hint="hiker cliff view" />
              </div>
            </div>

            {/* Stats */}
            <div className="border-2 border-dashed border-primary-foreground/50 rounded-3xl p-10">
              <div className="grid grid-cols-2 gap-x-8 gap-y-12">
                <div className="text-left border-b border-primary-foreground/30 pb-6">
                  <p className="text-5xl font-extrabold">10k</p>
                  <p className="text-primary-foreground/80 mt-2">Our happy Customers around the world</p>
                </div>
                <div className="text-left border-b border-primary-foreground/30 pb-6">
                  <p className="text-5xl font-extrabold">178</p>
                  <p className="text-primary-foreground/80 mt-2">Our happy Customers around the world</p>
                </div>
                <div className="text-left pt-6">
                  <p className="text-5xl font-extrabold">24M</p>
                  <p className="text-primary-foreground/80 mt-2">Our happy Customers around the word</p>
                </div>
                <div className="text-left pt-6">
                  <p className="text-5xl font-extrabold">125</p>
                  <p className="text-primary-foreground/80 mt-2">Our happy Customers around the world</p>
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

      {/* Tour Guides Section */}
      <section className="py-24 bg-secondary">
        <div className="container text-center mb-16">
          <p className="text-primary font-semibold text-lg">Meet With Our Guide</p>
          <h2 className="text-4xl md:text-5xl font-extrabold mt-2">Tour Guide</h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-xl mx-auto">
            Content of a page when looking at layout the point of using lorem the is Ipsum less
          </p>
        </div>

        <div className="container relative w-full px-4 md:px-0 md:w-[90vw] mx-auto">
           <div className="hidden md:block absolute top-1/2 -left-24">
              <Image src="/balloon-doodle.svg" alt="Hot air balloon doodle" width={100} height={150} className="object-contain" />
           </div>
           <div className="hidden md:block absolute top-1/2 -right-24">
              <Image src="/airplane-doodle.svg" alt="Airplane doodle" width={150} height={75} className="object-contain" />
           </div>
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
                      data-ai-hint={guide.hint}
                    />
                  </div>
                </div>
                <div className="bg-card rounded-2xl p-6 pt-24 -mt-20 w-full shadow-lg">
                  <h3 className="text-xl font-bold">{guide.name}</h3>
                  <p className="text-primary">Tourist Guide</p>
                  <div className="flex justify-center gap-3 mt-4">
                      <Button variant="outline" size="icon" className="rounded-full"><Facebook className="h-5 w-5"/></Button>
                      <Button variant="outline" size="icon" className="rounded-full"><Twitter className="h-5 w-5"/></Button>
                      <Button variant="outline" size="icon" className="rounded-full"><Instagram className="h-5 w-5"/></Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
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

      {/* Blog Post Section */}
      <section className="py-24 bg-background">
        <div className="container text-center mb-12">
            <div className='flex justify-center items-center gap-2'>
              <Sprout className="w-6 h-6 text-primary" />
              <p className="text-primary font-semibold text-lg">Blog Post</p>
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold mt-2">Our Latest Blog Post</h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-xl mx-auto">
              Content of a page when looking at layout the point of using lorem the is Ipsum less
            </p>
        </div>
        <div className="w-full px-4 md:px-0 md:w-[90vw] mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {blogPosts.map((post, index) => (
                    <div key={index} className="relative rounded-2xl overflow-hidden group h-[500px]">
                        <Image
                            src={post.image}
                            alt={post.title}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                            data-ai-hint={post.imageHint}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                        <div className="absolute bottom-0 left-0 p-6 text-white">
                            <h3 className="text-2xl font-bold mb-4">{post.title}</h3>
                            <div className="flex items-center gap-4 text-sm">
                                <div className="flex items-center gap-2">
                                    <CalendarDays className="w-4 h-4" />
                                    <span>{post.date}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <MessageCircle className="w-4 h-4" />
                                    <span>{post.comments} Comments</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </section>
    </div>
  );
}
