import { i18n } from '@/dictionaries/config';
import type { Metadata } from 'next';

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ lang: locale }));
}

export const metadata: Metadata = {
  title: 'Tasting Mallorca Tours',
  description: 'Tours auténticos, sin prisa. Descubre la Mallorca real con nosotros.',
};

export default function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { lang: string };
}) {
  return (
    <html lang={params.lang}>
      <body>{children}</body>
    </html>
  );
}
