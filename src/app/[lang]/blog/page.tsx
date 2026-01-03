
import { findAllBlogPosts } from "@/app/server-actions/blog/findBlogPosts";
import { BlogCard } from "@/components/blog-card";
import { BlogPost } from "@/backend/blog/domain/blog.model";
import { Locale } from "@/dictionaries/config";
import { Newspaper } from "lucide-react";
import { Metadata } from 'next';
import { getDictionary } from '@/dictionaries/get-dictionary';

interface PageProps {
    params: Promise<{
        lang: Locale;
    }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { lang } = await params;
    const dictionary = await getDictionary(lang);
    const pageTitle = dictionary.header.blog;
    const pageDescription = "Explore our articles, stories, and tips about Mallorca. Everything you need to know for your next trip.";
    const imageUrl = "https://firebasestorage.googleapis.com/v0/b/tasting-mallorca.firebasestorage.app/o/web%2Fimages%2F036.PNG?alt=media&token=00e634e2-716f-495d-807e-5c15dfe2ea09";

    return {
        title: `${pageTitle} | Tasting Mallorca`,
        description: pageDescription,
        openGraph: {
            title: `${pageTitle} | Tasting Mallorca`,
            description: pageDescription,
            images: [
                {
                    url: imageUrl,
                    width: 1200,
                    height: 630,
                    alt: pageTitle,
                },
            ],
            locale: lang,
            type: 'website',
        },
        twitter: {
            card: 'summary_large_image',
            title: `${pageTitle} | Tasting Mallorca`,
            description: pageDescription,
            images: [imageUrl],
        },
    };
}


export default async function BlogPage({ params }: PageProps) {
    const { lang } = await params;
    const dictionary = await getDictionary(lang);
    const result = await findAllBlogPosts({});
    const posts = (result.data || []).filter(post => post.published) as BlogPost[];

    return (
        <div className="bg-background text-foreground">
            <div className="container mx-auto px-4 py-16">
                <div className="text-center mb-12">
                    <Newspaper className="mx-auto h-16 w-16 text-primary mb-4" />
                    <h1 className="text-5xl md:text-6xl font-bold font-headline">{dictionary.blog.title}</h1>
                    <p className="mt-4 text-xl text-muted-foreground max-w-3xl mx-auto">
                        {dictionary.blog.description}
                    </p>
                </div>

                {posts.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {posts.map((post) => (
                            <BlogCard key={post.id} post={post} lang={lang} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 border-2 border-dashed rounded-lg">
                        <h3 className="text-lg font-medium text-muted-foreground">Aún no hay artículos disponibles.</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                            Estamos preparando contenido fascinante. ¡Vuelve pronto!
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
