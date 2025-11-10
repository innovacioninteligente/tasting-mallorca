
import { findAllTours } from "@/app/server-actions/tours/findTours";
import { TourCard } from "@/components/tour-card";
import { Tour } from "@/backend/tours/domain/tour.model";
import { Locale } from "@/dictionaries/config";
import { Ticket } from "lucide-react";

export default async function ToursPage({ params }: { params: { lang: Locale }}) {
  const result = await findAllTours({});
  const tours = (result.data || []).filter(tour => tour.published) as Tour[];

  return (
    <div className="bg-background text-foreground">
        <div className="container mx-auto px-4 py-16">
            <div className="text-center mb-12">
                <Ticket className="mx-auto h-16 w-16 text-primary mb-4" />
                <h1 className="text-5xl md:text-6xl font-bold font-headline">Todos Nuestros Tours</h1>
                <p className="mt-4 text-xl text-muted-foreground max-w-3xl mx-auto">
                    Explora nuestra selección completa de experiencias auténticas en Mallorca. Cada tour está diseñado para mostrarte la verdadera alma de la isla.
                </p>
            </div>

            {tours.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {tours.map((tour) => (
                        <TourCard key={tour.id} tour={tour} lang={params.lang} />
                    ))}
                </div>
            ) : (
                 <div className="text-center py-12 border-2 border-dashed rounded-lg">
                    <h3 className="text-lg font-medium text-muted-foreground">No hay tours disponibles en este momento.</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                        Estamos trabajando en nuevas y emocionantes experiencias. ¡Vuelve pronto!
                    </p>
                </div>
            )}
        </div>
    </div>
  );
}
