import { useState, useEffect } from 'react';

export const useGeolocation = () => {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const getLocation = () => {
    setLoading(true);
    setError(null);

    if (!navigator.geolocation) {
      const fallbackLocation = {
        latitude: 24.8607,
        longitude: 67.0011,
        address: 'Karachi, Pakistan',
        city: 'Karachi',
        country: 'Pakistan',
        isFallback: true,
      };
      setLocation(fallbackLocation);
      setError('Geolocation not supported - using fallback location');
      setLoading(false);
      return;
    }

    const timeout = setTimeout(() => {
      setError('Location request timed out');
      // Use fallback
      const fallbackLocation = {
        latitude: 24.8607,
        longitude: 67.0011,
        address: 'Karachi, Pakistan',
        city: 'Karachi',
        country: 'Pakistan',
        isFallback: true,
      };
      setLocation(fallbackLocation);
      setLoading(false);
    }, 15000);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        clearTimeout(timeout);
        const { latitude, longitude } = position.coords;

        try {
          // Try Nominatim first (free, no API key needed)
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
            { timeout: 5000 }
          );
          const data = await response.json();

          setLocation({
            latitude,
            longitude,
            address: data.display_name,
            city: data.address?.city || data.address?.town || 'Karachi',
            country: data.address?.country || 'Pakistan',
          });
        } catch (err) {
          console.warn('Reverse geocoding failed, using fallback:', err);
          // Fallback if reverse geocoding fails
          setLocation({
            latitude,
            longitude,
            address: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
            city: 'Karachi',
            country: 'Pakistan',
            isFallback: true,
          });
        }

        setLoading(false);
      },
      (err) => {
        clearTimeout(timeout);
        console.warn('Geolocation error:', err.message);

        // Use fallback location on any error
        const fallbackLocation = {
          latitude: 24.8607,
          longitude: 67.0011,
          address: 'Karachi, Pakistan',
          city: 'Karachi',
          country: 'Pakistan',
          isFallback: true,
        };
        setLocation(fallbackLocation);
        setError(`Location error: ${err.message}. Using fallback location.`);
        setLoading(false);
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 3600000 }
    );
  };

  return { location, error, loading, getLocation };
};
