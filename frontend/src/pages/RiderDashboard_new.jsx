import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { useNavigate } from 'react-router-dom';
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
} from 'lucide-react';
import MapComponent from '../components/MapComponent';
import { getUserLocation } from '../utils/googleMapsService';
import api from '../api';
import './Dashboard.css';

const RiderDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { addNotification } = useNotification();

  const [availableOrders, setAvailableOrders] = useState([]);
  const [activeTask, setActiveTask] = useState(null);
  const [isOnline, setIsOnline] = useState(true);
  const [earnings, setEarnings] = useState(4500);
  const [todayEarnings, setTodayEarnings] = useState(850);
  const [riderLocation, setRiderLocation] = useState(null);
  const [deliveryHistory, setDeliveryHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalDeliveries: 142,
    rating: 4.8,
    acceptanceRate: 92,
  });

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
            isFallback: true,
          };
          addNotification('Location', 'Using fallback location (Karachi)');
        }
        setRiderLocation(location);
        fetchAvailableOrders();
        fetchDeliveryHistory();
      } catch (error) {
        console.error('Error getting location:', error);
        // Fallback location
        setRiderLocation({
          latitude: 24.8607,
          longitude: 67.0011,
          isFallback: true,
        });
      } finally {
        setLoading(false);
      }
    };

    initializeDashboard();
  }, []);

  const fetchAvailableOrders = async () => {
    try {
      const res = await api.get('/rider/available-orders');
      setAvailableOrders(res.data || getMockOrders());
    } catch (error) {
      setAvailableOrders(getMockOrders());
    }
  };

  const fetchDeliveryHistory = async () => {
    try {
      const res = await api.get('/rider/delivery-history');
      setDeliveryHistory(res.data || getMockHistory());
    } catch (error) {
      setDeliveryHistory(getMockHistory());
    }
  };

  const toggleStatus = () => {
    setIsOnline(!isOnline);
    addNotification(
      'Status Updated',
      isOnline ? 'You are now Offline' : 'You are now Online'
    );
  };

  const acceptOrder = (order) => {
    setActiveTask(order);
    setAvailableOrders((prev) => prev.filter((o) => o._id !== order._id));
    addNotification('Order Accepted! 🎉', `Head to ${order.restaurant.name}`);
  };

  const completeDelivery = () => {
    setTodayEarnings((prev) => prev + activeTask.estEarnings);
    setEarnings((prev) => prev + activeTask.estEarnings);
    addNotification(
      'Delivery Completed! 🚀',
      `You earned Rs. ${activeTask.estEarnings}`
    );
    setDeliveryHistory((prev) => [
      {
        _id: Date.now(),
        restaurant: activeTask.restaurant.name,
        address: activeTask.deliveryAddress,
        amount: activeTask.estEarnings,
        status: 'completed',
        time: new Date().toLocaleTimeString(),
      },
      ...prev,
    ]);
    setActiveTask(null);
  };

  const cancelDelivery = () => {
    addNotification('Delivery Cancelled', 'Order returned to queue');
    setActiveTask(null);
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Initializing rider dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container professional-dashboard">
      {/* Header */}
      <div style={{ marginBottom: '40px' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px',
          }}
        >
          <div>
            <h1
              style={{
                fontSize: '2.2rem',
                fontWeight: 700,
                margin: '0 0 8px 0',
              }}
            >
              Welcome, {user?.name.split(' ')[0]}! 🚴
            </h1>
            <p style={{ color: '#666', margin: 0, fontSize: '1rem' }}>
              Ready to deliver today?
            </p>
          </div>
          <button
            onClick={toggleStatus}
            style={{
              padding: '12px 24px',
              borderRadius: '50px',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 700,
              fontSize: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: isOnline
                ? 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'
                : '#f0f0f0',
              color: isOnline ? 'white' : '#666',
              boxShadow: isOnline
                ? '0 4px 15px rgba(67, 233, 123, 0.3)'
                : 'none',
            }}
          >
            {isOnline ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}
            {isOnline ? 'Online' : 'Offline'}
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '20px',
          marginBottom: '40px',
        }}
      >
        {[
          {
            label: 'Total Earnings',
            value: `Rs. ${earnings.toLocaleString()}`,
            icon: <Wallet size={24} />,
            color: '#667eea',
          },
          {
            label: "Today's Earnings",
            value: `Rs. ${todayEarnings}`,
            icon: <DollarSign size={24} />,
            color: '#43e97b',
          },
          {
            label: 'Total Deliveries',
            value: stats.totalDeliveries,
            icon: <Package size={24} />,
            color: '#f093fb',
          },
          {
            label: 'Rating',
            value: `⭐ ${stats.rating}`,
            icon: <Star size={24} />,
            color: '#fa709a',
          },
        ].map((stat, idx) => (
          <div
            key={idx}
            style={{
              background: 'white',
              padding: '20px',
              borderRadius: '12px',
              border: '1px solid #e0e0e0',
              boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '12px',
              }}
            >
              <span style={{ color: '#999', fontSize: '0.85rem' }}>
                {stat.label}
              </span>
              <div style={{ color: stat.color }}>{stat.icon}</div>
            </div>
            <h3 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 700 }}>
              {stat.value}
            </h3>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: activeTask ? '1fr' : '2fr 1fr',
          gap: '24px',
          marginBottom: '40px',
        }}
      >
        {/* Active Delivery or Available Orders */}
        {activeTask ? (
          <div
            style={{
              background: 'white',
              borderRadius: '16px',
              border: '2px solid #43e97b',
              overflow: 'hidden',
              boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
            }}
          >
            {/* Map */}
            {riderLocation && (
              <MapComponent
                latitude={riderLocation.latitude}
                longitude={riderLocation.longitude}
                zoom={15}
                height="300px"
                markers={[
                  {
                    latitude: riderLocation.latitude + 0.01,
                    longitude: riderLocation.longitude + 0.01,
                    title: activeTask.restaurant.name,
                    icon: 'http://maps.google.com/mapfiles/ms/icons/orange-dot.png',
                  },
                  {
                    latitude: riderLocation.latitude - 0.015,
                    longitude: riderLocation.longitude - 0.015,
                    title: 'Delivery Location',
                    icon: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png',
                  },
                ]}
              />
            )}

            {/* Delivery Details */}
            <div style={{ padding: '24px' }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '20px',
                }}
              >
                <h2 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 700 }}>
                  Active Delivery
                </h2>
                <span
                  style={{
                    background: '#e8f5e9',
                    color: '#27ae60',
                    padding: '6px 12px',
                    borderRadius: '20px',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <Clock size={16} /> 12:45 mins
                </span>
              </div>

              {/* Route Information */}
              <div
                style={{
                  background: '#f8f9fa',
                  padding: '16px',
                  borderRadius: '12px',
                  marginBottom: '20px',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    marginBottom: '16px',
                  }}
                >
                  <div
                    style={{
                      width: '12px',
                      height: '12px',
                      borderRadius: '50%',
                      background: '#ff9800',
                    }}
                  />
                  <div>
                    <p style={{ margin: 0, fontSize: '0.9rem', color: '#999' }}>
                      Pickup
                    </p>
                    <p
                      style={{
                        margin: 0,
                        fontWeight: 600,
                        fontSize: '0.95rem',
                      }}
                    >
                      {activeTask.restaurant.name}
                    </p>
                  </div>
                </div>

                <div
                  style={{
                    width: '2px',
                    height: '24px',
                    background: '#e0e0e0',
                    marginLeft: '5px',
                    marginBottom: '8px',
                  }}
                />

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                  }}
                >
                  <div
                    style={{
                      width: '12px',
                      height: '12px',
                      borderRadius: '50%',
                      background: '#f44336',
                    }}
                  />
                  <div>
                    <p style={{ margin: 0, fontSize: '0.9rem', color: '#999' }}>
                      Dropoff
                    </p>
                    <p
                      style={{
                        margin: 0,
                        fontWeight: 600,
                        fontSize: '0.95rem',
                      }}
                    >
                      {activeTask.deliveryAddress}
                    </p>
                  </div>
                </div>
              </div>

              {/* Delivery Amount */}
              <div
                style={{
                  background:
                    'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
                  color: 'white',
                  padding: '16px',
                  borderRadius: '12px',
                  marginBottom: '20px',
                  textAlign: 'center',
                }}
              >
                <p style={{ margin: '0 0 4px 0', fontSize: '0.85rem' }}>
                  You'll earn
                </p>
                <h3 style={{ margin: 0, fontSize: '1.8rem', fontWeight: 700 }}>
                  Rs. {activeTask.estEarnings}
                </h3>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  onClick={completeDelivery}
                  style={{
                    flex: 1,
                    padding: '12px',
                    background:
                      'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: 700,
                    fontSize: '0.95rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow =
                      '0 6px 20px rgba(67, 233, 123, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <CheckCircle size={20} />
                  Complete Delivery
                </button>
                <button
                  onClick={cancelDelivery}
                  style={{
                    flex: 1,
                    padding: '12px',
                    background: '#f0f0f0',
                    color: '#666',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: 600,
                    fontSize: '0.95rem',
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Available Orders */}
            <div
              style={{
                background: 'white',
                borderRadius: '16px',
                border: '1px solid #e0e0e0',
                padding: '24px',
              }}
            >
              <h2
                style={{
                  fontSize: '1.3rem',
                  fontWeight: 700,
                  margin: '0 0 20px 0',
                }}
              >
                Available Orders ({availableOrders.length})
              </h2>

              {availableOrders.length === 0 ? (
                <div
                  style={{
                    textAlign: 'center',
                    padding: '40px 20px',
                    color: '#999',
                  }}
                >
                  <AlertCircle
                    size={48}
                    style={{ marginBottom: '16px', opacity: 0.5 }}
                  />
                  <p>No orders available right now</p>
                  <p style={{ fontSize: '0.9rem' }}>
                    Check back soon or increase your service area
                  </p>
                </div>
              ) : (
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px',
                  }}
                >
                  {availableOrders.map((order) => (
                    <div
                      key={order._id}
                      style={{
                        background: '#f8f9fa',
                        padding: '16px',
                        borderRadius: '12px',
                        border: '1px solid #e0e0e0',
                        transition: 'all 0.3s ease',
                        cursor: 'pointer',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.boxShadow =
                          '0 4px 15px rgba(0,0,0,0.1)';
                        e.currentTarget.style.background = 'white';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.boxShadow = 'none';
                        e.currentTarget.style.background = '#f8f9fa';
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          marginBottom: '12px',
                        }}
                      >
                        <div>
                          <h4 style={{ margin: '0 0 4px 0', fontWeight: 700 }}>
                            {order.restaurant.name}
                          </h4>
                          <p
                            style={{
                              margin: 0,
                              fontSize: '0.85rem',
                              color: '#666',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                            }}
                          >
                            <MapPin size={14} />
                            {order.deliveryAddress} • {order.distance}
                          </p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <h3
                            style={{
                              margin: 0,
                              fontSize: '1.2rem',
                              fontWeight: 700,
                              color: '#43e97b',
                            }}
                          >
                            Rs. {order.estEarnings}
                          </h3>
                          <p
                            style={{
                              margin: '4px 0 0 0',
                              fontSize: '0.8rem',
                              color: '#999',
                            }}
                          >
                            Order: Rs. {order.totalAmount}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => acceptOrder(order)}
                        style={{
                          width: '100%',
                          padding: '10px',
                          background:
                            'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          color: 'white',
                          border: 'none',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          fontWeight: 700,
                          transition: 'all 0.3s ease',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'scale(1.02)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'scale(1)';
                        }}
                      >
                        Accept Order
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Stats Sidebar */}
            <div
              style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
            >
              {/* Performance */}
              <div
                style={{
                  background: 'white',
                  borderRadius: '12px',
                  border: '1px solid #e0e0e0',
                  padding: '16px',
                }}
              >
                <h3
                  style={{
                    margin: '0 0 16px 0',
                    fontSize: '1rem',
                    fontWeight: 700,
                  }}
                >
                  Performance
                </h3>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                  }}
                >
                  {[
                    { label: 'Acceptance', value: '92%', color: '#43e97b' },
                    { label: 'On-Time', value: '98%', color: '#667eea' },
                    { label: 'Cancellation', value: '2%', color: '#f093fb' },
                  ].map((item) => (
                    <div key={item.label}>
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          marginBottom: '4px',
                        }}
                      >
                        <span style={{ fontSize: '0.85rem', color: '#666' }}>
                          {item.label}
                        </span>
                        <span
                          style={{
                            fontWeight: 700,
                            color: item.color,
                          }}
                        >
                          {item.value}
                        </span>
                      </div>
                      <div
                        style={{
                          height: '6px',
                          background: '#e0e0e0',
                          borderRadius: '3px',
                          overflow: 'hidden',
                        }}
                      >
                        <div
                          style={{
                            height: '100%',
                            width: item.value,
                            background: item.color,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div
                style={{
                  background: 'white',
                  borderRadius: '12px',
                  border: '1px solid #e0e0e0',
                  padding: '16px',
                }}
              >
                <h3
                  style={{
                    margin: '0 0 16px 0',
                    fontSize: '1rem',
                    fontWeight: 700,
                  }}
                >
                  Quick Actions
                </h3>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                  }}
                >
                  <button
                    style={{
                      padding: '10px',
                      background: '#e3f2fd',
                      color: '#1976d2',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontWeight: 600,
                      fontSize: '0.9rem',
                    }}
                  >
                    View Wallet
                  </button>
                  <button
                    style={{
                      padding: '10px',
                      background: '#f3e5f5',
                      color: '#7b1fa2',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontWeight: 600,
                      fontSize: '0.9rem',
                    }}
                  >
                    Support
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Delivery History */}
      {deliveryHistory.length > 0 && !activeTask && (
        <div
          style={{
            background: 'white',
            borderRadius: '12px',
            border: '1px solid #e0e0e0',
            padding: '24px',
          }}
        >
          <h2
            style={{
              fontSize: '1.2rem',
              fontWeight: 700,
              margin: '0 0 16px 0',
            }}
          >
            Recent Deliveries
          </h2>
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
          >
            {deliveryHistory.slice(0, 5).map((delivery) => (
              <div
                key={delivery._id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '12px',
                  background: '#f8f9fa',
                  borderRadius: '8px',
                  borderLeft: '4px solid #43e97b',
                }}
              >
                <div>
                  <p style={{ margin: 0, fontWeight: 600 }}>
                    {delivery.restaurant}
                  </p>
                  <p
                    style={{
                      margin: '4px 0 0 0',
                      fontSize: '0.85rem',
                      color: '#666',
                    }}
                  >
                    {delivery.address}
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ margin: 0, fontWeight: 700, color: '#43e97b' }}>
                    Rs. {delivery.amount}
                  </p>
                  <p
                    style={{
                      margin: '4px 0 0 0',
                      fontSize: '0.8rem',
                      color: '#999',
                    }}
                  >
                    {delivery.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Mock Data
const getMockOrders = () => [
  {
    _id: '101',
    restaurant: { name: 'Burger Lab' },
    deliveryAddress: 'Clifton Block 4, Karachi',
    totalAmount: 1200,
    distance: '3.2 km',
    estEarnings: 150,
  },
  {
    _id: '102',
    restaurant: { name: 'Pizza Hut' },
    deliveryAddress: 'DHA Phase 6, Karachi',
    totalAmount: 1850,
    distance: '5.5 km',
    estEarnings: 220,
  },
  {
    _id: '103',
    restaurant: { name: 'Kababjees' },
    deliveryAddress: 'Gulberg, Lahore',
    totalAmount: 950,
    distance: '2.1 km',
    estEarnings: 120,
  },
];

const getMockHistory = () => [
  {
    _id: 1,
    restaurant: 'KFC',
    address: 'Mall Road, Lahore',
    amount: 140,
    status: 'completed',
    time: '2:30 PM',
  },
  {
    _id: 2,
    restaurant: 'Subway',
    address: 'Defence, Lahore',
    amount: 110,
    status: 'completed',
    time: '1:45 PM',
  },
  {
    _id: 3,
    restaurant: "McDonald's",
    address: 'Johar Town, Lahore',
    amount: 130,
    status: 'completed',
    time: '12:15 PM',
  },
];

export default RiderDashboard;
