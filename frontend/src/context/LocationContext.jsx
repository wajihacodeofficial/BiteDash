import { createContext, useContext, useState, useEffect } from 'react';

const LocationContext = createContext();

export const LocationProvider = ({ children }) => {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Initialize from localStorage if available
  useEffect(() => {
    const savedLocation = localStorage.getItem('userLocation');
    if (savedLocation) {
      try {
        setLocation(JSON.parse(savedLocation));
      } catch (e) {
        console.error('Failed to parse saved location', e);
      }
    } else {
      // Default fallback if nothing saved
      setLocation({
        latitude: 24.8607,
        longitude: 67.0011,
        address: 'Defence View, Karachi',
        city: 'Karachi',
        country: 'Pakistan',
        isFallback: true,
      });
    }
  }, []);

  const updateLocation = (newLocation) => {
    setLocation(newLocation);
    localStorage.setItem('userLocation', JSON.stringify(newLocation));
  };

  const detectLocation = () => {
    setLoading(true);
    setError(null);

    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          // Using Nominatim for open-source reverse geocoding
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const data = await response.json();

          const newLoc = {
            latitude,
            longitude,
            address: data.display_name?.split(',')[0] || 'Unknown Location',
            fullAddress: data.display_name,
            city: data.address?.city || data.address?.town || 'Karachi',
            country: data.address?.country || 'Pakistan',
            isFallback: false,
          };

          updateLocation(newLoc);
        } catch (err) {
          console.warn('Reverse geocoding failed', err);
          updateLocation({
            latitude,
            longitude,
            address: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
            city: 'Unknown',
            country: 'Unknown',
            isFallback: false,
          });
        }
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
    );
  };

  return (
    <LocationContext.Provider
      value={{ location, loading, error, detectLocation, updateLocation }}
    >
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => useContext(LocationContext);
