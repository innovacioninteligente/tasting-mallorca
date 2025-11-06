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
  originAddress,
  destinationAddress,
}: {
  originAddress: string;
  destinationAddress: string;
}) {
  const map = useMap();
  const [directionsService, setDirectionsService] =
    useState<google.maps.DirectionsService | null>(null);
  const [directionsRenderer, setDirectionsRenderer] =
    useState<google.maps.DirectionsRenderer | null>(null);
  const [origin, setOrigin] = useState<GeocodedResult>(null);
  const [destination, setDestination] = useState<GeocodedResult>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!map) return;
    setDirectionsService(new window.google.maps.DirectionsService());
    setDirectionsRenderer(new window.google.maps.DirectionsRenderer({ map }));
  }, [map]);
  
  useEffect(() => {
      const geocodeAddress = (
        geocoder: google.maps.Geocoder,
        address: string,
        setter: (result: GeocodedResult) => void,
        onError: (status: google.maps.GeocoderStatus) => void
      ) => {
        geocoder.geocode({ address: address }, (results, status) => {
          if (status === 'OK' && results) {
            setter(results[0].geometry.location.toJSON());
          } else {
            onError(status);
          }
        });
      };
      
      if (!map) return;
      
      const geocoder = new window.google.maps.Geocoder();

      Promise.all([
        new Promise<void>((resolve, reject) => 
          geocodeAddress(geocoder, originAddress, setOrigin, (status) => reject(new Error(`Origin geocoding failed: ${status}`)))
        ),
        new Promise<void>((resolve, reject) => 
          geocodeAddress(geocoder, destinationAddress, setDestination, (status) => reject(new Error(`Destination geocoding failed: ${status}`)))
        ),
      ]).catch((error) => {
          console.error(error);
          setError(error.message);
      });

  }, [map, originAddress, destinationAddress]);


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
  
  if (error) {
      return <div className="flex items-center justify-center h-full bg-destructive text-destructive-foreground p-4 text-center">{error}</div>;
  }

  return <>
    {origin && <Marker position={origin} title="Tu hotel" />}
    {destination && <Marker position={destination} title="Punto de encuentro" />}
  </>;
}

export function RouteMap({ originAddress, destinationAddress }: RouteMapProps) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    return <div className="flex items-center justify-center h-full bg-destructive text-destructive-foreground p-4">Error: Google Maps API Key is missing.</div>;
  }
  
  if (!originAddress || !destinationAddress) {
      return <div className="flex items-center justify-center h-full">Proporciona un origen y destino.</div>;
  }

  return (
    <APIProvider apiKey={apiKey} libraries={['marker', 'routes', 'geocoding']}>
      <Map
        defaultCenter={{ lat: 39.5696, lng: 2.6502 }}
        defaultZoom={10}
        gestureHandling={'greedy'}
        disableDefaultUI={true}
        mapId={'f91b1312758f731c'}
      >
        <Directions originAddress={originAddress} destinationAddress={destinationAddress} />
      </Map>
    </APIProvider>
  );
}
