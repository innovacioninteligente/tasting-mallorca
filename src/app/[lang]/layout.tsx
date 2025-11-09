
import '../globals.css';
import { Toaster } from "@/components/ui/toaster";
import { Poppins } from 'next/font/google';
import { getDictionary } from '@/dictionaries/get-dictionary';
import { Locale } from '@/dictionaries/config';
import { FirebaseProvider } from '@/firebase/provider';
import { MainLayout } from '@/components/main-layout';


const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-poppins',
});

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { lang: Locale };
}) {
  const dictionary = await getDictionary(params.lang);

  return (
    <html lang={params.lang} className={`${poppins.variable}`}>
      <body className="font-body antialiased bg-background text-foreground">
        <FirebaseProvider>
          <div className="flex flex-col min-h-screen">
            <MainLayout dictionary={dictionary} lang={params.lang}>
              {children}
            </MainLayout>
          </div>
          <Toaster />
        </FirebaseProvider>
      </body>
    </html>
  );
}
