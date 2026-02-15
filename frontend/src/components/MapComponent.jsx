import React, { useEffect, useRef, useState } from 'react';
import { MapPin, Loader, AlertTriangle } from 'lucide-react';
import {
  createMapInstance,
  clearMapMarkers,
  fitMapToMarkers,
} from '../utils/googleMapsService';

const MapComponent = ({
  latitude,
  longitude,
  zoom = 15,
  height = '400px',
  markers = [],
  onMapClick = null,
  className = '',
  showControls = true,
}) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  const initializeMap = async () => {
    if (!mapRef.current) return;

    try {
      setLoading(true);
      setError(null);

      // Clear previous markers
      if (mapInstanceRef.current) {
        clearMapMarkers(mapInstanceRef.current, markersRef.current);
      }

      // Create new map instance
      const { map, maps } = await createMapInstance(mapRef.current, {
        zoom,
        center: { lat: latitude || 24.8607, lng: longitude || 67.0011 },
        mapTypeControl: showControls,
        streetViewControl: showControls,
        fullscreenControl: showControls,
        zoomControl: showControls,
        gestureHandling: 'cooperative',
        clickableIcons: false,
        styles: [
          {
            featureType: 'poi',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }],
          },
          {
            featureType: 'transit',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }],
          },
        ],
      });

      mapInstanceRef.current = map;

      // Add main location marker if coordinates provided
      if (latitude && longitude) {
        const mainMarker = new maps.Marker({
          position: { lat: latitude, lng: longitude },
          map: mapInstanceRef.current,
          title: 'Your Location',
          icon: {
            url:
              'data:image/svg+xml;charset=UTF-8,' +
              encodeURIComponent(`
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="16" cy="16" r="8" fill="#4285F4" stroke="white" stroke-width="3"/>
                <circle cx="16" cy="16" r="3" fill="white"/>
              </svg>
            `),
            scaledSize: new maps.Size(32, 32),
            anchor: new maps.Point(16, 16),
          },
          animation: maps.Animation.DROP,
        });

        markersRef.current.push(mainMarker);
      }

      // Add additional markers
      if (markers.length > 0) {
        markers.forEach((marker, index) => {
          if (!marker.latitude || !marker.longitude) return;

          const markerIcon = marker.icon || {
            url:
              'data:image/svg+xml;charset=UTF-8,' +
              encodeURIComponent(`
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="16" cy="16" r="8" fill="#EA4335" stroke="white" stroke-width="3"/>
                <circle cx="16" cy="16" r="3" fill="white"/>
              </svg>
            `),
            scaledSize: new maps.Size(32, 32),
            anchor: new maps.Point(16, 16),
          };

          const markerObj = new maps.Marker({
            position: { lat: marker.latitude, lng: marker.longitude },
            map: mapInstanceRef.current,
            title: marker.title || `Location ${index + 1}`,
            icon: markerIcon,
            animation: maps.Animation.DROP,
          });

          // Add info window if content provided
          if (marker.infoContent) {
            const infoWindow = new maps.InfoWindow({
              content: marker.infoContent,
            });

            markerObj.addListener('click', () => {
              infoWindow.open(mapInstanceRef.current, markerObj);
            });
          }

          markersRef.current.push(markerObj);
        });

        // Fit map to show all markers
        if (markersRef.current.length > 1) {
          setTimeout(() => {
            fitMapToMarkers(mapInstanceRef.current, markersRef.current);
          }, 100);
        }
      }

      // Handle map clicks
      if (onMapClick) {
        mapInstanceRef.current.addListener('click', (event) => {
          onMapClick({
            latitude: event.latLng.lat(),
            longitude: event.latLng.lng(),
          });
        });
      }

      setMapLoaded(true);
      console.log('Map initialized successfully');
    } catch (err) {
      console.error('Error initializing map:', err);
      setError(err.message || 'Failed to load map');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    initializeMap();

    return () => {
      // Cleanup on unmount
      if (mapInstanceRef.current) {
        clearMapMarkers(mapInstanceRef.current, markersRef.current);
      }
    };
  }, []);

  // Update map when props change
  useEffect(() => {
    if (mapInstanceRef.current && mapLoaded) {
      initializeMap();
    }
  }, [latitude, longitude, zoom, markers, showControls]);

  // Loading state
  if (loading) {
    return (
      <div
        className={`map-loading ${className}`}
        style={{
          width: '100%',
          height: height,
          borderRadius: '12px',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#f8f9fa',
          border: '1px solid #e9ecef',
        }}
      >
        <div style={{ textAlign: 'center', color: '#6c757d' }}>
          <Loader
            size={32}
            className="animate-spin"
            style={{ marginBottom: '8px' }}
          />
          <p>Loading map...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div
        className={`map-error ${className}`}
        style={{
          width: '100%',
          height: height,
          borderRadius: '12px',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#f8d7da',
          border: '1px solid #f5c6cb',
        }}
      >
        <div style={{ textAlign: 'center', color: '#721c24' }}>
          <AlertTriangle size={32} style={{ marginBottom: '8px' }} />
          <p>Map failed to load</p>
          <small>{error}</small>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`map-container ${className}`}
      ref={mapRef}
      style={{
        width: '100%',
        height: height,
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
        position: 'relative',
      }}
    />
  );
};

export default MapComponent;
