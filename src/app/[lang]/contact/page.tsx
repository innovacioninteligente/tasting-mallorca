
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Mail, Phone, MessageCircle, Send } from 'lucide-react';
import { Metadata } from 'next';
import { getDictionary } from '@/dictionaries/get-dictionary';
import { Locale } from '@/dictionaries/config';

interface PageProps {
  params: Promise<{
    lang: Locale;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang } = await params;
  const dictionary = await getDictionary(lang);
  const { title, description } = dictionary.contact.page;
  const imageUrl = "https://firebasestorage.googleapis.com/v0/b/tasting-mallorca.firebasestorage.app/o/web%2Fimages%2F036.PNG?alt=media&token=00e634e2-716f-495d-807e-5c15dfe2ea09";


  return {
    title: `${title} | Tasting Mallorca`,
    description: description,
    openGraph: {
      title: `${title} | Tasting Mallorca`,
      description: description,
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
      description: description,
      images: [imageUrl],
    },
  };
}


export default async function ContactPage({ params }: PageProps) {
  const { lang } = await params;
  const dictionary = await getDictionary(lang);
  const t = dictionary.contact;

  return (
    <div className="bg-background text-foreground">
      <div className="container mx-auto px-4 py-16 w-full md:w-[80vw]">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold font-headline">{t.page.title}</h1>
          <p className="mt-4 text-xl text-muted-foreground max-w-3xl mx-auto">
            {t.page.description}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Contact Form */}
          <div className="bg-card p-8 rounded-2xl shadow-lg border border-border/50">
            <h2 className="text-3xl font-bold mb-6">{t.form.title}</h2>
            <form className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-muted-foreground mb-1">{t.form.nameLabel}</label>
                <Input id="name" placeholder={t.form.namePlaceholder} />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-muted-foreground mb-1">{t.form.emailLabel}</label>
                <Input id="email" type="email" placeholder={t.form.emailPlaceholder} />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-muted-foreground mb-1">{t.form.messageLabel}</label>
                <Textarea id="message" placeholder={t.form.messagePlaceholder} rows={5} />
              </div>
              <Button size="lg" className="w-full font-bold text-lg">
                <Send className="mr-2 h-5 w-5" />
                {t.form.submitButton}
              </Button>
            </form>
          </div>

          {/* Contact Actions */}
          <div className="space-y-8">
            <h2 className="text-3xl font-bold mb-6">{t.otherMethods.title}</h2>
            <a href="mailto:info@tastingmallorca.com" className="block">
              <div className="bg-card p-6 rounded-2xl shadow-lg border border-border/50 flex items-center gap-6 hover:border-primary transition-colors">
                <div className="bg-primary/10 text-primary h-16 w-16 rounded-full flex items-center justify-center flex-shrink-0">
                  <Mail className="h-8 w-8" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">{t.otherMethods.email.title}</h3>
                  <p className="text-muted-foreground text-lg">{t.otherMethods.email.value}</p>
                </div>
              </div>
            </a>
            <a href="tel:+34606830376" className="block">
              <div className="bg-card p-6 rounded-2xl shadow-lg border border-border/50 flex items-center gap-6 hover:border-primary transition-colors">
                <div className="bg-primary/10 text-primary h-16 w-16 rounded-full flex items-center justify-center flex-shrink-0">
                  <Phone className="h-8 w-8" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">{t.otherMethods.phone.title}</h3>
                  <p className="text-muted-foreground text-lg">{t.otherMethods.phone.value}</p>
                </div>
              </div>
            </a>
            <a href="https://wa.me/34606830376" target="_blank" rel="noopener noreferrer" className="block">
              <div className="bg-card p-6 rounded-2xl shadow-lg border border-border/50 flex items-center gap-6 hover:border-primary transition-colors">
                <div className="bg-primary/10 text-primary h-16 w-16 rounded-full flex items-center justify-center flex-shrink-0">
                  <MessageCircle className="h-8 w-8" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">{t.otherMethods.whatsapp.title}</h3>
                  <p className="text-muted-foreground text-lg">{t.otherMethods.whatsapp.value}</p>
                </div>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
