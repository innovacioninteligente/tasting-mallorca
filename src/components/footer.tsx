
import Link from 'next/link';
import { Mail, Phone, MessageCircle } from 'lucide-react';
import { DictionaryType } from '@/dictionaries/get-dictionary';
import { findAllTours } from '@/app/server-actions/tours/findTours';
import { findAllBlogPosts } from '@/app/server-actions/blog/findBlogPosts';
import { Locale } from '@/dictionaries/config';
import Image from 'next/image';

type FooterProps = {
  dictionary: DictionaryType['footer'];
  lang: Locale;
}

export async function Footer({ dictionary, lang }: FooterProps) {
  const toursResult = await findAllTours({});
  const tours = (toursResult.data || []).filter(t => t.published).slice(0, 4);

  const blogPostsResult = await findAllBlogPosts({});
  const blogPosts = (blogPostsResult.data || []).filter(p => p.published).slice(0, 4);

  return (
    <footer className="bg-secondary text-secondary-foreground py-12">
      <div className="w-full md:w-[80vw] mx-auto px-4 space-y-12">
        
        {/* Top Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="flex flex-col gap-4 lg:col-span-2">
                <Link href={`/${lang}/`} className="flex items-center gap-2 font-semibold" prefetch={false}>
                    <div className="relative h-10 w-10">
                      <Image
                        src="https://firebasestorage.googleapis.com/v0/b/tasting-mallorca.firebasestorage.app/o/web%2Fimages%2Flogo-2.png?alt=media&token=2dec9bc9-44e1-409e-bbb1-58805697f1a3"
                        alt="Tasting Mallorca Logo"
                        fill
                        className="object-contain"
                        sizes="40px"
                      />
                    </div>
                    <span className="text-xl font-bold">Tasting Mallorca</span>
                </Link>
                <p className="text-base">
                    {dictionary.slogan}
                </p>
            </div>
            <div>
                <h3 className="text-xl font-bold mb-4">{dictionary.quickLinks.title}</h3>
                <ul className="space-y-2 text-base">
                    <li><Link href={`/${lang}/tours`} className="hover:text-primary transition-colors">{dictionary.quickLinks.tours}</Link></li>
                    <li><Link href={`/${lang}/about`} className="hover:text-primary transition-colors">{dictionary.quickLinks.about}</Link></li>
                    <li><Link href={`/${lang}/guest-feedback`} className="hover:text-primary transition-colors">{dictionary.quickLinks.guestFeedback}</Link></li>
                    <li><Link href={`/${lang}/contact`} className="hover:text-primary transition-colors">{dictionary.quickLinks.contact}</Link></li>
                </ul>
            </div>
            <div>
                <h3 className="text-xl font-bold mb-4">{dictionary.contactUs.title}</h3>
                <ul className="space-y-3 text-base">
                    <li className="flex items-center gap-3">
                    <Mail className="h-6 w-6 text-primary" />
                    <a href="mailto:info@tastingmallorca.com" className="hover:text-primary transition-colors">info@tastingmallorca.com</a>
                    </li>
                    <li className="flex items-center gap-3">
                    <Phone className="h-6 w-6 text-primary" />
                    <a href="tel:+34606830376" className="hover:text-primary transition-colors">+34 606 830 376</a>
                    </li>
                    <li className="flex items-center gap-3">
                    <MessageCircle className="h-6 w-6 text-primary" />
                    <a href="https://wa.me/34606830376" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">WhatsApp</a>
                    </li>
                </ul>
            </div>
        </div>

        {/* Bottom Row */}
        {(tours.length > 0 || blogPosts.length > 0) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-border pt-8">
                 {tours.length > 0 && (
                    <div>
                        <h3 className="text-xl font-bold mb-4">{dictionary.ourTours}</h3>
                        <ul className="space-y-2 text-base">
                        {tours.map(tour => (
                            <li key={tour.id}>
                            <Link href={`/${lang}/tours/${tour.slug[lang] || tour.slug.en}`} className="hover:text-primary transition-colors">
                                {tour.title[lang] || tour.title.en}
                            </Link>
                            </li>
                        ))}
                        </ul>
                    </div>
                )}

                {blogPosts.length > 0 && (
                    <div>
                        <h3 className="text-xl font-bold mb-4">{dictionary.latestArticles}</h3>
                        <ul className="space-y-2 text-base">
                        {blogPosts.map(post => (
                            <li key={post.id}>
                            <Link href={`/${lang}/blog/${post.slug[lang] || post.slug.en}`} className="hover:text-primary transition-colors">
                                {post.title[lang] || post.title.en}
                            </Link>
                            </li>
                        ))}
                        </ul>
                    </div>
                )}
            </div>
        )}

      </div>
      <div className="w-full md:w-[80vw] mx-auto px-4 text-center mt-12 pt-8 border-t border-border">
        <p className="text-base">&copy; {new Date().getFullYear()} Tasting Mallorca. All rights reserved.</p>
      </div>
    </footer>
  );
}
