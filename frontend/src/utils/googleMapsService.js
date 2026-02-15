// Google Maps Service with Enhanced Error Handling
const GOOGLE_MAPS_API_KEY =
  import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'YOUR_API_KEY_HERE';

export const initializeGoogleMaps = () => {
  return new Promise((resolve, reject) => {
    // Check if Google Maps is already loaded
    if (window.google && window.google.maps) {
      resolve(window.google.maps);
      return;
    }

    // Check if API key is configured
    if (GOOGLE_MAPS_API_KEY === 'YOUR_API_KEY_HERE') {
      console.warn('Google Maps API key not configured. Using fallback mode.');
      reject(new Error('Google Maps API key not configured'));
      return;
    }

    // Create script element for loading Google Maps API
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places,geometry,marker&v=weekly`;
    script.async = true;
    script.defer = true;

    // Set timeout for script loading
    const timeout = setTimeout(() => {
      script.remove();
      reject(new Error('Google Maps API loading timeout'));
    }, 15000);

    script.onload = () => {
      clearTimeout(timeout);
      if (window.google && window.google.maps) {
        console.log('Google Maps API loaded successfully');
        resolve(window.google.maps);
      } else {
        reject(new Error('Google Maps API loaded but not available'));
      }
    };

    script.onerror = (error) => {
      clearTimeout(timeout);
      console.error('Failed to load Google Maps API:', error);
      reject(new Error('Failed to load Google Maps API'));
    };

    // Add script to document head
    if (!document.querySelector('script[src*="maps.googleapis.com"]')) {
      document.head.appendChild(script);
    } else {
      // If script is already loading, wait for it
      const checkGoogleMaps = setInterval(() => {
        if (window.google && window.google.maps) {
          clearInterval(checkGoogleMaps);
          resolve(window.google.maps);
        }
      }, 100);

      // Clear interval after timeout
      setTimeout(() => {
        clearInterval(checkGoogleMaps);
        reject(new Error('Google Maps API loading timeout'));
      }, 15000);
    }
  });
};

// Calculate distance between two coordinates
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of the earth in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in km
  return distance.toFixed(2);
};

// Filter restaurants by distance
export const filterRestaurantsByDistance = (
  restaurants,
  userLat,
  userLon,
  maxDistance = 10
) => {
  return restaurants.filter((restaurant) => {
    if (!restaurant.latitude || !restaurant.longitude) return false;
    const distance = calculateDistance(
      userLat,
      userLon,
      restaurant.latitude,
      restaurant.longitude
    );
    return parseFloat(distance) <= maxDistance;
  });
};

// Get user's current location with enhanced error handling
export const getUserLocation = () => {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      console.warn('Geolocation not supported, using fallback location');
      resolve(getFallbackLocation());
      return;
    }

    // Set a timeout for geolocation
    const timeout = setTimeout(() => {
      console.warn('Geolocation request timed out, using fallback location');
      resolve(getFallbackLocation());
    }, 10000);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        clearTimeout(timeout);
        console.log('User location obtained:', {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy,
        });
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: new Date().toISOString(),
          isFallback: false,
        });
      },
      (error) => {
        clearTimeout(timeout);
        console.warn(
          'Geolocation error:',
          error.message,
          'Using fallback location'
        );
        resolve(getFallbackLocation(error.code));
      },
      {
        enableHighAccuracy: false,
        timeout: 8000,
        maximumAge: 300000, // 5 minutes
      }
    );
  });
};

// Fallback location helper
const getFallbackLocation = (errorCode = null) => {
  return {
    latitude: parseFloat(import.meta.env.VITE_MAP_DEFAULT_LAT) || 24.8607,
    longitude: parseFloat(import.meta.env.VITE_MAP_DEFAULT_LNG) || 67.0011,
    accuracy: 1000,
    isFallback: true,
    error: errorCode,
    timestamp: new Date().toISOString(),
  };
};

// Reverse geocode coordinates to get address
export const reverseGeocodeLocation = async (lat, lon) => {
  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lon}&key=${GOOGLE_MAPS_API_KEY}`
    );
    const data = await response.json();
    if (data.results && data.results.length > 0) {
      return data.results[0].formatted_address;
    }
    return `${lat}, ${lon}`;
  } catch (error) {
    console.error('Reverse geocoding error:', error);
    return `${lat}, ${lon}`;
  }
};

// Geocode address to coordinates
export const geocodeAddress = async (address) => {
  try {
    if (!address || address.trim() === '') return null;

    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
        address.trim()
      )}&key=${GOOGLE_MAPS_API_KEY}`
    );
    const data = await response.json();

    if (data.status === 'OK' && data.results && data.results.length > 0) {
      return {
        latitude: data.results[0].geometry.location.lat,
        longitude: data.results[0].geometry.location.lng,
        formatted_address: data.results[0].formatted_address,
        place_id: data.results[0].place_id,
      };
    }

    console.warn('Geocoding failed:', data.status, data.error_message);
    return null;
  } catch (error) {
    console.error('Geocoding error:', error);
    return null;
  }
};

// Create map instance with enhanced options
export const createMapInstance = (mapElement, options = {}) => {
  return new Promise((resolve, reject) => {
    const initializeMap = async () => {
      try {
        const maps = await initializeGoogleMaps();

        const defaultOptions = {
          zoom: parseInt(import.meta.env.VITE_MAP_DEFAULT_ZOOM) || 15,
          center: {
            lat: parseFloat(import.meta.env.VITE_MAP_DEFAULT_LAT) || 24.8607,
            lng: parseFloat(import.meta.env.VITE_MAP_DEFAULT_LNG) || 67.0011,
          },
          mapTypeControl: true,
          streetViewControl: true,
          fullscreenControl: true,
          zoomControl: true,
          styles: [
            {
              featureType: 'poi',
              elementType: 'labels',
              stylers: [{ visibility: 'off' }],
            },
          ],
          ...options,
        };

        const map = new maps.Map(mapElement, defaultOptions);

        // Add loading complete callback
        maps.event.addListenerOnce(map, 'tilesloaded', () => {
          console.log('Map tiles loaded successfully');
          resolve({ map, maps });
        });
      } catch (error) {
        console.error('Error creating map instance:', error);
        reject(error);
      }
    };

    initializeMap();
  });
};

// Clear all markers from map
export const clearMapMarkers = (map, markers) => {
  if (markers && markers.length > 0) {
    markers.forEach((marker) => {
      if (marker.setMap) {
        marker.setMap(null);
      }
    });
  }
};

// Fit map to show all markers
export const fitMapToMarkers = (map, markers, padding = 50) => {
  if (!map || !markers || markers.length === 0) return;

  const bounds = new window.google.maps.LatLngBounds();

  markers.forEach((marker) => {
    if (marker.getPosition) {
      bounds.extend(marker.getPosition());
    }
  });

  map.fitBounds(bounds, padding);

  // Ensure minimum zoom level
  const listener = window.google.maps.event.addListener(map, 'idle', () => {
    if (map.getZoom() > 16) {
      map.setZoom(16);
    }
    window.google.maps.event.removeListener(listener);
  });
};
