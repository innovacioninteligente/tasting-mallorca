
'use client';

import {
  APIProvider,
  Map,
  useMap,
  AdvancedMarker,
} from '@vis.gl/react-google-maps';
import { useEffect, useState } from 'react';
import { Button } from './ui/button';
import { Car, Footprints, Bike, Bus } from 'lucide-react';
import { cn } from '@/lib/utils';

type TravelMode = 'DRIVING' | 'WALKING' | 'BICYCLING' | 'TRANSIT';

function Directions({
  origin,
  destination,
}: {
  origin: google.maps.LatLngLiteral;
  destination: google.maps.LatLngLiteral;
}) {
  const map = useMap();
  const [directionsService, setDirectionsService] =
    useState<google.maps.DirectionsService | null>(null);
  const [directionsRenderer, setDirectionsRenderer] =
    useState<google.maps.DirectionsRenderer | null>(null);
  const [routes, setRoutes] = useState<google.maps.DirectionsRoute[]>([]);
  const [routeIndex] = useState(0);
  const selectedRoute = routes[routeIndex];
  const leg = selectedRoute?.legs[0];
  const [error, setError] = useState<string | null>(null);
  const [travelMode, setTravelMode] = useState<TravelMode>('DRIVING');

  useEffect(() => {
    if (!map) return;
    setDirectionsService(new window.google.maps.DirectionsService());
    setDirectionsRenderer(
      new window.google.maps.DirectionsRenderer({
        map,
        suppressMarkers: true, // IMPORTANT: We want to show our own custom markers
        preserveViewport: false,
      })
    );
  }, [map]);


  useEffect(() => {
    if (!directionsService || !directionsRenderer || !origin || !destination)
      return;

    directionsService
      .route({
        origin: origin,
        destination: destination,
        travelMode: travelMode as google.maps.TravelMode,
      })
      .then((response) => {
        directionsRenderer.setDirections(response);
        setRoutes(response.routes);
        setError(null);
      })
      .catch((e) => {
        console.error(`Directions request failed for mode ${travelMode}`, e);
        if ((e as any).code === 'REQUEST_DENIED') {
          setError("API Error: Request Denied");
        } else if ((e as any).code === 'ZERO_RESULTS') {
          setError(`No route found for ${travelMode}`);
        } else {
          setError("Could not calculate route.");
        }
        setRoutes([]);
      });
  }, [directionsService, directionsRenderer, origin, destination, travelMode]);

  return (
    <>
      <div className="absolute top-2 left-1/2 -translate-x-1/2 z-10 bg-background p-1 rounded-md shadow-lg flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTravelMode('DRIVING')}
          className={cn("h-10 w-10", travelMode === 'DRIVING' && 'bg-primary/20 text-primary')}
        >
          <Car className="h-5 w-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTravelMode('WALKING')}
          className={cn("h-10 w-10", travelMode === 'WALKING' && 'bg-primary/20 text-primary')}
        >
          <Footprints className="h-5 w-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTravelMode('BICYCLING')}
          className={cn("h-10 w-10", travelMode === 'BICYCLING' && 'bg-primary/20 text-primary')}
        >
          <Bike className="h-5 w-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTravelMode('TRANSIT')}
          className={cn("h-10 w-10", travelMode === 'TRANSIT' && 'bg-primary/20 text-primary')}
        >
          <Bus className="h-5 w-5" />
        </Button>
      </div>

      {leg && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-10 bg-background p-2 px-4 rounded-md shadow-lg">
          <p className="text-sm font-semibold">
            {leg.distance?.text} <span className="text-muted-foreground font-normal">({leg.duration?.text})</span>
          </p>
        </div>
      )}

      {origin && <AdvancedMarker position={origin} title="Tu hotel" />}
      {destination && <AdvancedMarker position={destination} title="Punto de encuentro" />}

      {error && routes.length === 0 && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 bg-destructive text-destructive-foreground p-2 rounded-md shadow-lg text-sm">
          {error}
        </div>
      )}
    </>
  );
}

interface RouteMapProps {
  origin?: google.maps.LatLngLiteral;
  destination?: google.maps.LatLngLiteral;
  className?: string;
}

export function RouteMap({ origin, destination, className }: RouteMapProps) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    return <div className="flex items-center justify-center h-full bg-destructive text-destructive-foreground p-4">Error: Google Maps API Key is missing.</div>;
  }

  if (!origin || !destination) {
    return <div className="flex items-center justify-center h-full bg-muted/30 text-muted-foreground text-sm">Proporciona un origen y destino.</div>;
  }

  return (
    <div className={cn("w-full h-full min-h-[300px] relative rounded-lg overflow-hidden", className)}>
      <APIProvider apiKey={apiKey} libraries={['marker', 'routes', 'geocoding']}>
        <Map
          defaultCenter={origin}
          defaultZoom={12}
          gestureHandling={'greedy'}
          disableDefaultUI={true}
          mapId={'f91b1312758f731c'}
          className="relative w-full h-full"
        >
          <Directions origin={origin} destination={destination} />
        </Map>
      </APIProvider>
    </div>
  );
}
