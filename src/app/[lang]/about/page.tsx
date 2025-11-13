
import Image from 'next/image';
import { Sprout, Mountain, Users } from 'lucide-react';
import { Metadata } from 'next';
import { getDictionary } from '@/dictionaries/get-dictionary';
import { Locale } from '@/dictionaries/config';

interface PageProps {
  params: {
    lang: Locale;
  };
}

export async function generateMetadata({ params: { lang } }: PageProps): Promise<Metadata> {
    const dictionary = await getDictionary(lang);
    const { title, subtitle } = dictionary.about.header;
    const imageUrl = "https://firebasestorage.googleapis.com/v0/b/tasting-mallorca.firebasestorage.app/o/web%2Fimages%2F036.PNG?alt=media&token=00e634e2-716f-495d-807e-5c15dfe2ea09";


    return {
        title: `${title} | Tasting Mallorca`,
        description: subtitle,
         openGraph: {
            title: `${title} | Tasting Mallorca`,
            description: subtitle,
            images: [
                {
                    url: imageUrl,
                    width: 1200,
                    height: 630,
                    alt: title,
                },
            ],
            locale: lang,
            type: 'website',
        },
        twitter: {
            card: 'summary_large_image',
            title: `${title} | Tasting Mallorca`,
            description: subtitle,
            images: [imageUrl],
        },
    };
}


export default async function AboutPage({ params: { lang } }: PageProps) {
  const dictionary = await getDictionary(lang);
  const t = dictionary.about;

  return (
    <div className="bg-background text-foreground">
      <header className="relative h-[60vh] w-full">
        <Image
          src="https://firebasestorage.googleapis.com/v0/b/tasting-mallorca.firebasestorage.app/o/web%2FFotos%20About%20Us%2FDJI_0386-Mejorado-NR.jpg?alt=media&token=12f896cc-77bc-4c24-b486-72b0d9233355"
          alt="Tasting Mallorca Team"
          fill
          className="object-cover"
          data-ai-hint="team work meeting"
        />
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-5xl md:text-7xl font-extrabold">{t.header.title}</h1>
            <p className="mt-4 text-xl">{t.header.subtitle}</p>
          </div>
        </div>
      </header>

      <main className="w-full md:w-[90vw] mx-auto px-4 py-16">
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="order-2 lg:order-1">
            <h2 className="text-primary font-cursive font-bold text-2xl">{t.philosophy.preTitle}</h2>
            <h3 className="text-4xl md:text-5xl font-extrabold mt-2">{t.philosophy.title}</h3>
            <p className="mt-6 text-lg text-muted-foreground">
             {t.philosophy.paragraph1}
            </p>
            <p className="mt-4 text-lg text-muted-foreground">
              {t.philosophy.paragraph2}
            </p>
          </div>
          <div className="order-1 lg:order-2 h-96 relative rounded-2xl overflow-hidden">
            <Image
              src="https://firebasestorage.googleapis.com/v0/b/tasting-mallorca.firebasestorage.app/o/web%2FFotos%20About%20Us%2FDSC08039-Mejorado-NR-2.jpg?alt=media&token=c6c83d63-48e5-4ebc-b5b3-e02577d7bb9a"
              alt="Local guide showing a product"
              fill
              className="object-cover"
              data-ai-hint="local guide product"
            />
          </div>
        </section>

        <section className="py-24 text-center">
            <h2 className="text-4xl md:text-5xl font-extrabold">{t.pillars.title}</h2>
            <p className="mt-4 text-xl text-muted-foreground max-w-3xl mx-auto">
                {t.pillars.subtitle}
            </p>
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-12">
                <div className="flex flex-col items-center">
                    <div className="bg-primary/10 text-primary h-20 w-20 rounded-full flex items-center justify-center mb-4">
                        <Sprout className="h-10 w-10" />
                    </div>
                    <h3 className="text-2xl font-bold">{t.pillars.authenticity.title}</h3>
                    <p className="mt-2 text-muted-foreground">
                        {t.pillars.authenticity.description}
                    </p>
                </div>
                <div className="flex flex-col items-center">
                    <div className="bg-primary/10 text-primary h-20 w-20 rounded-full flex items-center justify-center mb-4">
                        <Mountain className="h-10 w-10" />
                    </div>
                    <h3 className="text-2xl font-bold">{t.pillars.sustainability.title}</h3>
                    <p className="mt-2 text-muted-foreground">
                        {t.pillars.sustainability.description}
                    </p>
                </div>
                <div className="flex flex-col items-center">
                    <div className="bg-primary/10 text-primary h-20 w-20 rounded-full flex items-center justify-center mb-4">
                        <Users className="h-10 w-10" />
                    </div>
                    <h3 className="text-2xl font-bold">{t.pillars.smallGroups.title}</h3>
                    <p className="mt-2 text-muted-foreground">
                        {t.pillars.smallGroups.description}
                    </p>
                </div>
            </div>
        </section>
      </main>
    </div>
  );
}
