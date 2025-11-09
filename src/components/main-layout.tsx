
'use client';

import { usePathname } from 'next/navigation';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { type getDictionary } from '@/dictionaries/get-dictionary';
import { type Locale } from '@/dictionaries/config';
import { WhatsAppButton } from './whatsapp-button';

export function MainLayout({ 
    children, 
    dictionary, 
    lang 
}: { 
    children: React.ReactNode, 
    dictionary: Awaited<ReturnType<typeof getDictionary>>, 
    lang: Locale 
}) {
  const pathname = usePathname();
  const isDashboard = pathname.includes('/dashboard');
  const isTourDetail = /^\/[a-z]{2}\/tours\/.+/.test(pathname);

  const showWhatsAppButton = !isDashboard && !isTourDetail;

  return (
    <>
      {!isDashboard && <Header dictionary={dictionary.header} lang={lang} />}
      <main className="flex-grow">
        {children}
      </main>
      {!isDashboard && <Footer />}
      {showWhatsAppButton && <WhatsAppButton />}
    </>
  );
}
