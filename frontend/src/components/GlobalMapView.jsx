import React, { useState, useEffect } from 'react';
import { Navigation, Search, Truck, Store, Loader } from 'lucide-react';
import MapComponent from './MapComponent';
import { getUserLocation } from '../utils/googleMapsService';
import api from '../api';

const GlobalMapView = ({ showControls = true, height = '500px' }) => {
  const [userLocation, setUserLocation] = useState(null);
  const [restaurants, setRestaurants] = useState([]);
  const [activeOrders, setActiveOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showRestaurants, setShowRestaurants] = useState(true);
  const [showOrders, setShowOrders] = useState(true);
  const [showDeliveryZones, setShowDeliveryZones] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Load initial data
  useEffect(() => {
    loadData();
    getCurrentLocation();
  }, []);

  const getCurrentLocation = async () => {
    try {
      const location = await getUserLocation();
      setUserLocation(location);
    } catch (error) {
      console.error('Error getting user location:', error);
    }
  };

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load restaurants
      const restaurantsResponse = await api.get('/restaurants');
      setRestaurants(restaurantsResponse.data || []);

      // Load active orders (for demonstration)
      // In real app, this would be filtered by user role
      const ordersResponse = await api.get('/orders?status=active');
      setActiveOrders(ordersResponse.data || []);
    } catch (err) {
      console.error('Error loading map data:', err);
      setError('Failed to load map data');
      // Set demo data for development
      setRestaurants([
        {
          _id: '1',
          name: 'Pizza Palace',
          latitude: 24.8607,
          longitude: 67.0011,
          address: 'Phase 8, Karachi',
          cuisine: 'Italian',
          rating: 4.5,
        },
        {
          _id: '2',
          name: 'Desi Dhaba',
          latitude: 24.8621,
          longitude: 67.0025,
          address: 'Defence View, Karachi',
          cuisine: 'Pakistani',
          rating: 4.2,
        },
        {
          _id: '3',
          name: 'Burger Barn',
          latitude: 24.8587,
          longitude: 66.9997,
          address: 'Clifton, Karachi',
          cuisine: 'American',
          rating: 4.7,
        },
      ]);

      setActiveOrders([
        {
          _id: 'ord1',
          customer: { name: 'John Doe', phone: '+923001234567' },
          restaurant: { name: 'Pizza Palace', address: 'Phase 8, Karachi' },
          deliveryAddress: 'Block A, Defence View, Karachi',
          status: 'preparing',
          latitude: 24.863,
          longitude: 67.003,
          estimatedDelivery: '25 mins',
        },
        {
          _id: 'ord2',
          customer: { name: 'Jane Smith', phone: '+923007654321' },
          restaurant: { name: 'Desi Dhaba', address: 'Defence View, Karachi' },
          deliveryAddress: 'Phase 5, Karachi',
          status: 'delivering',
          latitude: 24.8615,
          longitude: 67.0015,
          estimatedDelivery: '15 mins',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Filter restaurants based on search
  const filteredRestaurants = restaurants.filter(
    (restaurant) =>
      restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      restaurant.cuisine?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      restaurant.address?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Create markers for map
  const getMapMarkers = () => {
    const markers = [];

    // Add restaurant markers
    if (showRestaurants) {
      filteredRestaurants.forEach((restaurant) => {
        if (restaurant.latitude && restaurant.longitude) {
          markers.push({
            latitude: restaurant.latitude,
            longitude: restaurant.longitude,
            title: restaurant.name,
            infoContent: `
              <div style="padding: 10px; max-width: 200px;">
                <h4 style="margin: 0 0 5px 0; color: #333;">${
                  restaurant.name
                }</h4>
                <p style="margin: 0 0 5px 0; color: #666; font-size: 14px;">${
                  restaurant.cuisine || 'Restaurant'
                }</p>
                <p style="margin: 0 0 5px 0; color: #888; font-size: 12px;">${
                  restaurant.address
                }</p>
                <div style="display: flex; align-items: center; gap: 5px; margin-top: 5px;">
                  <span style="color: #ffa500;">⭐</span>
                  <span style="font-size: 12px;">${
                    restaurant.rating || 'N/A'
                  }</span>
                </div>
              </div>
            `,
            icon: {
              url:
                'data:image/svg+xml;charset=UTF-8,' +
                encodeURIComponent(`
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="16" cy="16" r="12" fill="#FF6B35" stroke="white" stroke-width="3"/>
                  <text x="16" y="20" text-anchor="middle" fill="white" font-size="16" font-weight="bold">🍕</text>
                </svg>
              `),
              scaledSize: { width: 32, height: 32 },
              anchor: { x: 16, y: 16 },
            },
          });
        }
      });
    }

    // Add order delivery markers
    if (showOrders) {
      activeOrders.forEach((order) => {
        if (order.latitude && order.longitude) {
          const statusColors = {
            preparing: '#f39c12',
            delivering: '#3498db',
            ready: '#27ae60',
          };

          markers.push({
            latitude: order.latitude,
            longitude: order.longitude,
            title: `Order to ${order.customer?.name || 'Customer'}`,
            infoContent: `
              <div style="padding: 10px; max-width: 200px;">
                <h4 style="margin: 0 0 5px 0; color: #333;">Delivery to ${
                  order.customer?.name || 'Customer'
                }</h4>
                <p style="margin: 0 0 5px 0; color: #666; font-size: 12px;">${
                  order.deliveryAddress
                }</p>
                <p style="margin: 0 0 5px 0; color: #888; font-size: 12px;">From: ${
                  order.restaurant?.name
                }</p>
                <div style="display: flex; align-items: center; gap: 10px; margin-top: 5px;">
                  <span style="background: ${
                    statusColors[order.status] || '#95a5a6'
                  }; color: white; padding: 2px 6px; border-radius: 3px; font-size: 10px; text-transform: capitalize;">
                    ${order.status}
                  </span>
                  <span style="font-size: 12px; color: #666;">${
                    order.estimatedDelivery
                  }</span>
                </div>
              </div>
            `,
            icon: {
              url:
                'data:image/svg+xml;charset=UTF-8,' +
                encodeURIComponent(`
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="16" cy="16" r="12" fill="${
                    statusColors[order.status] || '#95a5a6'
                  }" stroke="white" stroke-width="3"/>
                  <text x="16" y="20" text-anchor="middle" fill="white" font-size="16">🚚</text>
                </svg>
              `),
              scaledSize: { width: 32, height: 32 },
              anchor: { x: 16, y: 16 },
            },
          });
        }
      });
    }

    return markers;
  };

  if (loading) {
    return (
      <div
        className="global-map-loading"
        style={{
          width: '100%',
          height: height,
          borderRadius: '12px',
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
          <p>Loading global map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="global-map-view" style={{ position: 'relative' }}>
      {/* Map Controls */}
      {showControls && (
        <div
          className="map-controls"
          style={{
            position: 'absolute',
            top: '10px',
            left: '10px',
            right: '10px',
            zIndex: 1000,
            backgroundColor: 'white',
            borderRadius: '8px',
            padding: '10px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
            display: 'flex',
            gap: '10px',
            alignItems: 'center',
            flexWrap: 'wrap',
          }}
        >
          {/* Search */}
          <div style={{ position: 'relative', flex: '1', minWidth: '200px' }}>
            <Search
              size={16}
              style={{
                position: 'absolute',
                left: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#666',
              }}
            />
            <input
              type="text"
              placeholder="Search restaurants..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 8px 8px 35px',
                border: '1px solid #ddd',
                borderRadius: '6px',
                fontSize: '14px',
              }}
            />
          </div>

          {/* Toggle Controls */}
          <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
            <button
              onClick={() => setShowRestaurants(!showRestaurants)}
              style={{
                padding: '8px 12px',
                border: '1px solid #ddd',
                borderRadius: '6px',
                backgroundColor: showRestaurants ? '#4285f4' : 'white',
                color: showRestaurants ? 'white' : '#333',
                fontSize: '12px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
              }}
            >
              <Store size={14} />
              Restaurants
            </button>

            <button
              onClick={() => setShowOrders(!showOrders)}
              style={{
                padding: '8px 12px',
                border: '1px solid #ddd',
                borderRadius: '6px',
                backgroundColor: showOrders ? '#34a853' : 'white',
                color: showOrders ? 'white' : '#333',
                fontSize: '12px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
              }}
            >
              <Truck size={14} />
              Orders
            </button>

            <button
              onClick={() => setShowDeliveryZones(!showDeliveryZones)}
              style={{
                padding: '8px 12px',
                border: '1px solid #ddd',
                borderRadius: '6px',
                backgroundColor: showDeliveryZones ? '#ff9800' : 'white',
                color: showDeliveryZones ? 'white' : '#333',
                fontSize: '12px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
              }}
            >
              <Navigation size={14} />
              Zones
            </button>
          </div>
        </div>
      )}

      {/* Statistics Panel */}
      <div
        className="map-stats"
        style={{
          position: 'absolute',
          bottom: '10px',
          left: '10px',
          right: '10px',
          zIndex: 1000,
          backgroundColor: 'rgba(255,255,255,0.95)',
          borderRadius: '8px',
          padding: '10px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          display: 'flex',
          justifyContent: 'space-around',
          flexWrap: 'wrap',
          gap: '10px',
        }}
      >
        <div style={{ textAlign: 'center', minWidth: '80px' }}>
          <div
            style={{ fontSize: '18px', fontWeight: 'bold', color: '#4285f4' }}
          >
            {filteredRestaurants.length}
          </div>
          <div style={{ fontSize: '12px', color: '#666' }}>Restaurants</div>
        </div>
        <div style={{ textAlign: 'center', minWidth: '80px' }}>
          <div
            style={{ fontSize: '18px', fontWeight: 'bold', color: '#34a853' }}
          >
            {activeOrders.length}
          </div>
          <div style={{ fontSize: '12px', color: '#666' }}>Active Orders</div>
        </div>
        <div style={{ textAlign: 'center', minWidth: '80px' }}>
          <div
            style={{ fontSize: '18px', fontWeight: 'bold', color: '#ff9800' }}
          >
            {restaurants.length > 0
              ? Math.round(
                  (restaurants.reduce((acc, r) => acc + (r.rating || 0), 0) /
                    restaurants.length) *
                    10
                ) / 10
              : 'N/A'}
          </div>
          <div style={{ fontSize: '12px', color: '#666' }}>Avg Rating</div>
        </div>
      </div>

      {/* Main Map */}
      <MapComponent
        latitude={userLocation?.latitude || 24.8607}
        longitude={userLocation?.longitude || 67.0011}
        height={height}
        markers={getMapMarkers()}
        showControls={false}
        className="global-map"
      />

      {/* Error Message */}
      {error && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'rgba(255,255,255,0.95)',
            padding: '20px',
            borderRadius: '8px',
            textAlign: 'center',
            boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
            zIndex: 1001,
          }}
        >
          <p style={{ color: '#721c24', marginBottom: '10px' }}>{error}</p>
          <button
            onClick={loadData}
            style={{
              padding: '8px 16px',
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Retry
          </button>
        </div>
      )}
    </div>
  );
};

export default GlobalMapView;
