import { Ticket } from 'lucide-react';

export default function ToursPage() {
  return (
    <div className="bg-background text-foreground">
      <div className="container mx-auto px-4 py-16 text-center">
        <Ticket className="mx-auto h-16 w-16 text-primary mb-4" />
        <h1 className="text-5xl md:text-6xl font-bold font-headline">Todos Nuestros Tours</h1>
        <p className="mt-4 text-xl text-muted-foreground max-w-3xl mx-auto">
          Próximamente... Estamos preparando una increíble selección de nuestras mejores experiencias en Mallorca. ¡Vuelve pronto para descubrir todos los detalles!
        </p>
      </div>
    </div>
  );
}
