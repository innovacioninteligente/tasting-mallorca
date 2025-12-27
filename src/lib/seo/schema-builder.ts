import { Tour } from '@/backend/tours/domain/tour.model';
import { BlogPost } from '@/backend/blog/domain/blog.model';
import { Locale } from '@/dictionaries/config';

type SchemaType = 'TouristTrip' | 'Product' | 'BlogPosting' | 'Organization' | 'WebSite' | 'WebPage' | 'FAQPage';

interface BaseSchema {
    '@context': 'https://schema.org';
    '@type': SchemaType;
    [key: string]: any;
}

export class SchemaBuilder {
    static generateTourSchema(tour: Tour, lang: Locale): BaseSchema {
        const title = tour.title[lang] || tour.title.en;
        const description = tour.description[lang] || tour.description.en;
        const currency = 'EUR';
        const price = tour.price;

        const productSchema = {
            '@type': 'Product',
            'name': title,
            'description': description,
            'image': tour.mainImage,
            'offers': {
                '@type': 'Offer',
                'priceCurrency': currency,
                'price': price,
                'availability': 'https://schema.org/InStock',
                'url': `https://tastingmallorca.com/${lang}/tours/${tour.slug[lang] || tour.slug.en}`
            }
        };

        return {
            '@context': 'https://schema.org',
            '@type': 'TouristTrip',
            'name': title,
            'description': description,
            'image': tour.mainImage,
            'touristType': [
                "Foodie",
                "Culture"
            ],
            'itinerary': tour.itinerary?.map(item => ({
                '@type': 'City', // Simplified for now, could be TouristAttraction
                'name': item.title[lang] || item.title.en,
                'description': item.activities?.[lang]?.join(', ') || ''
            })),
            'offers': productSchema.offers,
            'subjectOf': productSchema // Linking Product as subject
        };
    }

    static generateBlogPostSchema(post: BlogPost, lang: Locale): BaseSchema {
        const title = post.title[lang] || post.title.en;
        const summary = post.summary[lang] || post.summary.en;
        const slug = post.slug[lang] || post.slug.en;

        return {
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            'headline': title,
            'image': post.mainImage,
            'author': {
                '@type': 'Person',
                'name': post.author
            },
            'publisher': {
                '@type': 'Organization',
                'name': 'Tasting Mallorca',
                'logo': {
                    '@type': 'ImageObject',
                    'url': 'https://firebasestorage.googleapis.com/v0/b/tasting-mallorca.firebasestorage.app/o/web%2Fbranding%2FICONO-AZUL.png?alt=media&token=5f6b7c16-5a14-4d45-bbdb-f3a70138e8b7'
                }
            },
            'datePublished': new Date(post.publishedAt).toISOString(),
            'dateModified': new Date(post.publishedAt).toISOString(), // Assuming modified is same for now
            'description': summary,
            'mainEntityOfPage': {
                '@type': 'WebPage',
                '@id': `https://tastingmallorca.com/${lang}/blog/${slug}`
            }
        };
    }

    static generateOrganizationSchema(): BaseSchema {
        return {
            '@context': 'https://schema.org',
            '@type': 'Organization',
            'name': 'Tasting Mallorca',
            'url': 'https://tastingmallorca.com',
            'logo': 'https://firebasestorage.googleapis.com/v0/b/tasting-mallorca.firebasestorage.app/o/web%2Fbranding%2FICONO-AZUL.png?alt=media&token=5f6b7c16-5a14-4d45-bbdb-f3a70138e8b7',
            'sameAs': [
                'https://www.instagram.com/tastingmallorca',
                'https://www.facebook.com/tastingmallorca'
            ],
            'contactPoint': {
                '@type': 'ContactPoint',
                'telephone': '+34 666 66 66 66', // Placeholder, should be updated
                'contactType': 'customer service',
                'areaServed': 'ES',
                'availableLanguage': ['English', 'Spanish', 'German', 'French', 'Dutch']
            }
        };
    }

    static generateWebsiteSchema(): BaseSchema {
        return {
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            'name': 'Tasting Mallorca',
            'url': 'https://tastingmallorca.com',
            'potentialAction': {
                '@type': 'SearchAction',
                'target': 'https://tastingmallorca.com/search?q={search_term_string}',
                'query-input': 'required name=search_term_string'
            }
        };
    }

    static generateWebPageSchema(title: string, description: string, url: string): BaseSchema {
        return {
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            'name': title,
            'description': description,
            'url': url
        };
    }

    static generateFAQSchema(faqs: { question: string, answer: string }[]): BaseSchema {
        return {
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            'mainEntity': faqs.map(faq => ({
                '@type': 'Question',
                'name': faq.question,
                'acceptedAnswer': {
                    '@type': 'Answer',
                    'text': faq.answer
                }
            }))
        };
    }
}
