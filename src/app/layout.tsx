
import type { Metadata } from 'next';
import { i18n } from '@/dictionaries/config';

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ lang: locale }));
}

export const metadata: Metadata = {
  title: 'Tasting Mallorca Tours',
  description: 'Tours auténticos, sin prisa. Descubre la Mallorca real con nosotros.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body>{children}</body>
    </html>
  );
}
