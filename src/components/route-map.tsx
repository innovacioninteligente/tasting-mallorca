'use client';

import {
  APIProvider,
  Map,
  Marker,
  useMap,
} from '@vis.gl/react-google-maps';
import { useEffect, useState } from 'react';

type RouteMapProps = {
  originAddress: string;
  destinationAddress: string;
};

type GeocodedResult = google.maps.LatLngLiteral | null;

function Directions({
  origin,
  destination,
}: {
  origin: GeocodedResult;
  destination: GeocodedResult;
}) {
  const map = useMap();
  const [directionsService, setDirectionsService] =
    useState<google.maps.DirectionsService | null>(null);
  const [directionsRenderer, setDirectionsRenderer] =
    useState<google.maps.DirectionsRenderer | null>(null);

  useEffect(() => {
    if (!map) return;
    setDirectionsService(new window.google.maps.DirectionsService());
    setDirectionsRenderer(
      new window.google.maps.DirectionsRenderer({ map })
    );
  }, [map]);

  useEffect(() => {
    if (!directionsService || !directionsRenderer || !origin || !destination)
      return;

    directionsService
      .route({
        origin: origin,
        destination: destination,
        travelMode: google.maps.TravelMode.DRIVING,
      })
      .then((response) => {
        directionsRenderer.setDirections(response);
      })
      .catch((e) => console.error('Directions request failed', e));

  }, [directionsService, directionsRenderer, origin, destination]);

  return null;
}

export function RouteMap({ originAddress, destinationAddress }: RouteMapProps) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const [origin, setOrigin] = useState<GeocodedResult>(null);
  const [destination, setDestination] = useState<GeocodedResult>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const geocodeAddress = (
      address: string,
      setter: (result: GeocodedResult) => void,
      onError: (status: google.maps.GeocoderStatus) => void
    ) => {
      if (!window.google || !window.google.maps) {
          onError('GOOGLE_MAPS_NOT_LOADED' as any);
          return;
      }
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ address: address }, (results, status) => {
        if (status === 'OK' && results) {
          setter(results[0].geometry.location.toJSON());
        } else {
          onError(status);
        }
      });
    };
    
    setLoading(true);
    Promise.all([
      new Promise<void>((resolve, reject) => 
        geocodeAddress(originAddress, (res) => { setOrigin(res); resolve(); }, (status) => reject(new Error(`Origin geocoding failed: ${status}`)))
      ),
      new Promise<void>((resolve, reject) => 
        geocodeAddress(destinationAddress, (res) => { setDestination(res); resolve(); }, (status) => reject(new Error(`Destination geocoding failed: ${status}`)))
      ),
    ]).catch((error) => {
        console.error(error);
        setError(error.message);
    }).finally(() => {
        setLoading(false);
    });

  }, [originAddress, destinationAddress]);

  if (!apiKey) {
    return <div className="flex items-center justify-center h-full bg-destructive text-destructive-foreground p-4">Error: Google Maps API Key is missing.</div>;
  }
  
  if (loading) {
    return <div className="flex items-center justify-center h-full">Cargando mapa...</div>;
  }

  if (error) {
    return <div className="flex items-center justify-center h-full bg-destructive text-destructive-foreground p-4 text-center">{error}</div>;
  }
  
  const center = origin || destination || { lat: 40.416775, lng: -3.703790 };

  return (
    <APIProvider apiKey={apiKey} libraries={['marker', 'routes', 'geocoding']}>
      <Map
        defaultCenter={center}
        defaultZoom={11}
        gestureHandling={'greedy'}
        disableDefaultUI={true}
      >
        {origin && <Marker position={origin} title="Tu hotel" />}
        {destination && <Marker position={destination} title="Punto de encuentro" />}
        <Directions origin={origin} destination={destination} />
      </Map>
    </APIProvider>
  );
}
