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
} from 'lucide-react';
import api from '../api';
import './Dashboard.css';

const RiderDashboard = () => {
  const { user } = useAuth();
  const { addNotification } = useNotification();
  const [availableOrders, setAvailableOrders] = useState([]);
  const [activeTask, setActiveTask] = useState(null);
  const [isOnline, setIsOnline] = useState(true);
  const [earnings, setEarnings] = useState(1500); // Mock starting balance
  const [loading, setLoading] = useState(true);

  // Mock Request Data
  useEffect(() => {
    // Simulate fetching requests
    const mockRequests = [
      {
        _id: '101',
        restaurant: { name: 'Burger Lab' },
        deliveryAddress: 'Clifton Block 4',
        totalAmount: 850,
        distance: '3.2 km',
        estEarnings: 120,
      },
      {
        _id: '102',
        restaurant: { name: 'Pizza Hut' },
        deliveryAddress: 'DHA Phase 6',
        totalAmount: 1400,
        distance: '5.5 km',
        estEarnings: 180,
      },
    ];
    setAvailableOrders(mockRequests);
    setLoading(false);
  }, []);

  const toggleStatus = () => {
    setIsOnline(!isOnline);
    addNotification(
      'Status Update',
      isOnline ? 'You are now Offline' : 'You are now Online'
    );
  };

  const acceptOrder = (order) => {
    setActiveTask(order);
    setAvailableOrders((prev) => prev.filter((o) => o._id !== order._id));
    addNotification('Order Accepted', `Head to ${order.restaurant.name}`);
  };

  const completeDelivery = () => {
    setEarnings((prev) => prev + activeTask.estEarnings);
    addNotification(
      'Delivery Completed',
      `You earned Rs. ${activeTask.estEarnings}`
    );
    setActiveTask(null);
    // Logic to fetch more...
  };

  if (loading)
    return <div className="loading-state">Loading Rider Dashboard...</div>;

  return (
    <div className="dashboard-container">
      {/* Header with Toggle */}
      <div className="dashboard-header">
        <div>
          <h1>Rider Dashboard</h1>
          <p>Ride safe, {user?.name}</p>
        </div>
        <div
          className={`rider-status ${isOnline ? 'online' : 'offline'}`}
          onClick={toggleStatus}
          style={{
            cursor: 'pointer',
            background: isOnline ? '#e8f5e9' : '#ffebee',
            color: isOnline ? '#27ae60' : '#c62828',
          }}
        >
          {isOnline ? <ToggleRight size={40} /> : <ToggleLeft size={40} />}
          <span>{isOnline ? 'Online' : 'Offline'}</span>
        </div>
      </div>

      <div
        className="rider-grid-layout"
        style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}
      >
        {/* Main Column */}
        <div className="rider-main">
          {/* Active Delivery Section */}
          {activeTask ? (
            <div
              className="active-delivery-card-large"
              style={{
                background: 'white',
                padding: '24px',
                borderRadius: '16px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                border: '2px solid #27ae60',
              }}
            >
              <div
                className="task-header"
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '20px',
                }}
              >
                <h2 style={{ margin: 0, color: '#27ae60' }}>Active Delivery</h2>
                <span
                  className="timer"
                  style={{
                    background: '#e8f5e9',
                    padding: '4px 12px',
                    borderRadius: '20px',
                    display: 'flex',
                    gap: '6px',
                    alignItems: 'center',
                  }}
                >
                  <Clock size={16} /> 14:30 mins left
                </span>
              </div>

              <div
                className="map-placeholder"
                style={{
                  height: '200px',
                  background: '#eee',
                  borderRadius: '12px',
                  marginBottom: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#666',
                }}
              >
                <MapPin size={32} /> Google Navigation Overlay
              </div>

              <div className="delivery-steps" style={{ marginBottom: '20px' }}>
                <div className="step active" style={{ marginBottom: '10px' }}>
                  <strong>Pickup:</strong> {activeTask.restaurant.name}
                </div>
                <div className="step">
                  <strong>Dropoff:</strong> {activeTask.deliveryAddress}
                </div>
              </div>

              <div
                className="task-actions"
                style={{ display: 'flex', gap: '12px' }}
              >
                <button
                  className="btn-primary"
                  style={{ flex: 1 }}
                  onClick={completeDelivery}
                >
                  <CheckCircle size={18} /> Complete Delivery
                </button>
                <button className="btn-outline" style={{ flex: 1 }}>
                  <Navigation size={18} /> Navigate
                </button>
              </div>
            </div>
          ) : (
            <div className="new-requests-section">
              <h3>New Requests ({availableOrders.length})</h3>
              {availableOrders.length === 0 ? (
                <p>No new requests nearby.</p>
              ) : (
                <div
                  className="requests-stack"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px',
                  }}
                >
                  {availableOrders.map((req) => (
                    <div
                      key={req._id}
                      className="request-card"
                      style={{
                        background: 'white',
                        padding: '20px',
                        borderRadius: '12px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <div className="req-info">
                        <h4 style={{ margin: '0 0 4px 0' }}>
                          {req.restaurant.name}
                        </h4>
                        <p
                          style={{
                            margin: 0,
                            color: '#666',
                            fontSize: '0.9rem',
                          }}
                        >
                          <MapPin size={14} /> {req.deliveryAddress} •{' '}
                          {req.distance}
                        </p>
                      </div>
                      <div
                        className="req-earnings"
                        style={{ textAlign: 'right' }}
                      >
                        <h3 style={{ margin: '0 0 4px 0', color: '#27ae60' }}>
                          Rs. {req.estEarnings}
                        </h3>
                        <div
                          className="req-actions"
                          style={{ display: 'flex', gap: '8px' }}
                        >
                          <button
                            className="btn-primary-small"
                            onClick={() => acceptOrder(req)}
                            style={{
                              background: '#27ae60',
                              border: 'none',
                              color: 'white',
                              padding: '6px 12px',
                              borderRadius: '6px',
                              cursor: 'pointer',
                            }}
                          >
                            Accept
                          </button>
                          <button
                            className="btn-outline"
                            style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                          >
                            Reject
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Delivery History Stub */}
          <div className="history-section" style={{ marginTop: '30px' }}>
            <h3>Last 3 Deliveries</h3>
            <div className="mini-history-list">
              {/* Mock History */}
              <div
                style={{
                  padding: '12px',
                  borderBottom: '1px solid #eee',
                  background: 'white',
                }}
              >
                KFC - Delivered - Rs. 140
              </div>
              <div
                style={{
                  padding: '12px',
                  borderBottom: '1px solid #eee',
                  background: 'white',
                }}
              >
                Subway - Delivered - Rs. 110
              </div>
              <div
                style={{
                  padding: '12px',
                  borderBottom: '1px solid #eee',
                  background: 'white',
                }}
              >
                OPTP - Delivered - Rs. 160
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Column (Earnings, Wallet, Profile) */}
        <div
          className="rider-sidebar"
          style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
        >
          <div
            className="wallet-card"
            style={{
              background: 'linear-gradient(135deg, #2c3e50 0%, #000000 100%)',
              color: 'white',
              padding: '24px',
              borderRadius: '16px',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '16px',
              }}
            >
              <span>Wallet Balance</span>
              <Wallet size={20} />
            </div>
            <h2 style={{ fontSize: '2.5rem', margin: 0 }}>Rs. {earnings}</h2>
            <button
              style={{
                width: '100%',
                marginTop: '20px',
                padding: '10px',
                background: 'rgba(255,255,255,0.2)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
              }}
            >
              Withdraw Funds
            </button>
          </div>

          <div
            className="stats-mini-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '12px',
            }}
          >
            <div
              style={{
                background: 'white',
                padding: '16px',
                borderRadius: '12px',
                textAlign: 'center',
              }}
            >
              <Star
                size={20}
                color="#f39c12"
                style={{ margin: '0 auto 8px' }}
              />
              <h4 style={{ margin: 0 }}>4.9</h4>
              <small style={{ color: '#666' }}>Rating</small>
            </div>
            <div
              style={{
                background: 'white',
                padding: '16px',
                borderRadius: '12px',
                textAlign: 'center',
              }}
            >
              <Package
                size={20}
                color="#2980b9"
                style={{ margin: '0 auto 8px' }}
              />
              <h4 style={{ margin: 0 }}>12</h4>
              <small style={{ color: '#666' }}>Trips</small>
            </div>
          </div>

          <div
            className="profile-docs-menu"
            style={{
              background: 'white',
              borderRadius: '12px',
              padding: '8px 0',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                padding: '12px 20px',
                borderBottom: '1px solid #f0f0f0',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                cursor: 'pointer',
              }}
            >
              <FileText size={18} color="#666" /> My Documents
            </div>
            <div
              style={{
                padding: '12px 20px',
                borderBottom: '1px solid #f0f0f0',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                cursor: 'pointer',
              }}
            >
              <Bike size={18} color="#666" /> Vehicle Info
            </div>
            <div
              style={{
                padding: '12px 20px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                cursor: 'pointer',
              }}
            >
              <Shield size={18} color="#666" /> Support & Help
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RiderDashboard;
