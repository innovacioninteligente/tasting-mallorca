'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Mail, Phone, MessageCircle, Send } from 'lucide-react';
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
    const pageTitle = dictionary.header.contact;
    const pageDescription = "Do you have any questions or want to book a custom tour? We're here to help.";
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

export default function ContactPage() {
  return (
    <div className="bg-background text-foreground">
      <div className="container mx-auto px-4 py-16 w-full md:w-[90vw]">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold font-headline">Contáctanos</h1>
          <p className="mt-4 text-xl text-muted-foreground max-w-3xl mx-auto">
            ¿Tienes alguna pregunta o quieres reservar un tour personalizado? Estamos aquí para ayudarte.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Contact Form */}
          <div className="bg-card p-8 rounded-2xl shadow-lg border border-border/50">
            <h2 className="text-3xl font-bold mb-6">Envíanos un Mensaje</h2>
            <form className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-muted-foreground mb-1">Nombre</label>
                <Input id="name" placeholder="Tu nombre completo" />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-muted-foreground mb-1">Email</label>
                <Input id="email" type="email" placeholder="tu@email.com" />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-muted-foreground mb-1">Mensaje</label>
                <Textarea id="message" placeholder="Escribe tu consulta aquí..." rows={5} />
              </div>
              <Button size="lg" className="w-full font-bold text-lg">
                <Send className="mr-2 h-5 w-5" />
                Enviar Mensaje
              </Button>
            </form>
          </div>

          {/* Contact Actions */}
          <div className="space-y-8">
             <h2 className="text-3xl font-bold mb-6">Otras Formas de Contacto</h2>
            <a href="mailto:info@tastingmallorca.com" className="block">
              <div className="bg-card p-6 rounded-2xl shadow-lg border border-border/50 flex items-center gap-6 hover:border-primary transition-colors">
                <div className="bg-primary/10 text-primary h-16 w-16 rounded-full flex items-center justify-center flex-shrink-0">
                  <Mail className="h-8 w-8" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">Email</h3>
                  <p className="text-muted-foreground text-lg">info@tastingmallorca.com</p>
                </div>
              </div>
            </a>
            <a href="tel:+34606830376" className="block">
              <div className="bg-card p-6 rounded-2xl shadow-lg border border-border/50 flex items-center gap-6 hover:border-primary transition-colors">
                <div className="bg-primary/10 text-primary h-16 w-16 rounded-full flex items-center justify-center flex-shrink-0">
                  <Phone className="h-8 w-8" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">Teléfono</h3>
                  <p className="text-muted-foreground text-lg">+34 606 830 376</p>
                </div>
              </div>
            </a>
            <a href="https://wa.me/34606830376" target="_blank" rel="noopener noreferrer" className="block">
              <div className="bg-card p-6 rounded-2xl shadow-lg border border-border/50 flex items-center gap-6 hover:border-primary transition-colors">
                <div className="bg-primary/10 text-primary h-16 w-16 rounded-full flex items-center justify-center flex-shrink-0">
                  <MessageCircle className="h-8 w-8" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">WhatsApp</h3>
                  <p className="text-muted-foreground text-lg">Inicia una conversación</p>
                </div>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
