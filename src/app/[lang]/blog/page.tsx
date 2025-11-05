import { Newspaper } from 'lucide-react';

export default function BlogPage() {
  return (
    <div className="bg-background text-foreground">
      <div className="container mx-auto px-4 py-16 text-center">
        <Newspaper className="mx-auto h-16 w-16 text-primary mb-4" />
        <h1 className="text-5xl md:text-6xl font-bold font-headline">Nuestro Blog</h1>
        <p className="mt-4 text-xl text-muted-foreground max-w-3xl mx-auto">
          Próximamente... Estamos preparando artículos fascinantes sobre la cultura, gastronomía y secretos de Mallorca. ¡Vuelve pronto!
        </p>
      </div>
    </div>
  );
}
