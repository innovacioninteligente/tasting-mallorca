
import { Tour } from '@/backend/tours/domain/tour.model';
import { BlogPost } from '@/backend/blog/domain/blog.model';
import { type Trip, type WithContext, type BlogPosting, type Organization, type WebSite, type FAQPage, type BreadcrumbList } from 'schema-dts';

type Locale = string;

export class SchemaBuilder {
    private baseUrl: string;

    constructor(baseUrl: string = process.env.NEXT_PUBLIC_BASE_URL || 'https://tastingmallorca.com') {
        this.baseUrl = baseUrl;
    }

    generateTourSchema(tour: Tour, lang: Locale): WithContext<Trip> {
        const localeTitle = tour.title[lang] || tour.title['en'];
        const localeDescription = tour.description[lang] || tour.description['en'];
        const url = `${this.baseUrl}/${lang}/tours/${tour.slug[lang] || tour.slug['en']}`;

        const schema: WithContext<Trip> = {
            '@context': 'https://schema.org',
            '@type': 'Trip',
            name: localeTitle,
            description: localeDescription,
            url: url,
            image: tour.mainImage,
            offers: {
                '@type': 'Offer',
                price: tour.price,
                priceCurrency: 'EUR',
                availability: 'https://schema.org/InStock',
                url: url
            },
            provider: {
                '@type': 'Organization',
                name: 'Tasting Mallorca',
                url: this.baseUrl,
                logo: `${this.baseUrl}/images/logo.png`
            },
            itinerary: tour.itinerary?.map(item => ({
                '@type': 'City', // Simplified for now, could be TouristAttraction if we had specific types
                name: item.title[lang] || item.title['en'],
                description: item.activities?.[lang as keyof typeof item.activities]?.join(', ') || ''
            }))
        };

        return schema;
    }

    generateBlogPostSchema(post: BlogPost, lang: Locale): WithContext<BlogPosting> {
        const localeTitle = post.title[lang] || post.title['en'];
        const localeSummary = post.summary[lang] || post.summary['en'];
        const url = `${this.baseUrl}/${lang}/blog/${post.slug[lang] || post.slug['en']}`;

        return {
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            headline: localeTitle,
            description: localeSummary,
            image: post.mainImage,
            author: {
                '@type': 'Person',
                name: post.author
            },
            publisher: {
                '@type': 'Organization',
                name: 'Tasting Mallorca',
                logo: {
                    '@type': 'ImageObject',
                    url: `${this.baseUrl}/images/logo.png`
                }
            },
            datePublished: new Date(post.publishedAt).toISOString(),
            url: url,
            mainEntityOfPage: {
                '@type': 'WebPage',
                '@id': url
            }
        };
    }

    generateOrganizationSchema(): WithContext<Organization> {
        return {
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: 'Tasting Mallorca',
            url: this.baseUrl,
            logo: `${this.baseUrl}/images/logo.png`,
            sameAs: [
                'https://www.facebook.com/tastingmallorca',
                'https://www.instagram.com/tastingmallorca'
            ],
            contactPoint: {
                '@type': 'ContactPoint',
                telephone: '+34 123 456 789', // Replace with actual number
                contactType: 'customer service'
            }
        };
    }

    generateWebsiteSchema(): WithContext<WebSite> {
        return {
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: 'Tasting Mallorca',
            url: this.baseUrl,
            potentialAction: {
                '@type': 'SearchAction',
                target: `${this.baseUrl}/search?q={search_term_string}`,
                'query-input': 'required name=search_term_string'
            } as any
        };
    }

    generateFAQSchema(faqs: { question: string; answer: string }[]): WithContext<FAQPage> {
        return {
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: faqs.map(faq => ({
                '@type': 'Question',
                name: faq.question,
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: faq.answer
                }
            }))
        };
    }

    generateBreadcrumbSchema(items: { name: string; item: string }[]): WithContext<BreadcrumbList> {
        return {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: items.map((item, index) => ({
                '@type': 'ListItem',
                position: index + 1,
                name: item.name,
                item: item.item.startsWith('http') ? item.item : `${this.baseUrl}${item.item}`
            }))
        };
    }
}

export const schemaBuilder = new SchemaBuilder();
