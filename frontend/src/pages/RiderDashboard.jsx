import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import {
  Bike,
  DollarSign,
  Package,
  Star,
  MapPin,
  Navigation,
  CheckCircle,
  Clock,
  Wallet,
  FileText,
  Shield,
  ToggleLeft,
  ToggleRight,
  TrendingUp,
  AlertCircle,
  Phone,
  MessageSquare,
} from 'lucide-react';
import MapComponent from '../components/MapComponent';
import EnhancedOrderCard from '../components/EnhancedOrderCard';
import { getUserLocation, calculateDistance } from '../utils/googleMapsService';
import api from '../api';
import './Dashboard.css';
import { useSocket } from '../context/SocketContext';
import io from 'socket.io-client';

const RiderDashboard = () => {
  const { user } = useAuth();
  const { addNotification } = useNotification();

  const [isOnline, setIsOnline] = useState(true);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [availableOrders, setAvailableOrders] = useState([]);
  const [activeDelivery, setActiveDelivery] = useState(null);
  const [completedOrders, setCompletedOrders] = useState([]);
  const [earnings, setEarnings] = useState(1850);
  const [riderStats, setRiderStats] = useState({
    totalEarnings: 15420,
    totalDeliveries: 186,
    rating: 4.8,
    totalHours: 420,
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('available');
  const [showLocationMap, setShowLocationMap] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    vehicleInfo: {
      vehicleType: 'bike',
      plateNumber: '',
      model: '',
    },
  });

  const { socket } = useSocket();

  // Initialize dashboard
  useEffect(() => {
    const initializeDashboard = async () => {
      try {
        let location;
        try {
          location = await getUserLocation();
        } catch (locationError) {
          console.warn('Location error, using fallback:', locationError);
          location = {
            latitude: 24.8607,
            longitude: 67.0011,
            accuracy: 5000,
            isFallback: true,
          };
          addNotification('Location', 'Using fallback location (Karachi)');
        }
        setCurrentLocation(location);
        await fetchAvailableOrders(location);
        await fetchCompletedOrders();
      } catch (error) {
        console.error('Error initializing dashboard:', error);
        setCurrentLocation({
          latitude: 24.8607,
          longitude: 67.0011,
          accuracy: 5000,
          isFallback: true,
        });
      } finally {
        setLoading(false);
      }
    };

    initializeDashboard();
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on('order_available', (order) => {
        if (!isOnline) return;
        setAvailableOrders((prev) => {
          if (prev.find((o) => o._id === order._id)) return prev;
          return [...prev, order];
        });
        addNotification('New Order', `New order available near you!`);
      });

      socket.on('order_taken', (orderId) => {
        setAvailableOrders((prev) => prev.filter((o) => o._id !== orderId));
      });

      socket.on('order_removed_from_available', (orderId) => {
        setAvailableOrders((prev) => prev.filter((o) => o._id !== orderId));
      });

      return () => {
        socket.off('order_available');
        socket.off('order_taken');
        socket.off('order_removed_from_available');
      };
    }
  }, [socket, isOnline]);

  const fetchAvailableOrders = async (location) => {
    try {
      const res = await api.get('/rider/available'); // Corrected endpoint
      let orders = res.data;
      if (location) {
        orders = orders.map((order) => ({
          ...order,
          distance: calculateDistance(
            location.latitude,
            location.longitude,
            order.deliveryLocation?.latitude || 24.8607,
            order.deliveryLocation?.longitude || 67.0011
          ),
        }));
      }
      setAvailableOrders(orders);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setAvailableOrders([]);
    }
  };

  const fetchCompletedOrders = async () => {
    try {
      const res = await api.get('/rider/completed-orders');
      setCompletedOrders(res.data);
    } catch (error) {
      console.error('Error fetching completed orders:', error);
      setCompletedOrders([]);
    }
  };

  const toggleStatus = () => {
    setIsOnline(!isOnline);
    addNotification(
      'Status Updated',
      isOnline ? '🔴 You are now Offline' : '🟢 You are now Online'
    );
  };

  const fetchProfile = async () => {
    try {
      const res = await api.get('/users/profile');
      setProfileData(res.data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put('/users/profile', profileData);
      setProfileData(res.data);
      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile.');
    }
  };

  const acceptOrder = async (order) => {
    try {
      await api.put(`/rider/pickup/${order._id}`);
      setActiveDelivery(order);
      setAvailableOrders((prev) => prev.filter((o) => o._id !== order._id));

      // Join socket room for this order
      if (socket) {
        socket.emit('join_order', order._id);
      }

      addNotification(
        'Order Accepted ✅',
        `Pickup from ${order.restaurant.name}`
      );
    } catch (error) {
      console.error('Accept order failed', error);
      addNotification('Error', 'Failed to accept order.');
    }
  };

  const completeDelivery = async () => {
    if (activeDelivery) {
      try {
        await api.put(`/rider/deliver/${activeDelivery._id}`);
        setCompletedOrders((prev) => [activeDelivery, ...prev]);
        setEarnings((prev) => prev + (activeDelivery.estimatedEarnings || 150));
        addNotification(
          'Delivery Completed 🎉',
          `You earned Rs. ${activeDelivery.estimatedEarnings || 150}`
        );
        setActiveDelivery(null);
        fetchAvailableOrders(currentLocation);
      } catch (error) {
        console.error('Complete delivery failed', error);
        addNotification('Error', 'Failed to complete delivery.');
      }
    }
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading Rider Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container professional-dashboard">
      {/* Header Section */}
      <div className="dashboard-header" style={{ marginBottom: '40px' }}>
        <div>
          <h1
            style={{ fontSize: '2.5rem', marginBottom: '8px', fontWeight: 700 }}
          >
            Rider Dashboard 🚴
          </h1>
          <p style={{ fontSize: '1.1rem', color: '#666' }}>
            Welcome, {user?.name}! Time to earn 💰
          </p>
        </div>
        <div
          className={`status-toggle-btn ${isOnline ? 'online' : 'offline'}`}
          onClick={toggleStatus}
          style={{
            padding: '16px 24px',
            borderRadius: '12px',
            background: isOnline
              ? 'linear-gradient(135deg, #27ae60 0%, #229954 100%)'
              : 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)',
            color: 'white',
            cursor: 'pointer',
            fontWeight: 600,
            fontSize: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.3)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.2)';
          }}
        >
          {isOnline ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}
          {isOnline ? 'Online' : 'Offline'}
        </div>
      </div>

      {/* Stats Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '20px',
          marginBottom: '40px',
        }}
      >
        <div
          className="stat-card"
          style={{
            background: 'white',
            padding: '24px',
            borderRadius: '16px',
            boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
            border: '1px solid #f0f0f0',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '12px',
            }}
          >
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
              }}
            >
              <DollarSign size={24} />
            </div>
            <div>
              <p style={{ margin: 0, fontSize: '0.9rem', color: '#999' }}>
                Today's Earnings
              </p>
              <h3
                style={{
                  margin: '4px 0 0 0',
                  fontSize: '1.8rem',
                  fontWeight: 700,
                }}
              >
                Rs. {earnings}
              </h3>
            </div>
          </div>
        </div>

        <div
          className="stat-card"
          style={{
            background: 'white',
            padding: '24px',
            borderRadius: '16px',
            boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
            border: '1px solid #f0f0f0',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '12px',
            }}
          >
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
              }}
            >
              <Package size={24} />
            </div>
            <div>
              <p style={{ margin: 0, fontSize: '0.9rem', color: '#999' }}>
                Deliveries Today
              </p>
              <h3
                style={{
                  margin: '4px 0 0 0',
                  fontSize: '1.8rem',
                  fontWeight: 700,
                }}
              >
                {completedOrders.length}
              </h3>
            </div>
          </div>
        </div>

        <div
          className="stat-card"
          style={{
            background: 'white',
            padding: '24px',
            borderRadius: '16px',
            boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
            border: '1px solid #f0f0f0',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '12px',
            }}
          >
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
              }}
            >
              <Star size={24} />
            </div>
            <div>
              <p style={{ margin: 0, fontSize: '0.9rem', color: '#999' }}>
                Your Rating
              </p>
              <h3
                style={{
                  margin: '4px 0 0 0',
                  fontSize: '1.8rem',
                  fontWeight: 700,
                }}
              >
                {riderStats.rating} ⭐
              </h3>
            </div>
          </div>
        </div>

        <div
          className="stat-card"
          style={{
            background: 'white',
            padding: '24px',
            borderRadius: '16px',
            boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
            border: '1px solid #f0f0f0',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '12px',
            }}
          >
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
              }}
            >
              <TrendingUp size={24} />
            </div>
            <div>
              <p style={{ margin: 0, fontSize: '0.9rem', color: '#999' }}>
                Total Earnings
              </p>
              <h3
                style={{
                  margin: '4px 0 0 0',
                  fontSize: '1.8rem',
                  fontWeight: 700,
                }}
              >
                Rs. {riderStats.totalEarnings}
              </h3>
            </div>
          </div>
        </div>
      </div>

      {/* Location Section */}
      {currentLocation && (
        <div
          style={{
            background: 'white',
            padding: '20px',
            borderRadius: '16px',
            marginBottom: '40px',
            boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
            border: '1px solid #f0f0f0',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '16px',
            }}
          >
            <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 700 }}>
              Your Location
            </h3>
            <button
              onClick={() => setShowLocationMap(!showLocationMap)}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                background: '#667eea',
                color: 'white',
                border: 'none',
                cursor: 'pointer',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <Navigation size={16} />
              {showLocationMap ? 'Hide Map' : 'Show Map'}
            </button>
          </div>

          {showLocationMap && (
            <MapComponent
              latitude={currentLocation.latitude}
              longitude={currentLocation.longitude}
              height="300px"
              markers={availableOrders.map((order) => ({
                latitude: order.deliveryLocation?.latitude || 31.5497,
                longitude: order.deliveryLocation?.longitude || 74.3436,
                title: order.restaurant.name,
              }))}
            />
          )}
        </div>
      )}

      {/* Tabs */}
      <div style={{ marginBottom: '30px', borderBottom: '2px solid #f0f0f0' }}>
        <div style={{ display: 'flex', gap: '30px' }}>
          <button
            onClick={() => setActiveTab('available')}
            style={{
              padding: '12px 0',
              background: 'none',
              border: 'none',
              fontWeight: activeTab === 'available' ? 700 : 600,
              fontSize: '1rem',
              color: activeTab === 'available' ? '#667eea' : '#999',
              cursor: 'pointer',
              borderBottom:
                activeTab === 'available' ? '3px solid #667eea' : 'none',
              transition: 'all 0.3s ease',
              marginBottom: '-2px',
            }}
          >
            Available Orders ({availableOrders.length})
          </button>
          <button
            onClick={() => setActiveTab('active')}
            style={{
              padding: '12px 0',
              background: 'none',
              border: 'none',
              fontWeight: activeTab === 'active' ? 700 : 600,
              fontSize: '1rem',
              color: activeTab === 'active' ? '#667eea' : '#999',
              cursor: 'pointer',
              borderBottom:
                activeTab === 'active' ? '3px solid #667eea' : 'none',
              transition: 'all 0.3s ease',
              marginBottom: '-2px',
            }}
          >
            Active Delivery
          </button>
          <button
            onClick={() => setActiveTab('completed')}
            style={{
              padding: '12px 0',
              background: 'none',
              border: 'none',
              fontWeight: activeTab === 'completed' ? 700 : 600,
              fontSize: '1rem',
              color: activeTab === 'completed' ? '#667eea' : '#999',
              cursor: 'pointer',
              borderBottom:
                activeTab === 'completed' ? '3px solid #667eea' : 'none',
              transition: 'all 0.3s ease',
              marginBottom: '-2px',
            }}
          >
            Completed ({completedOrders.length})
          </button>
          <button
            onClick={() => {
              setActiveTab('profile');
              fetchProfile();
            }}
            style={{
              padding: '12px 0',
              background: 'none',
              border: 'none',
              fontWeight: activeTab === 'profile' ? 700 : 600,
              fontSize: '1rem',
              color: activeTab === 'profile' ? '#667eea' : '#999',
              cursor: 'pointer',
              borderBottom:
                activeTab === 'profile' ? '3px solid #667eea' : 'none',
              transition: 'all 0.3s ease',
              marginBottom: '-2px',
            }}
          >
            Profile & Vehicle
          </button>
        </div>
      </div>

      {/* Active Delivery */}
      {activeTab === 'active' && (
        <div style={{ marginBottom: '40px' }}>
          {activeDelivery ? (
            <div
              style={{
                background: 'white',
                padding: '28px',
                borderRadius: '16px',
                boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
                border: '2px solid #27ae60',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '24px',
                }}
              >
                <h2
                  style={{
                    margin: 0,
                    fontSize: '1.5rem',
                    fontWeight: 700,
                    color: '#27ae60',
                  }}
                >
                  🚴 Active Delivery
                </h2>
                <div
                  style={{
                    background: '#e8f5e9',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontWeight: 600,
                    color: '#27ae60',
                  }}
                >
                  <Clock size={16} /> Est. 15 mins
                </div>
              </div>

              {/* Delivery Map */}
              {activeDelivery.deliveryLocation && (
                <div
                  style={{
                    marginBottom: '24px',
                    borderRadius: '12px',
                    overflow: 'hidden',
                  }}
                >
                  <MapComponent
                    latitude={
                      activeDelivery.deliveryLocation.latitude || 31.5497
                    }
                    longitude={
                      activeDelivery.deliveryLocation.longitude || 74.3436
                    }
                    height="250px"
                  />
                </div>
              )}

              {/* Delivery Details */}
              <div style={{ marginBottom: '24px' }}>
                <div style={{ marginBottom: '20px' }}>
                  <p
                    style={{
                      margin: '0 0 8px 0',
                      fontSize: '0.9rem',
                      color: '#999',
                      fontWeight: 600,
                    }}
                  >
                    RESTAURANT
                  </p>
                  <p style={{ margin: 0, fontSize: '1.1rem', fontWeight: 600 }}>
                    {activeDelivery.restaurant.name}
                  </p>
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <p
                    style={{
                      margin: '0 0 8px 0',
                      fontSize: '0.9rem',
                      color: '#999',
                      fontWeight: 600,
                    }}
                  >
                    DELIVERY ADDRESS
                  </p>
                  <p
                    style={{
                      margin: 0,
                      fontSize: '1rem',
                      display: 'flex',
                      gap: '8px',
                    }}
                  >
                    <MapPin size={18} />
                    {activeDelivery.deliveryAddress}
                  </p>
                </div>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr 1fr',
                    gap: '16px',
                    marginTop: '24px',
                  }}
                >
                  <div
                    style={{
                      background: '#f8f9fa',
                      padding: '16px',
                      borderRadius: '12px',
                      textAlign: 'center',
                    }}
                  >
                    <p
                      style={{
                        margin: '0 0 8px 0',
                        fontSize: '0.9rem',
                        color: '#999',
                      }}
                    >
                      Distance
                    </p>
                    <p
                      style={{ margin: 0, fontSize: '1.3rem', fontWeight: 700 }}
                    >
                      {activeDelivery.distance || '2.5'} km
                    </p>
                  </div>
                  <div
                    style={{
                      background: '#f8f9fa',
                      padding: '16px',
                      borderRadius: '12px',
                      textAlign: 'center',
                    }}
                  >
                    <p
                      style={{
                        margin: '0 0 8px 0',
                        fontSize: '0.9rem',
                        color: '#999',
                      }}
                    >
                      Earning
                    </p>
                    <p
                      style={{
                        margin: 0,
                        fontSize: '1.3rem',
                        fontWeight: 700,
                        color: '#27ae60',
                      }}
                    >
                      Rs. {activeDelivery.estimatedEarnings}
                    </p>
                  </div>
                  <div
                    style={{
                      background: '#f8f9fa',
                      padding: '16px',
                      borderRadius: '12px',
                      textAlign: 'center',
                    }}
                  >
                    <p
                      style={{
                        margin: '0 0 8px 0',
                        fontSize: '0.9rem',
                        color: '#999',
                      }}
                    >
                      Items
                    </p>
                    <p
                      style={{ margin: 0, fontSize: '1.3rem', fontWeight: 700 }}
                    >
                      {activeDelivery.itemCount || 3}
                    </p>
                  </div>
                </div>
              </div>

              {/* Customer Info */}
              <div
                style={{
                  background: '#f8f9fa',
                  padding: '16px',
                  borderRadius: '12px',
                  marginBottom: '24px',
                }}
              >
                <p
                  style={{
                    margin: '0 0 12px 0',
                    fontSize: '0.9rem',
                    color: '#999',
                    fontWeight: 600,
                  }}
                >
                  CUSTOMER INFO
                </p>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <div>
                    <p style={{ margin: '0 0 4px 0', fontWeight: 600 }}>
                      {activeDelivery.customer?.name || 'Customer'}
                    </p>
                    <p style={{ margin: 0, fontSize: '0.9rem', color: '#666' }}>
                      {activeDelivery.customer?.phone || '+92 300 1234567'}
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '8px',
                        background: '#667eea',
                        color: 'white',
                        border: 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Phone size={18} />
                    </button>
                    <button
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '8px',
                        background: '#667eea',
                        color: 'white',
                        border: 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <MessageSquare size={18} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Complete Delivery Button */}
              <button
                onClick={completeDelivery}
                style={{
                  width: '100%',
                  padding: '16px',
                  borderRadius: '12px',
                  background:
                    'linear-gradient(135deg, #27ae60 0%, #229954 100%)',
                  color: 'white',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '1.1rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '12px',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow =
                    '0 6px 20px rgba(0,0,0,0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <CheckCircle size={24} />
                Complete Delivery
              </button>
            </div>
          ) : (
            <div
              style={{
                textAlign: 'center',
                padding: '60px 20px',
                background: '#f8f9fa',
                borderRadius: '16px',
              }}
            >
              <Package
                size={48}
                color="#ccc"
                style={{ marginBottom: '16px' }}
              />
              <h3 style={{ color: '#666', marginBottom: '8px' }}>
                No active delivery
              </h3>
              <p style={{ color: '#999' }}>Accept an order to start earning</p>
            </div>
          )}
        </div>
      )}

      {/* Available Orders */}
      {activeTab === 'available' && (
        <div style={{ marginBottom: '40px' }}>
          {availableOrders.length === 0 ? (
            <div
              style={{
                textAlign: 'center',
                padding: '60px 20px',
                background: '#f8f9fa',
                borderRadius: '16px',
              }}
            >
              <AlertCircle
                size={48}
                color="#ccc"
                style={{ marginBottom: '16px' }}
              />
              <h3 style={{ color: '#666', marginBottom: '8px' }}>
                No orders available
              </h3>
              <p style={{ color: '#999' }}>
                New orders will appear here. Stay online to receive orders!
              </p>
            </div>
          ) : (
            <div
              style={{
                display: 'grid',
                gap: '20px',
              }}
            >
              {availableOrders.map((order) => (
                <EnhancedOrderCard
                  key={order._id}
                  order={{
                    _id: order._id,
                    restaurantName: order.restaurant?.name || 'Restaurant',
                    restaurantRating: 4.8,
                    restaurantReviewCount: 245,
                    pickupDistance: order.distance || 2.5,
                    pickupEstimatedTime: 5,
                    dropoffDistance: order.distance || 2.5,
                    dropoffEstimatedTime: 15,
                    totalEstimatedTime: 20,
                    totalEarnings: order.estimatedEarnings || 120,
                    paymentType: Math.random() > 0.5 ? 'online' : 'cash',
                    isSurgeZone: Math.random() > 0.7,
                    surgeMultiplier: 1.5,
                    timeToExpiry: 60,
                  }}
                  onAccept={(orderId) => {
                    const acceptedOrder = availableOrders.find(
                      (o) => o._id === orderId
                    );
                    if (acceptedOrder) {
                      acceptOrder(acceptedOrder);
                    }
                  }}
                  onDecline={(orderId) => {
                    setAvailableOrders((prev) =>
                      prev.filter((o) => o._id !== orderId)
                    );
                    addNotification(
                      'Order Declined',
                      'Order has been declined'
                    );
                  }}
                  onExpire={(orderId) => {
                    setAvailableOrders((prev) =>
                      prev.filter((o) => o._id !== orderId)
                    );
                    addNotification(
                      'Order Expired',
                      'The order SLA timer expired'
                    );
                  }}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Completed Orders */}
      {activeTab === 'completed' && (
        <div style={{ marginBottom: '40px' }}>
          {completedOrders.length === 0 ? (
            <div
              style={{
                textAlign: 'center',
                padding: '60px 20px',
                background: '#f8f9fa',
                borderRadius: '16px',
              }}
            >
              <CheckCircle
                size={48}
                color="#ccc"
                style={{ marginBottom: '16px' }}
              />
              <h3 style={{ color: '#666', marginBottom: '8px' }}>
                No completed deliveries yet
              </h3>
              <p style={{ color: '#999' }}>
                Accept and complete orders to see them here
              </p>
            </div>
          ) : (
            <div
              style={{
                display: 'grid',
                gap: '12px',
              }}
            >
              {completedOrders.map((order) => (
                <div
                  key={order._id}
                  style={{
                    background: 'white',
                    padding: '16px',
                    borderRadius: '12px',
                    border: '1px solid #f0f0f0',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <div>
                    <p style={{ margin: '0 0 4px 0', fontWeight: 600 }}>
                      {order.restaurant.name}
                    </p>
                    <p style={{ margin: 0, fontSize: '0.9rem', color: '#666' }}>
                      ✅ Delivered at {order.completedTime || '2:30 PM'}
                    </p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p
                      style={{
                        margin: 0,
                        fontSize: '1.1rem',
                        fontWeight: 700,
                        color: '#27ae60',
                      }}
                    >
                      +Rs. {order.estimatedEarnings}
                    </p>
                    <p
                      style={{
                        margin: '4px 0 0 0',
                        fontSize: '0.9rem',
                        color: '#999',
                      }}
                    >
                      Rating: {order.rating || '5'} ⭐
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      {/* Profile & Vehicle Section */}
      {activeTab === 'profile' && (
        <div style={{ maxWidth: '800px' }}>
          <div
            className="card shadow-premium"
            style={{
              background: 'white',
              padding: '30px',
              borderRadius: '20px',
            }}
          >
            <h2 style={{ marginBottom: '24px' }}>Profile & Vehicle Settings</h2>
            <form onSubmit={handleUpdateProfile}>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '20px',
                  marginBottom: '30px',
                }}
              >
                <div>
                  <label
                    style={{
                      display: 'block',
                      marginBottom: '8px',
                      fontWeight: 600,
                      color: '#666',
                    }}
                  >
                    Full Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={profileData.name}
                    onChange={(e) =>
                      setProfileData({ ...profileData, name: e.target.value })
                    }
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      border: '1px solid #ddd',
                    }}
                  />
                </div>
                <div>
                  <label
                    style={{
                      display: 'block',
                      marginBottom: '8px',
                      fontWeight: 600,
                      color: '#666',
                    }}
                  >
                    Phone Number
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={profileData.phone}
                    onChange={(e) =>
                      setProfileData({ ...profileData, phone: e.target.value })
                    }
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      border: '1px solid #ddd',
                    }}
                  />
                </div>
                <div style={{ gridColumn: 'span 2' }}>
                  <label
                    style={{
                      display: 'block',
                      marginBottom: '8px',
                      fontWeight: 600,
                      color: '#666',
                    }}
                  >
                    Base Address
                  </label>
                  <textarea
                    className="form-control"
                    value={profileData.address}
                    onChange={(e) =>
                      setProfileData({
                        ...profileData,
                        address: e.target.value,
                      })
                    }
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      border: '1px solid #ddd',
                      minHeight: '80px',
                    }}
                  />
                </div>
              </div>

              <div style={{ borderTop: '1px solid #eee', paddingTop: '30px' }}>
                <h3
                  style={{
                    marginBottom: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                  }}
                >
                  <Shield size={20} color="#667eea" /> Vehicle Details
                </h3>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr 1fr',
                    gap: '20px',
                    marginBottom: '30px',
                  }}
                >
                  <div>
                    <label
                      style={{
                        display: 'block',
                        marginBottom: '8px',
                        fontWeight: 600,
                        color: '#666',
                      }}
                    >
                      Vehicle Type
                    </label>
                    <select
                      value={profileData.vehicleInfo?.vehicleType}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          vehicleInfo: {
                            ...profileData.vehicleInfo,
                            vehicleType: e.target.value,
                          },
                        })
                      }
                      style={{
                        width: '100%',
                        padding: '12px',
                        borderRadius: '8px',
                        border: '1px solid #ddd',
                      }}
                    >
                      <option value="bike">Motorcycle (Bike)</option>
                      <option value="car">Car / Van</option>
                      <option value="bicycle">Bicycle</option>
                    </select>
                  </div>
                  <div>
                    <label
                      style={{
                        display: 'block',
                        marginBottom: '8px',
                        fontWeight: 600,
                        color: '#666',
                      }}
                    >
                      Plate Number
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. ABC-1234"
                      value={profileData.vehicleInfo?.plateNumber}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          vehicleInfo: {
                            ...profileData.vehicleInfo,
                            plateNumber: e.target.value,
                          },
                        })
                      }
                      style={{
                        width: '100%',
                        padding: '12px',
                        borderRadius: '8px',
                        border: '1px solid #ddd',
                      }}
                    />
                  </div>
                  <div>
                    <label
                      style={{
                        display: 'block',
                        marginBottom: '8px',
                        fontWeight: 600,
                        color: '#666',
                      }}
                    >
                      Model Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Honda 125"
                      value={profileData.vehicleInfo?.model}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          vehicleInfo: {
                            ...profileData.vehicleInfo,
                            model: e.target.value,
                          },
                        })
                      }
                      style={{
                        width: '100%',
                        padding: '12px',
                        borderRadius: '8px',
                        border: '1px solid #ddd',
                      }}
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                style={{
                  width: '100%',
                  padding: '16px',
                  borderRadius: '12px',
                  background: '#667eea',
                  color: 'white',
                  border: 'none',
                  fontWeight: 700,
                  fontSize: '1.1rem',
                  cursor: 'pointer',
                  boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)',
                }}
              >
                Save Profile Changes
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// Mock Data
const getMockAvailableOrders = () => [
  {
    _id: '001',
    restaurant: { name: 'Burger Lab', latitude: 24.8615, longitude: 67.0045 },
    itemCount: 3,
    distance: 2.5,
    estimatedEarnings: 120,
    deliveryAddress: 'Clifton Block 4, Karachi',
    deliveryLocation: { latitude: 24.85, longitude: 67.01 },
    customer: { name: 'Ahmed Khan', phone: '+92 300 1234567' },
  },
  {
    _id: '002',
    restaurant: { name: 'Pizza Hut', latitude: 24.858, longitude: 67.009 },
    itemCount: 2,
    distance: 3.2,
    estimatedEarnings: 150,
    deliveryAddress: 'Defence, Karachi',
    deliveryLocation: { latitude: 24.845, longitude: 67.015 },
    customer: { name: 'Fatima Ali', phone: '+92 301 9876543' },
  },
];

const getMockCompletedOrders = () => [
  {
    _id: '003',
    restaurant: { name: 'Kababjees' },
    estimatedEarnings: 100,
    completedTime: '1:45 PM',
    rating: 5,
  },
];

export default RiderDashboard;
