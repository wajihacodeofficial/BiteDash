import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLocation } from '../context/LocationContext';
import {
  User,
  ShoppingBag,
  MapPin,
  Heart,
  LogOut,
  Edit2,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
} from 'lucide-react';
import api from '../api';
import './Dashboard.css';
import { toast } from 'react-hot-toast';
import { useSocket } from '../context/SocketContext';

const CustomerDashboard = () => {
  const { user, logout } = useAuth();
  const { location } = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  // Profile state
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    paymentMethods: user?.paymentMethods || [],
  });

  const [newCard, setNewCard] = useState({
    cardHolderName: '',
    cardNumber: '',
    expiryDate: '',
    cardType: 'visa',
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.get('/users/profile');
      setProfileData(res.data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const { socket } = useSocket();
  const [trackingOrder, setTrackingOrder] = useState(null);

  const tabParam = searchParams.get('tab');

  useEffect(() => {
    if (tabParam) {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  useEffect(() => {
    if (activeTab === 'orders') {
      fetchOrders();
    }
  }, [activeTab]);

  useEffect(() => {
    if (socket) {
      socket.on('order_status_changed', (data) => {
        const { orderId, status } = data;
        setOrders((prev) =>
          prev.map((o) => (o._id === orderId ? { ...o, status } : o))
        );
        if (trackingOrder && trackingOrder._id === orderId) {
          setTrackingOrder((prev) => ({ ...prev, status }));
        }
        toast.success(
          `Order #${orderId.slice(-6).toUpperCase()} status: ${status}`
        );
      });
      return () => socket.off('order_status_changed');
    }
  }, [socket, trackingOrder]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await api.get('/orders/myorders');
      setOrders(res.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setLoading(false);
    }
  };

  const handleTrackOrder = (order) => {
    setTrackingOrder(order);
    setActiveTab('tracking');
    // Join room for this order
    if (socket) {
      socket.emit('join_order', order._id);
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

  const handleAddCard = () => {
    if (!newCard.cardNumber || !newCard.cardHolderName) {
      toast.error('Please fill card details');
      return;
    }
    const updatedCards = [
      ...profileData.paymentMethods,
      { ...newCard, isDefault: profileData.paymentMethods.length === 0 },
    ];
    setProfileData({ ...profileData, paymentMethods: updatedCards });
    setNewCard({
      cardHolderName: '',
      cardNumber: '',
      expiryDate: '',
      cardType: 'visa',
    });
    toast.success('Card added! Save profile to persist changes.');
  };

  const handleRemoveCard = (index) => {
    const updatedCards = profileData.paymentMethods.filter(
      (_, i) => i !== index
    );
    setProfileData({ ...profileData, paymentMethods: updatedCards });
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  const statusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'preparing':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'cancelled':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="dashboard-container">
      {/* Header */}
      <div className="dashboard-header">
        <div>
          <h1>Hello, {user?.name}! 👋</h1>
          <p>Welcome to your personal dashboard</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div className="location-picker">
            <MapPin size={18} color="#d92662" />
            <div className="location-info">
              <span className="label">Current Location</span>
              <span className="address">
                {location?.address
                  ? location.address.substring(0, 30) + '...'
                  : 'Select Location'}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
        {/* Sidebar Nav */}
        <div
          className="dashboard-sidebar card"
          style={{
            width: '250px',
            background: 'white',
            borderRadius: '12px',
            padding: '16px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          }}
        >
          <button
            className={`sidebar-btn ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => handleTabChange('orders')}
          >
            <ShoppingBag size={20} /> My Orders
          </button>
          <button
            className={`sidebar-btn ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => handleTabChange('profile')}
          >
            <User size={20} /> Profile
          </button>
          <button
            className={`sidebar-btn ${
              activeTab === 'addresses' ? 'active' : ''
            }`}
            onClick={() => handleTabChange('addresses')}
          >
            <MapPin size={20} /> Addresses
          </button>
          <button
            className={`sidebar-btn ${
              activeTab === 'favourites' ? 'active' : ''
            }`}
            onClick={() => handleTabChange('favourites')}
          >
            <Heart size={20} /> Favourites
          </button>

          <div
            className="divider"
            style={{ margin: '12px 0', borderTop: '1px solid #eee' }}
          ></div>

          <button
            onClick={logout}
            className="sidebar-btn logout"
            style={{ color: '#e74c3c' }}
          >
            <LogOut size={20} /> Logout
          </button>
        </div>

        {/* Main Content */}
        <div style={{ flex: 1 }}>
          {activeTab === 'orders' && (
            <div className="dashboard-section">
              <div className="section-header">
                <h2>Your Orders</h2>
              </div>

              {loading ? (
                <div className="loading-state">
                  <div className="spinner"></div>
                  <p>Loading your delicious history...</p>
                </div>
              ) : orders.length > 0 ? (
                <div className="orders-list">
                  {orders.map((order) => (
                    <div key={order._id} className="order-card">
                      <div className="order-header">
                        <div style={{ display: 'flex', gap: '16px' }}>
                          <img
                            src={
                              order.restaurant?.image ||
                              'https://via.placeholder.com/60'
                            }
                            alt={order.restaurant?.name}
                            style={{
                              width: '60px',
                              height: '60px',
                              borderRadius: '8px',
                              objectFit: 'cover',
                            }}
                          />
                          <div>
                            <h3>{order.restaurant?.name}</h3>
                            <div className="order-meta">
                              <span>
                                {new Date(order.createdAt).toLocaleDateString()}
                              </span>
                              <span>•</span>
                              <span>Rs. {order.totalAmount}</span>
                            </div>
                          </div>
                        </div>
                        <div
                          className={`status-badge ${statusColor(
                            order.status === 'Delivered' ? 'success' : 'warning'
                          )}`}
                          style={{
                            backgroundColor:
                              order.status === 'Delivered'
                                ? '#27ae60'
                                : '#f39c12',
                            color: 'white',
                          }}
                        >
                          {order.status}
                        </div>
                      </div>

                      <div className="order-items">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="order-item">
                            <span>
                              {item.quantity}x {item.name}
                            </span>
                            <span>Rs. {item.price * item.quantity}</span>
                          </div>
                        ))}
                      </div>

                      <div className="order-footer">
                        <button
                          className="btn-outline-small"
                          onClick={() => handleTrackOrder(order)}
                        >
                          Track Order
                        </button>
                        {order.status === 'delivered' && (
                          <button className="btn-primary-small">Reorder</button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <div style={{ fontSize: '4rem', marginBottom: '20px' }}>
                    🍔
                  </div>
                  <h3>No orders yet</h3>
                  <p>Go ahead and order some delicious food!</p>
                  <button
                    className="btn-primary"
                    onClick={() => navigate('/restaurants')}
                  >
                    Browse Restaurants
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="dashboard-section">
              <div className="section-header">
                <h2>Edit Profile</h2>
              </div>
              <form
                onSubmit={handleUpdateProfile}
                style={{ maxWidth: '600px', width: '100%' }}
              >
                <div className="form-group" style={{ marginBottom: '20px' }}>
                  <label
                    style={{
                      display: 'block',
                      marginBottom: '8px',
                      fontWeight: 500,
                    }}
                  >
                    Full Name
                  </label>
                  <div style={{ position: 'relative' }}>
                    <User
                      size={18}
                      style={{
                        position: 'absolute',
                        left: '12px',
                        top: '14px',
                        color: '#999',
                      }}
                    />
                    <input
                      type="text"
                      value={profileData.name}
                      onChange={(e) =>
                        setProfileData({ ...profileData, name: e.target.value })
                      }
                      style={{
                        width: '100%',
                        padding: '12px 12px 12px 40px',
                        border: '1px solid #ddd',
                        borderRadius: '8px',
                      }}
                    />
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: '20px' }}>
                  <label
                    style={{
                      display: 'block',
                      marginBottom: '8px',
                      fontWeight: 500,
                    }}
                  >
                    Email Address
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="email"
                      value={profileData.email}
                      disabled
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '1px solid #eee',
                        borderRadius: '8px',
                        backgroundColor: '#f9f9f9',
                        color: '#666',
                      }}
                    />
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: '20px' }}>
                  <label
                    style={{
                      display: 'block',
                      marginBottom: '8px',
                      fontWeight: 500,
                    }}
                  >
                    Phone Number
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Phone
                      size={18}
                      style={{
                        position: 'absolute',
                        left: '12px',
                        top: '14px',
                        color: '#999',
                      }}
                    />
                    <input
                      type="text"
                      value={profileData.phone}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          phone: e.target.value,
                        })
                      }
                      placeholder="+92 3XX XXXXXXX"
                      style={{
                        width: '100%',
                        padding: '12px 12px 12px 40px',
                        border: '1px solid #ddd',
                        borderRadius: '8px',
                      }}
                    />
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: '24px' }}>
                  <label
                    style={{
                      display: 'block',
                      marginBottom: '8px',
                      fontWeight: 500,
                    }}
                  >
                    Delivery Address
                  </label>
                  <div style={{ position: 'relative' }}>
                    <MapPin
                      size={18}
                      style={{
                        position: 'absolute',
                        left: '12px',
                        top: '14px',
                        color: '#999',
                      }}
                    />
                    <textarea
                      value={profileData.address}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          address: e.target.value,
                        })
                      }
                      placeholder="Enter your complete address"
                      style={{
                        width: '100%',
                        padding: '12px 12px 12px 40px',
                        border: '1px solid #ddd',
                        borderRadius: '8px',
                        minHeight: '80px',
                      }}
                    />
                  </div>
                </div>

                {/* Payment Methods Section */}
                <div
                  style={{
                    marginTop: '30px',
                    borderTop: '1px solid #eee',
                    paddingTop: '30px',
                  }}
                >
                  <h3 style={{ marginBottom: '20px' }}>Payment Methods</h3>

                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns:
                        'repeat(auto-fill, minmax(280px, 1fr))',
                      gap: '20px',
                      marginBottom: '30px',
                    }}
                  >
                    {profileData.paymentMethods?.map((card, idx) => (
                      <div
                        key={idx}
                        className="card"
                        style={{
                          background:
                            'linear-gradient(135deg, #1a202c 0%, #2d3748 100%)',
                          color: 'white',
                          padding: '20px',
                          borderRadius: '15px',
                          position: 'relative',
                        }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            marginBottom: '20px',
                          }}
                        >
                          <span
                            style={{
                              fontSize: '0.8rem',
                              opacity: 0.8,
                              textTransform: 'uppercase',
                            }}
                          >
                            {card.cardType}
                          </span>
                          {card.isDefault && (
                            <span
                              style={{
                                fontSize: '0.7rem',
                                background: '#d92662',
                                padding: '2px 8px',
                                borderRadius: '4px',
                              }}
                            >
                              DEFAULT
                            </span>
                          )}
                        </div>
                        <p
                          style={{
                            fontSize: '1.2rem',
                            letterSpacing: '2px',
                            marginBottom: '15px',
                          }}
                        >
                          **** **** **** {card.cardNumber?.slice(-4)}
                        </p>
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                          }}
                        >
                          <div>
                            <p
                              style={{
                                margin: 0,
                                fontSize: '0.6rem',
                                opacity: 0.6,
                              }}
                            >
                              CARD HOLDER
                            </p>
                            <p style={{ margin: 0, fontSize: '0.9rem' }}>
                              {card.cardHolderName}
                            </p>
                          </div>
                          <div>
                            <p
                              style={{
                                margin: 0,
                                fontSize: '0.6rem',
                                opacity: 0.6,
                              }}
                            >
                              EXPIRES
                            </p>
                            <p style={{ margin: 0, fontSize: '0.9rem' }}>
                              {card.expiryDate}
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveCard(idx)}
                          style={{
                            position: 'absolute',
                            top: '10px',
                            right: '10px',
                            background: 'rgba(255,255,255,0.1)',
                            border: 'none',
                            color: 'white',
                            cursor: 'pointer',
                            borderRadius: '50%',
                            width: '30px',
                            height: '30px',
                          }}
                        >
                          <XCircle size={16} />
                        </button>
                      </div>
                    ))}
                  </div>

                  <div
                    className="card"
                    style={{
                      background: '#f8fafc',
                      padding: '20px',
                      borderRadius: '15px',
                    }}
                  >
                    <h4 style={{ marginBottom: '15px' }}>Add New Card</h4>
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '15px',
                      }}
                    >
                      <input
                        type="text"
                        placeholder="Card Holder Name"
                        value={newCard.cardHolderName}
                        onChange={(e) =>
                          setNewCard({
                            ...newCard,
                            cardHolderName: e.target.value,
                          })
                        }
                        style={{
                          padding: '10px',
                          borderRadius: '8px',
                          border: '1px solid #ddd',
                        }}
                      />
                      <input
                        type="text"
                        placeholder="Card Number"
                        value={newCard.cardNumber}
                        onChange={(e) =>
                          setNewCard({ ...newCard, cardNumber: e.target.value })
                        }
                        style={{
                          padding: '10px',
                          borderRadius: '8px',
                          border: '1px solid #ddd',
                        }}
                      />
                      <input
                        type="text"
                        placeholder="MM/YY"
                        value={newCard.expiryDate}
                        onChange={(e) =>
                          setNewCard({ ...newCard, expiryDate: e.target.value })
                        }
                        style={{
                          padding: '10px',
                          borderRadius: '8px',
                          border: '1px solid #ddd',
                        }}
                      />
                      <select
                        value={newCard.cardType}
                        onChange={(e) =>
                          setNewCard({ ...newCard, cardType: e.target.value })
                        }
                        style={{
                          padding: '10px',
                          borderRadius: '8px',
                          border: '1px solid #ddd',
                        }}
                      >
                        <option value="visa">Visa</option>
                        <option value="mastercard">Mastercard</option>
                      </select>
                    </div>
                    <button
                      type="button"
                      onClick={handleAddCard}
                      style={{
                        marginTop: '15px',
                        padding: '10px 20px',
                        background: '#d92662',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      + Add Card
                    </button>
                  </div>
                </div>

                <div style={{ marginTop: '30px' }}>
                  <button
                    type="submit"
                    className="btn-primary"
                    style={{
                      width: '100%',
                      padding: '15px',
                      borderRadius: '10px',
                    }}
                  >
                    Save All Changes
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === 'addresses' && (
            <div className="dashboard-section">
              <div className="section-header">
                <h2>Saved Addresses</h2>
                <button className="btn-outline-small">+ Add New</button>
              </div>
              <div className="empty-state">
                <MapPin
                  size={48}
                  color="#ccc"
                  style={{ marginBottom: '16px' }}
                />
                <h3>No saved addresses</h3>
                <p>Save addresses for faster checkout</p>
              </div>
            </div>
          )}

          {activeTab === 'favourites' && (
            <div className="dashboard-section">
              <div className="section-header">
                <h2>Favourite Restaurants</h2>
              </div>
              <div className="empty-state">
                <Heart
                  size={48}
                  color="#ccc"
                  style={{ marginBottom: '16px' }}
                />
                <h3>No favourites yet</h3>
                <p>Mark restaurants as favourite to see them here</p>
              </div>
            </div>
          )}

          {activeTab === 'tracking' && trackingOrder && (
            <div className="dashboard-section">
              <div className="section-header">
                <h2>
                  Track Order #{trackingOrder._id.slice(-6).toUpperCase()}
                </h2>
                <button
                  className="btn-outline-small"
                  onClick={() => setActiveTab('orders')}
                >
                  Back to List
                </button>
              </div>

              <div
                className="card shadow-premium"
                style={{
                  background: 'white',
                  padding: '30px',
                  borderRadius: '20px',
                }}
              >
                <div
                  style={{ display: 'flex', gap: '20px', marginBottom: '30px' }}
                >
                  <img
                    src={trackingOrder.restaurant?.image}
                    style={{
                      width: '80px',
                      height: '80px',
                      borderRadius: '15px',
                    }}
                  />
                  <div>
                    <h3 style={{ margin: 0, fontSize: '1.4rem' }}>
                      {trackingOrder.restaurant?.name}
                    </h3>
                    <p style={{ color: '#666', margin: '5px 0' }}>
                      {trackingOrder.deliveryAddress}
                    </p>
                    <span
                      className="status-badge"
                      style={{
                        padding: '4px 12px',
                        background: '#ffeef2',
                        color: '#d92662',
                        borderRadius: '20px',
                        fontWeight: 600,
                      }}
                    >
                      {trackingOrder.status.toUpperCase()}
                    </span>
                  </div>
                </div>

                <div
                  className="tracking-timeline"
                  style={{ padding: '20px 0' }}
                >
                  {[
                    { label: 'Order Placed', status: 'pending', color: '#666' },
                    {
                      label: 'Preparing',
                      status: 'preparing',
                      color: '#3498db',
                    },
                    {
                      label: 'Out for Delivery',
                      status: 'out_for_delivery',
                      color: '#f39c12',
                    },
                    {
                      label: 'Delivered',
                      status: 'delivered',
                      color: '#27ae60',
                    },
                  ].map((step, idx, arr) => {
                    const statuses = [
                      'pending',
                      'preparing',
                      'out_for_delivery',
                      'delivered',
                    ];
                    const currentIndex = statuses.indexOf(trackingOrder.status);
                    const stepIndex = statuses.indexOf(step.status);
                    const isActive = stepIndex <= currentIndex;

                    return (
                      <div
                        key={step.status}
                        style={{
                          display: 'flex',
                          gap: '20px',
                          position: 'relative',
                          paddingBottom: idx === arr.length - 1 ? 0 : '30px',
                        }}
                      >
                        {idx !== arr.length - 1 && (
                          <div
                            style={{
                              position: 'absolute',
                              left: '14px',
                              top: '30px',
                              bottom: 0,
                              width: '2px',
                              background:
                                stepIndex < currentIndex ? '#d92662' : '#eee',
                            }}
                          ></div>
                        )}
                        <div
                          style={{
                            width: '30px',
                            height: '30px',
                            borderRadius: '50%',
                            background: isActive ? '#d92662' : '#eee',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            zIndex: 1,
                          }}
                        >
                          {isActive ? (
                            <CheckCircle size={18} color="white" />
                          ) : (
                            <div
                              style={{
                                width: '10px',
                                height: '10px',
                                borderRadius: '50%',
                                background: '#ccc',
                              }}
                            ></div>
                          )}
                        </div>
                        <div>
                          <p
                            style={{
                              margin: 0,
                              fontWeight: isActive ? 700 : 500,
                              color: isActive ? '#333' : '#999',
                            }}
                          >
                            {step.label}
                          </p>
                          {isActive && step.status === trackingOrder.status && (
                            <p
                              style={{
                                margin: '4px 0 0',
                                fontSize: '0.85rem',
                                color: '#d92662',
                              }}
                            >
                              Current Status
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .sidebar-btn {
          display: flex;
          align-items: center;
          gap: 12px;
          width: 100%;
          padding: 12px 16px;
          background: none;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          color: #666;
          font-weight: 500;
          transition: all 0.2s;
          text-align: left;
        }
        
        .sidebar-btn:hover {
          background-color: #f5f5f5;
          color: #333;
        }
        
        .sidebar-btn.active {
          background-color: #ffeef2;
          color: #d92662;
          font-weight: 600;
        }
        
        .btn-primary-small {
          background-color: #d92662;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 6px;
          font-weight: 600;
          cursor: pointer;
        }
        
        .btn-outline-small {
          background-color: transparent;
          color: #d92662;
          border: 1px solid #d92662;
          padding: 8px 16px;
          border-radius: 6px;
          font-weight: 600;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
};

export default CustomerDashboard;
