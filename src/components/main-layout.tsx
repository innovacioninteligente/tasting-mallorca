'use client';

import { usePathname } from 'next/navigation';
import { Header } from '@/components/header';
import { type getDictionary } from '@/dictionaries/get-dictionary';
import { type Locale } from '@/dictionaries/config';
import { WhatsAppButton } from './whatsapp-button';

export function MainLayout({ 
    children, 
    dictionary, 
    lang,
    footer
}: { 
    children: React.ReactNode, 
    dictionary: Awaited<ReturnType<typeof getDictionary>>, 
    lang: Locale,
    footer: React.ReactNode
}) {
  const pathname = usePathname();
  const isDashboard = pathname.includes('/dashboard');

  return (
    <>
      {!isDashboard && <Header dictionary={dictionary.header} lang={lang} />}
      <main className="flex-grow">
        {children}
      </main>
      {!isDashboard && footer}
      {!isDashboard && <WhatsAppButton />}
    </>
  );
}
