import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Badge } from '@/components/ui/badge';
import { ArrowUpRight, Sprout, Briefcase, Map, CheckCircle, Heart, Star, MapPin, Camera } from 'lucide-react';

const hikerImage = PlaceHolderImages.find(img => img.id === 'hiker-with-backpack');
const travelGirlImage = PlaceHolderImages.find(img => img.id === 'girl-travel-view');
const aboutUsImage = PlaceHolderImages.find(img => img.id === 'hiker-with-backpack');
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


export default function Home() {
  return (
    <div className="flex flex-col bg-background">
      {/* Hero Section */}
      <section className="relative w-full overflow-hidden">
        <div className="container py-20 md:py-32">
          <div className="grid grid-cols-12 gap-8 items-center">
            {/* Left Image & Doodles */}
            <div className="col-span-3 hidden md:flex flex-col items-center justify-end h-full">
              {/* Airplane Doodle */}
              <div className="w-48 h-24 relative self-start -mb-8 ml-4">
                  <Image src="/airplane-doodle.svg" alt="Airplane doodle" fill className="object-contain"/>
              </div>
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
              <h2 className="text-lg font-semibold text-primary mb-2">Welcome to Tasting Mallorca</h2>
              <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter leading-tight">
                Adventure & Experience The Travel
              </h1>
              <p className="mt-6 text-lg text-muted-foreground max-w-md mx-auto">
                The leap into electronic typesetting, remaining essentially unchanged. It was popularised, trust with our company
              </p>
            </div>

            {/* Right Image & Doodles */}
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
              {/* Balloon Doodle */}
              <div className="w-32 h-48 relative self-end -mt-8 mr-4">
                <Image src="/balloon-doodle.svg" alt="Hot air balloon doodle" fill className="object-contain" />
              </div>
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
          <div className="w-[90vw] mx-auto">
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
                    {testimonialAvatar1 && <Image className="inline-block h-12 w-12 rounded-full ring-2 ring-background" src={testimonialAvatar1.imageUrl} alt="User 1" data-ai-hint={testimonialAvatar1.imageHint} width={48} height={48} />}
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
        <div className="w-[90vw] mx-auto">
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
                   <h3 className="text-xl font-bold mb-1">Over {tour.title}</h3>
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
        <div className="container px-4">
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
    </div>
  );
}
