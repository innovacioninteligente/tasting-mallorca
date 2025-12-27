
import { findAllTours } from "@/app/server-actions/tours/findTours";
import { TourCard } from "@/components/tour-card";
import { Tour } from "@/backend/tours/domain/tour.model";
import { Locale } from "@/dictionaries/config";
import { Ticket } from "lucide-react";
import { Metadata } from 'next';
import { getDictionary } from '@/dictionaries/get-dictionary';

interface PageProps {
    params: {
        lang: Locale;
    };
}

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }): Promise<Metadata> {
    const { lang } = await params;
    const dictionary = await getDictionary(lang);
    const pageTitle = dictionary.header.tours;
    const pageDescription = "Explore our complete selection of authentic experiences in Mallorca. Every tour is designed to show you the true soul of the island.";
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

export default async function ToursPage({ params }: { params: Promise<{ lang: Locale }> }) {
    const { lang } = await params;
    const dictionary = await getDictionary(lang);
    const result = await findAllTours({});
    const tours = (result.data || []).filter(tour => tour.published) as Tour[];

    return (
        <div className="bg-background text-foreground">
            <div className="container mx-auto px-4 py-16">
                <div className="text-center mb-12">
                    <Ticket className="mx-auto h-16 w-16 text-primary mb-4" />
                    <h1 className="text-5xl md:text-6xl font-bold font-headline">{dictionary.header.tours}</h1>
                    <p className="mt-4 text-xl text-muted-foreground max-w-3xl mx-auto">
                        {dictionary.tours[0].description}
                    </p>
                </div>

                {tours.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {tours.map((tour) => (
                            <TourCard key={tour.id} tour={tour} lang={lang} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 border-2 border-dashed rounded-lg">
                        <h3 className="text-lg font-medium text-muted-foreground">No hay tours disponibles en este momento.</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                            Estamos trabajando en nuevas y emocionantes experiencias. ¡Vuelve pronto!
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
