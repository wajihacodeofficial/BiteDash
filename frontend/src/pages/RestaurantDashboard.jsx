import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import {
  Store,
  Package,
  TrendingUp,
  DollarSign,
  Clock,
  Star,
  Plus,
  Edit2,
  Trash2,
  Eye,
  MoreVertical,
  AlertCircle,
  CheckCircle,
  MapPin,
  Phone,
  Mail,
  Calendar,
} from 'lucide-react';
import api from '../api';
import './Dashboard.css';

const RestaurantDashboard = () => {
  const { user } = useAuth();
  const { addNotification } = useNotification();

  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [restaurantData, setRestaurantData] = useState(null);
  const [orders, setOrders] = useState([]);
  const [menu, setMenu] = useState([]);
  const [showMenuForm, setShowMenuForm] = useState(false);
  const [menuForm, setMenuForm] = useState({
    name: '',
    price: '',
    description: '',
    category: 'Main Course',
    available: true,
  });
  const [selectedOrder, setSelectedOrder] = useState(null);

  const stats = {
    totalOrders: 485,
    totalRevenue: 125420,
    rating: 4.7,
    activeItems: 42,
  };

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        // Load restaurant data
        const restaurantRes = await api.get('/restaurants/my-restaurant');
        setRestaurantData(restaurantRes.data || getMockRestaurant());

        // Load orders
        const ordersRes = await api.get('/restaurant/orders');
        setOrders(ordersRes.data || getMockOrders());

        // Load menu
        const menuRes = await api.get('/restaurant/menu');
        setMenu(menuRes.data || getMockMenu());
      } catch (error) {
        console.error('Error loading dashboard:', error);
        setRestaurantData(getMockRestaurant());
        setOrders(getMockOrders());
        setMenu(getMockMenu());
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const handleAddMenuItem = async () => {
    if (!menuForm.name || !menuForm.price) {
      addNotification('Validation Error', 'Please fill in all required fields');
      return;
    }

    try {
      const res = await api.post('/restaurant/menu', menuForm);
      setMenu([...menu, res.data]);
      setMenuForm({
        name: '',
        price: '',
        description: '',
        category: 'Main Course',
        available: true,
      });
      setShowMenuForm(false);
      addNotification('Success', 'Menu item added successfully');
    } catch (error) {
      addNotification('Error', 'Failed to add menu item');
    }
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await api.put(`/restaurant/orders/${orderId}`, { status: newStatus });
      setOrders(
        orders.map((order) =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );
      addNotification('Success', `Order status updated to ${newStatus}`);
    } catch (error) {
      addNotification('Error', 'Failed to update order status');
    }
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading Restaurant Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container professional-dashboard">
      {/* Header */}
      <div className="dashboard-header" style={{ marginBottom: '40px' }}>
        <div>
          <h1
            style={{ fontSize: '2.5rem', marginBottom: '8px', fontWeight: 700 }}
          >
            Restaurant Dashboard 🍽️
          </h1>
          <p style={{ fontSize: '1.1rem', color: '#666' }}>
            Welcome, {restaurantData?.name}!
          </p>
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
              <Package size={24} />
            </div>
            <div>
              <p style={{ margin: 0, fontSize: '0.9rem', color: '#999' }}>
                Total Orders
              </p>
              <h3
                style={{
                  margin: '4px 0 0 0',
                  fontSize: '1.8rem',
                  fontWeight: 700,
                }}
              >
                {stats.totalOrders}
              </h3>
            </div>
          </div>
        </div>

        <div
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
              <DollarSign size={24} />
            </div>
            <div>
              <p style={{ margin: 0, fontSize: '0.9rem', color: '#999' }}>
                Total Revenue
              </p>
              <h3
                style={{
                  margin: '4px 0 0 0',
                  fontSize: '1.8rem',
                  fontWeight: 700,
                }}
              >
                Rs. {stats.totalRevenue.toLocaleString()}
              </h3>
            </div>
          </div>
        </div>

        <div
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
                Rating
              </p>
              <h3
                style={{
                  margin: '4px 0 0 0',
                  fontSize: '1.8rem',
                  fontWeight: 700,
                }}
              >
                {stats.rating} ⭐
              </h3>
            </div>
          </div>
        </div>

        <div
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
                Active Menu Items
              </p>
              <h3
                style={{
                  margin: '4px 0 0 0',
                  fontSize: '1.8rem',
                  fontWeight: 700,
                }}
              >
                {stats.activeItems}
              </h3>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ marginBottom: '30px', borderBottom: '2px solid #f0f0f0' }}>
        <div style={{ display: 'flex', gap: '30px' }}>
          <button
            onClick={() => setActiveTab('overview')}
            style={{
              padding: '12px 0',
              background: 'none',
              border: 'none',
              fontWeight: activeTab === 'overview' ? 700 : 600,
              fontSize: '1rem',
              color: activeTab === 'overview' ? '#667eea' : '#999',
              cursor: 'pointer',
              borderBottom:
                activeTab === 'overview' ? '3px solid #667eea' : 'none',
              transition: 'all 0.3s ease',
              marginBottom: '-2px',
            }}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            style={{
              padding: '12px 0',
              background: 'none',
              border: 'none',
              fontWeight: activeTab === 'orders' ? 700 : 600,
              fontSize: '1rem',
              color: activeTab === 'orders' ? '#667eea' : '#999',
              cursor: 'pointer',
              borderBottom:
                activeTab === 'orders' ? '3px solid #667eea' : 'none',
              transition: 'all 0.3s ease',
              marginBottom: '-2px',
            }}
          >
            Orders ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab('menu')}
            style={{
              padding: '12px 0',
              background: 'none',
              border: 'none',
              fontWeight: activeTab === 'menu' ? 700 : 600,
              fontSize: '1rem',
              color: activeTab === 'menu' ? '#667eea' : '#999',
              cursor: 'pointer',
              borderBottom: activeTab === 'menu' ? '3px solid #667eea' : 'none',
              transition: 'all 0.3s ease',
              marginBottom: '-2px',
            }}
          >
            Menu ({menu.length})
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            style={{
              padding: '12px 0',
              background: 'none',
              border: 'none',
              fontWeight: activeTab === 'settings' ? 700 : 600,
              fontSize: '1rem',
              color: activeTab === 'settings' ? '#667eea' : '#999',
              cursor: 'pointer',
              borderBottom:
                activeTab === 'settings' ? '3px solid #667eea' : 'none',
              transition: 'all 0.3s ease',
              marginBottom: '-2px',
            }}
          >
            Settings
          </button>
        </div>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div style={{ marginBottom: '40px' }}>
          <h2
            style={{
              fontSize: '1.5rem',
              fontWeight: 700,
              marginBottom: '24px',
            }}
          >
            Recent Orders
          </h2>
          <div style={{ display: 'grid', gap: '12px' }}>
            {orders.slice(0, 5).map((order) => (
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
                  cursor: 'pointer',
                }}
                onClick={() => setSelectedOrder(order)}
              >
                <div>
                  <p style={{ margin: '0 0 4px 0', fontWeight: 600 }}>
                    Order #{order._id?.slice(-6)}
                  </p>
                  <p style={{ margin: 0, fontSize: '0.9rem', color: '#666' }}>
                    Customer: {order.customer?.name || 'Customer'}
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ margin: 0, fontSize: '1rem', fontWeight: 700 }}>
                    Rs. {order.total}
                  </p>
                  <span
                    style={{
                      fontSize: '0.85rem',
                      padding: '4px 8px',
                      borderRadius: '6px',
                      background:
                        order.status === 'completed' ? '#d4edda' : '#fff3cd',
                      color:
                        order.status === 'completed' ? '#155724' : '#856404',
                      fontWeight: 600,
                    }}
                  >
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Orders Tab */}
      {activeTab === 'orders' && (
        <div style={{ marginBottom: '40px' }}>
          <h2
            style={{
              fontSize: '1.5rem',
              fontWeight: 700,
              marginBottom: '24px',
            }}
          >
            All Orders
          </h2>
          {orders.length === 0 ? (
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
                No orders yet
              </h3>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '12px' }}>
              {orders.map((order) => (
                <div
                  key={order._id}
                  style={{
                    background: 'white',
                    padding: '20px',
                    borderRadius: '12px',
                    border: '1px solid #f0f0f0',
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr 1fr auto',
                    gap: '16px',
                    alignItems: 'center',
                  }}
                >
                  <div>
                    <p
                      style={{
                        margin: '0 0 8px 0',
                        fontSize: '0.9rem',
                        color: '#999',
                        fontWeight: 600,
                      }}
                    >
                      ORDER ID
                    </p>
                    <p style={{ margin: 0, fontSize: '1rem', fontWeight: 600 }}>
                      #{order._id?.slice(-6)}
                    </p>
                  </div>

                  <div>
                    <p
                      style={{
                        margin: '0 0 8px 0',
                        fontSize: '0.9rem',
                        color: '#999',
                        fontWeight: 600,
                      }}
                    >
                      CUSTOMER
                    </p>
                    <p style={{ margin: 0, fontSize: '0.95rem' }}>
                      {order.customer?.name}
                    </p>
                  </div>

                  <div>
                    <p
                      style={{
                        margin: '0 0 8px 0',
                        fontSize: '0.9rem',
                        color: '#999',
                        fontWeight: 600,
                      }}
                    >
                      TOTAL
                    </p>
                    <p style={{ margin: 0, fontSize: '1rem', fontWeight: 600 }}>
                      Rs. {order.total}
                    </p>
                  </div>

                  <select
                    value={order.status}
                    onChange={(e) =>
                      handleUpdateOrderStatus(order._id, e.target.value)
                    }
                    style={{
                      padding: '8px 12px',
                      borderRadius: '6px',
                      border: '1px solid #ddd',
                      cursor: 'pointer',
                    }}
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="preparing">Preparing</option>
                    <option value="ready">Ready</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Menu Tab */}
      {activeTab === 'menu' && (
        <div style={{ marginBottom: '40px' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '24px',
            }}
          >
            <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 700 }}>
              Menu Items
            </h2>
            <button
              onClick={() => setShowMenuForm(!showMenuForm)}
              style={{
                padding: '10px 20px',
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
              <Plus size={18} />
              Add Item
            </button>
          </div>

          {/* Add Menu Form */}
          {showMenuForm && (
            <div
              style={{
                background: 'white',
                padding: '24px',
                borderRadius: '12px',
                border: '1px solid #f0f0f0',
                marginBottom: '24px',
              }}
            >
              <h3
                style={{
                  margin: '0 0 16px 0',
                  fontSize: '1.1rem',
                  fontWeight: 700,
                }}
              >
                Add New Menu Item
              </h3>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '16px',
                }}
              >
                <input
                  type="text"
                  placeholder="Item Name"
                  value={menuForm.name}
                  onChange={(e) =>
                    setMenuForm({ ...menuForm, name: e.target.value })
                  }
                  style={{
                    padding: '10px',
                    borderRadius: '8px',
                    border: '1px solid #ddd',
                    fontSize: '0.95rem',
                  }}
                />
                <input
                  type="number"
                  placeholder="Price (Rs.)"
                  value={menuForm.price}
                  onChange={(e) =>
                    setMenuForm({ ...menuForm, price: e.target.value })
                  }
                  style={{
                    padding: '10px',
                    borderRadius: '8px',
                    border: '1px solid #ddd',
                    fontSize: '0.95rem',
                  }}
                />
                <select
                  value={menuForm.category}
                  onChange={(e) =>
                    setMenuForm({ ...menuForm, category: e.target.value })
                  }
                  style={{
                    padding: '10px',
                    borderRadius: '8px',
                    border: '1px solid #ddd',
                    fontSize: '0.95rem',
                  }}
                >
                  <option value="Main Course">Main Course</option>
                  <option value="Appetizer">Appetizer</option>
                  <option value="Dessert">Dessert</option>
                  <option value="Beverage">Beverage</option>
                </select>
                <label
                  style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  <input
                    type="checkbox"
                    checked={menuForm.available}
                    onChange={(e) =>
                      setMenuForm({ ...menuForm, available: e.target.checked })
                    }
                  />
                  Available
                </label>
              </div>
              <textarea
                placeholder="Description"
                value={menuForm.description}
                onChange={(e) =>
                  setMenuForm({ ...menuForm, description: e.target.value })
                }
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '8px',
                  border: '1px solid #ddd',
                  fontSize: '0.95rem',
                  marginTop: '16px',
                  minHeight: '80px',
                }}
              />
              <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                <button
                  onClick={handleAddMenuItem}
                  style={{
                    padding: '10px 20px',
                    borderRadius: '8px',
                    background: '#27ae60',
                    color: 'white',
                    border: 'none',
                    cursor: 'pointer',
                    fontWeight: 600,
                  }}
                >
                  Add Item
                </button>
                <button
                  onClick={() => setShowMenuForm(false)}
                  style={{
                    padding: '10px 20px',
                    borderRadius: '8px',
                    background: '#e0e0e0',
                    color: '#333',
                    border: 'none',
                    cursor: 'pointer',
                    fontWeight: 600,
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Menu Grid */}
          {menu.length === 0 ? (
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
                No menu items
              </h3>
              <p style={{ color: '#999' }}>
                Add your first menu item to get started
              </p>
            </div>
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: '20px',
              }}
            >
              {menu.map((item) => (
                <div
                  key={item._id}
                  style={{
                    background: 'white',
                    borderRadius: '12px',
                    border: '1px solid #f0f0f0',
                    overflow: 'hidden',
                  }}
                >
                  <div style={{ padding: '16px' }}>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'start',
                        marginBottom: '12px',
                      }}
                    >
                      <h3
                        style={{
                          margin: 0,
                          fontSize: '1.1rem',
                          fontWeight: 600,
                        }}
                      >
                        {item.name}
                      </h3>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: '#667eea',
                          }}
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: '#e74c3c',
                          }}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                    <p
                      style={{
                        margin: '0 0 12px 0',
                        fontSize: '0.9rem',
                        color: '#666',
                      }}
                    >
                      {item.description}
                    </p>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <p
                        style={{
                          margin: 0,
                          fontSize: '1.3rem',
                          fontWeight: 700,
                          color: '#27ae60',
                        }}
                      >
                        Rs. {item.price}
                      </p>
                      <span
                        style={{
                          fontSize: '0.8rem',
                          padding: '4px 8px',
                          borderRadius: '6px',
                          background: item.available ? '#d4edda' : '#ffebee',
                          color: item.available ? '#155724' : '#c62828',
                          fontWeight: 600,
                        }}
                      >
                        {item.available ? 'Available' : 'Not Available'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Settings Tab */}
      {activeTab === 'settings' && (
        <div style={{ marginBottom: '40px' }}>
          <h2
            style={{
              fontSize: '1.5rem',
              fontWeight: 700,
              marginBottom: '24px',
            }}
          >
            Restaurant Settings
          </h2>
          <div
            style={{
              background: 'white',
              padding: '24px',
              borderRadius: '12px',
              border: '1px solid #f0f0f0',
              maxWidth: '600px',
            }}
          >
            {restaurantData && (
              <div>
                <div style={{ marginBottom: '20px' }}>
                  <label
                    style={{
                      display: 'block',
                      marginBottom: '8px',
                      fontWeight: 600,
                    }}
                  >
                    Restaurant Name
                  </label>
                  <input
                    type="text"
                    defaultValue={restaurantData.name}
                    style={{
                      width: '100%',
                      padding: '10px',
                      borderRadius: '8px',
                      border: '1px solid #ddd',
                      fontSize: '0.95rem',
                    }}
                  />
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label
                    style={{
                      display: 'block',
                      marginBottom: '8px',
                      fontWeight: 600,
                    }}
                  >
                    <Phone
                      size={16}
                      style={{ display: 'inline', marginRight: '8px' }}
                    />
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    defaultValue={restaurantData.phone}
                    style={{
                      width: '100%',
                      padding: '10px',
                      borderRadius: '8px',
                      border: '1px solid #ddd',
                      fontSize: '0.95rem',
                    }}
                  />
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label
                    style={{
                      display: 'block',
                      marginBottom: '8px',
                      fontWeight: 600,
                    }}
                  >
                    <Mail
                      size={16}
                      style={{ display: 'inline', marginRight: '8px' }}
                    />
                    Email
                  </label>
                  <input
                    type="email"
                    defaultValue={restaurantData.email}
                    style={{
                      width: '100%',
                      padding: '10px',
                      borderRadius: '8px',
                      border: '1px solid #ddd',
                      fontSize: '0.95rem',
                    }}
                  />
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label
                    style={{
                      display: 'block',
                      marginBottom: '8px',
                      fontWeight: 600,
                    }}
                  >
                    <MapPin
                      size={16}
                      style={{ display: 'inline', marginRight: '8px' }}
                    />
                    Address
                  </label>
                  <textarea
                    defaultValue={restaurantData.address}
                    style={{
                      width: '100%',
                      padding: '10px',
                      borderRadius: '8px',
                      border: '1px solid #ddd',
                      fontSize: '0.95rem',
                      minHeight: '80px',
                    }}
                  />
                </div>

                <button
                  style={{
                    padding: '12px 24px',
                    borderRadius: '8px',
                    background: '#667eea',
                    color: 'white',
                    border: 'none',
                    cursor: 'pointer',
                    fontWeight: 600,
                  }}
                >
                  Save Changes
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// Mock Data
const getMockRestaurant = () => ({
  _id: '1',
  name: 'Burger Lab',
  phone: '+92 300 1234567',
  email: 'contact@burgerlab.pk',
  address: 'Clifton Block 4, Karachi',
});

const getMockOrders = () => [
  {
    _id: '001',
    customer: { name: 'Ali Khan' },
    total: 1200,
    status: 'confirmed',
  },
  {
    _id: '002',
    customer: { name: 'Sara Ahmed' },
    total: 850,
    status: 'preparing',
  },
];

const getMockMenu = () => [
  {
    _id: '1',
    name: 'Classic Burger',
    price: 450,
    description: 'Juicy beef patty with fresh vegetables',
    category: 'Main Course',
    available: true,
  },
  {
    _id: '2',
    name: 'Fries',
    price: 150,
    description: 'Crispy golden fries',
    category: 'Main Course',
    available: true,
  },
];

export default RestaurantDashboard;
