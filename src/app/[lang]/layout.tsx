

import '../globals.css';
import { Toaster } from "@/components/ui/toaster";
import { Poppins } from 'next/font/google';
import localFont from 'next/font/local';
import { getDictionary } from '@/dictionaries/get-dictionary';
import { Locale } from '@/dictionaries/config';
import { FirebaseClientProvider } from '@/firebase/client-provider';
import { MainLayout } from '@/components/main-layout';
import { Metadata } from 'next';
import { Footer } from '@/components/footer';
import { AlternateLinksProvider } from '@/context/alternate-links-context';
import { ThemeProvider } from '@/components/theme-provider';
// import { CookieConsent } from '@/components/cookie-consent';
import { AnalyticsProvider } from '@/components/analytics-provider';
import { ClientCookieConsent } from '@/components/client-cookie-consent';


const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-poppins',
  display: 'swap',
});

const cursive = localFont({
  src: '../../../public/fonts/NathalynDemo.otf',
  variable: '--font-cursive',
  display: 'swap',
});

interface RootLayoutProps {
  children: React.ReactNode;
  params: Promise<{
    lang: Locale;
  }>;
}

export async function generateMetadata({ params }: RootLayoutProps): Promise<Metadata> {
  const { lang } = await params;
  const dictionary = await getDictionary(lang);
  const { subtitle } = dictionary.home;
  const faviconUrl = "https://firebasestorage.googleapis.com/v0/b/tasting-mallorca.firebasestorage.app/o/web%2Fbranding%2FICONO-AZUL.png?alt=media&token=5f6b7c16-5a14-4d45-bbdb-f3a70138e8b7";

  return {
    title: {
      default: 'Tasting Mallorca | Authentic Food & Culture Tours',
      template: '%s | Tasting Mallorca',
    },
    description: subtitle,
    icons: {
      icon: faviconUrl,
    },
    verification: {
      google: 'QnN3dHRfMkm0txTl3OeQebTrLXhdEvodXTA2LSDzVRg',
    },
  };
}

export default async function RootLayout(props: RootLayoutProps) {
  const params = await props.params;
  const { lang } = params;
  const dictionary = await getDictionary(lang);

  return (
    <html lang={lang} className={`${poppins.variable} ${cursive.variable}`} suppressHydrationWarning>
      <body>
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${process.env.NEXT_PUBLIC_GTM_ID}`}
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
        {/* End Google Tag Manager (noscript) */}

        <AnalyticsProvider />
        <ThemeProvider>
          <FirebaseClientProvider>
            <AlternateLinksProvider>
              <div className="flex flex-col min-h-screen">
                <MainLayout
                  dictionary={dictionary}
                  lang={lang}
                  footer={<Footer dictionary={dictionary.footer} lang={lang} />}
                >
                  {props.children}
                </MainLayout>
              </div>
              <ClientCookieConsent dictionary={dictionary.cookieConsent} lang={lang} />
            </AlternateLinksProvider>
            <Toaster />
          </FirebaseClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
