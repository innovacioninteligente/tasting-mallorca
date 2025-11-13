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

export default function AboutPage() {
  return (
    <div className="bg-background text-foreground">
      <header className="relative h-[60vh] w-full">
        <Image
          src="https://picsum.photos/seed/about-header/1600/900"
          alt="Equipo de Tasting Mallorca"
          fill
          className="object-cover"
          data-ai-hint="team work meeting"
        />
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-5xl md:text-7xl font-extrabold">Sobre Nosotros</h1>
            <p className="mt-4 text-xl">Conectando viajeros con el alma de Mallorca</p>
          </div>
        </div>
      </header>

      <main className="w-full md:w-[90vw] mx-auto px-4 py-16">
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="order-2 lg:order-1">
            <h2 className="text-primary font-cursive font-bold text-2xl">Nuestra Filosofía</h2>
            <h3 className="text-4xl md:text-5xl font-extrabold mt-2">Más que un Tour, una Conexión Auténtica</h3>
            <p className="mt-6 text-lg text-muted-foreground">
              En Tasting Mallorca, creemos que viajar es mucho más que visitar lugares; es sentir, conectar y vivir. Nacimos de la pasión por nuestra isla, con el deseo de mostrar la Mallorca que amamos: la de los pueblos tranquilos, los paisajes vírgenes y las tradiciones que perduran.
            </p>
            <p className="mt-4 text-lg text-muted-foreground">
              Nos alejamos de las rutas convencionales para ofrecerte experiencias inmersivas en grupos reducidos. Queremos que saborees un plato cocinado con calma, que escuches las historias de nuestra gente y que te lleves un recuerdo imborrable, no solo una foto.
            </p>
          </div>
          <div className="order-1 lg:order-2 h-96 relative rounded-2xl overflow-hidden">
            <Image
              src="https://picsum.photos/seed/about-philosophy/600/800"
              alt="Guía local mostrando un producto"
              fill
              className="object-cover"
              data-ai-hint="local guide product"
            />
          </div>
        </section>

        <section className="py-24 text-center">
            <h2 className="text-4xl md:text-5xl font-extrabold">Nuestros Pilares</h2>
            <p className="mt-4 text-xl text-muted-foreground max-w-3xl mx-auto">
                Estos son los valores que guían cada una de nuestras experiencias.
            </p>
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-12">
                <div className="flex flex-col items-center">
                    <div className="bg-primary/10 text-primary h-20 w-20 rounded-full flex items-center justify-center mb-4">
                        <Sprout className="h-10 w-10" />
                    </div>
                    <h3 className="text-2xl font-bold">Autenticidad</h3>
                    <p className="mt-2 text-muted-foreground">
                        Experiencias 100% locales, desde la comida hasta las conversaciones.
                    </p>
                </div>
                <div className="flex flex-col items-center">
                    <div className="bg-primary/10 text-primary h-20 w-20 rounded-full flex items-center justify-center mb-4">
                        <Mountain className="h-10 w-10" />
                    </div>
                    <h3 className="text-2xl font-bold">Sostenibilidad</h3>
                    <p className="mt-2 text-muted-foreground">
                        Apoyamos a los productores y artesanos locales, cuidando nuestro entorno.
                    </p>
                </div>
                <div className="flex flex-col items-center">
                    <div className="bg-primary/10 text-primary h-20 w-20 rounded-full flex items-center justify-center mb-4">
                        <Users className="h-10 w-10" />
                    </div>
                    <h3 className="text-2xl font-bold">Grupos Reducidos</h3>
                    <p className="mt-2 text-muted-foreground">
                        Un trato cercano y personal para una experiencia más profunda e íntima.
                    </p>
                </div>
            </div>
        </section>
      </main>
    </div>
  );
}
