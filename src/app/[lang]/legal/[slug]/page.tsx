
import { Metadata } from 'next';
import { getDictionary } from '@/dictionaries/get-dictionary';
import { Locale } from '@/dictionaries/config';

interface PageProps {
    params: Promise<{
        lang: Locale;
        slug: 'privacy-policy' | 'cookie-policy' | 'terms-of-service';
    }>;
}

// This component is to avoid TypeScript errors on the content type
const ContentSection = ({ title, content }: { title: string; content: string | string[] }) => {
    return (
        <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-primary">{title}</h2>
            {Array.isArray(content) ? (
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    {content.map((item, index) => <li key={index}>{item}</li>)}
                </ul>
            ) : (
                <p className="text-muted-foreground whitespace-pre-line">{content}</p>
            )}
        </div>
    );
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { lang, slug } = await params;
    const dictionary = await getDictionary(lang);
    let pageData;

    switch (slug) {
        case 'privacy-policy':
            pageData = dictionary.privacyPolicy;
            break;
        case 'cookie-policy':
            pageData = dictionary.cookiePolicy;
            break;
        case 'terms-of-service':
            pageData = dictionary.termsOfService;
            break;
        default:
            return { title: 'Legal Information' };
    }

    return {
        title: `${pageData.title} | Tasting Mallorca`,
        description: `Read our ${pageData.title}.`,
    };
}

export default async function LegalPage({ params }: PageProps) {
    const { lang, slug } = await params;
    const dictionary = await getDictionary(lang);
    let pageData;

    switch (slug) {
        case 'privacy-policy':
            pageData = dictionary.privacyPolicy;
            break;
        case 'cookie-policy':
            pageData = dictionary.cookiePolicy;
            break;
        case 'terms-of-service':
            pageData = dictionary.termsOfService;
            break;
        default:
            return <div className="container mx-auto py-16 text-center">Page not found.</div>;
    }

    return (
        <div className="bg-background text-foreground">
            <div className="container mx-auto px-4 py-16 prose prose-lg dark:prose-invert max-w-4xl">
                <h1 className="text-4xl font-extrabold mb-6">{pageData.title}</h1>
                <p className="text-muted-foreground text-sm mb-8">Last updated: {pageData.lastUpdated}</p>

                {Object.entries(pageData.sections).map(([key, section]) => (
                    <ContentSection key={key} title={section.title} content={section.content} />
                ))}
            </div>
        </div>
    );
}
