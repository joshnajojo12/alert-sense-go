import { useState, useEffect } from 'react';

interface GeolocationResult {
  latitude: number | null;
  longitude: number | null;
  error: string | null;
  googleMapsUrl: string;
}

export const useGeolocation = (): GeolocationResult => {
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);
        setError(null);
      },
      (err) => {
        setError(`Location error: ${err.message}`);
        console.error('Geolocation error:', err);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 5000,
      }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  const googleMapsUrl = latitude && longitude 
    ? `https://www.google.com/maps?q=${latitude},${longitude}`
    : '';

  return { latitude, longitude, error, googleMapsUrl };
};
