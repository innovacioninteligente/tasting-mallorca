
'use client';

import { type getDictionary } from '@/dictionaries/get-dictionary';
import { HeroSection } from '@/components/home/hero-section';
import { ImmersiveCarouselSection } from '@/components/home/immersive-carousel-section';
import { TopDestinationsSection } from '@/components/home/top-destinations-section';
import { WhatsIncludedSection } from '@/components/home/whats-included-section';
import { WhyChooseUsSection } from '@/components/home/why-choose-us-section';
import { FeaturedToursSection } from '@/components/home/featured-tours-section';
import { GallerySection } from '@/components/home/gallery-section';
import { HappyCustomersSection } from '@/components/home/happy-customers-section';
import { TourGuidesSection } from '@/components/home/tour-guides-section';
import { TestimonialsSection } from '@/components/home/testimonials-section';
import { BlogSection } from '@/components/home/blog-section';
import { type Locale } from '@/dictionaries/config';


export default function HomeClientPage({
  dictionary,
  lang,
}: {
  dictionary: Awaited<ReturnType<typeof getDictionary>>;
  lang: Locale;
}) {
  return (
    <div className="flex flex-col bg-background">
      <HeroSection dictionary={dictionary.home} />
      <ImmersiveCarouselSection />
      <FeaturedToursSection dictionary={dictionary} lang={lang} />
      <WhatsIncludedSection dictionary={dictionary.whatsIncluded} />
      <WhyChooseUsSection dictionary={dictionary.whyChooseUs} />
      <GallerySection dictionary={dictionary.gallery} />
      <HappyCustomersSection dictionary={dictionary.happyCustomers} />
      <TopDestinationsSection dictionary={dictionary.destinations} />
      <TourGuidesSection dictionary={dictionary.tourGuides} />
      <TestimonialsSection dictionary={dictionary.testimonials} />
      <BlogSection dictionary={dictionary.blog} />
    </div>
  );
}
