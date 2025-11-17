

import '../globals.css';
import { Toaster } from "@/components/ui/toaster";
import { Poppins } from 'next/font/google';
import { getDictionary } from '@/dictionaries/get-dictionary';
import { Locale } from '@/dictionaries/config';
import { FirebaseClientProvider } from '@/firebase/client-provider';
import { MainLayout } from '@/components/main-layout';
import { Metadata } from 'next';
import { Footer } from '@/components/footer';
import { AlternateLinksProvider } from '@/context/alternate-links-context';
import { ThemeProvider } from '@/components/theme-provider';
import { CookieConsent } from '@/components/cookie-consent';


const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-poppins',
});

interface RootLayoutProps {
  children: React.ReactNode;
  params: {
    lang: Locale;
  };
}

export async function generateMetadata({ params: { lang } }: RootLayoutProps): Promise<Metadata> {
  const dictionary = await getDictionary(lang);
  const { subtitle } = dictionary.home;
  const imageUrl = "https://firebasestorage.googleapis.com/v0/b/tasting-mallorca.firebasestorage.app/o/web%2Fimages%2F036.PNG?alt=media&token=00e634e2-716f-495d-807e-5c15dfe2ea09";
  const faviconUrl = "https://firebasestorage.googleapis.com/v0/b/tasting-mallorca.firebasestorage.app/o/web%2Fimages%2Flogo-2.png?alt=media&token=2dec9bc9-44e1-409e-bbb1-58805697f1a3";

  return {
    title: {
      default: 'Tasting Mallorca | Authentic Food & Culture Tours',
      template: '%s | Tasting Mallorca',
    },
    description: subtitle,
    icons: {
      icon: faviconUrl,
    },
    openGraph: {
      title: 'Tasting Mallorca | Authentic Food & Culture Tours',
      description: subtitle,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: 'Tasting Mallorca Tours',
        },
      ],
      locale: lang,
      type: 'website',
    },
     twitter: {
      card: 'summary_large_image',
      title: 'Tasting Mallorca | Authentic Food & Culture Tours',
      description: subtitle,
      images: [imageUrl],
    },
  };
}

export default async function RootLayout({
  children,
  params,
}: RootLayoutProps) {
  const { lang } = params;
  const dictionary = await getDictionary(lang);

  return (
    <html lang={lang} className={`${poppins.variable}`} suppressHydrationWarning>
      <body className="font-body antialiased bg-background text-foreground">
        <ThemeProvider>
          <FirebaseClientProvider>
            <AlternateLinksProvider>
              <div className="flex flex-col min-h-screen">
                <MainLayout 
                  dictionary={dictionary} 
                  lang={lang}
                  footer={<Footer dictionary={dictionary.footer} lang={lang} />}
                >
                  {children}
                </MainLayout>
              </div>
              <CookieConsent dictionary={dictionary.cookieConsent} lang={lang} />
            </AlternateLinksProvider>
            <Toaster />
          </FirebaseClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
