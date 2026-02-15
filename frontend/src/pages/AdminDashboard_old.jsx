import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  ShoppingBag,
  Store,
  Bike,
  Users,
  CreditCard,
  Megaphone,
  BarChart2,
  Settings,
  Search,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Menu,
} from 'lucide-react';
import './Dashboard.css';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('analytics'); // Default view
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // -- Mock Data for Views --
  const kpiStats = {
    revenue: 450000,
    orders: 1250,
    activeUsers: 850,
    activeRiders: 45,
  };

  const recentOrders = [
    {
      id: '#ORD-001',
      customer: 'Ali Khan',
      restaurant: 'Kababjees',
      total: 1200,
      status: 'pending',
    },
    {
      id: '#ORD-002',
      customer: 'Sara Ahmed',
      restaurant: 'Pizza Hut',
      total: 2500,
      status: 'delivered',
    },
    {
      id: '#ORD-003',
      customer: 'Zainab',
      restaurant: 'Burger Lab',
      total: 850,
      status: 'preparing',
    },
    {
      id: '#ORD-004',
      customer: 'Bilal',
      restaurant: 'Ginsoy',
      total: 3000,
      status: 'cancelled',
    },
  ];

  // -- Sub-Components for Views --

  const AnalyticsView = () => (
    <div className="admin-view fade-in">
      <h2 className="view-title">Analytics & Operations</h2>

      <div className="stats-grid stats-grid-4">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#e3f2fd' }}>
            <CreditCard size={24} color="#1565c0" />
          </div>
          <div>
            <h3>Rs. {kpiStats.revenue.toLocaleString()}</h3>
            <p>Total Revenue</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#fff3e0' }}>
            <ShoppingBag size={24} color="#e65100" />
          </div>
          <div>
            <h3>{kpiStats.orders}</h3>
            <p>Total Orders</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#e8f5e9' }}>
            <Users size={24} color="#2e7d32" />
          </div>
          <div>
            <h3>{kpiStats.activeUsers}</h3>
            <p>Active Users</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#f3e5f5' }}>
            <Bike size={24} color="#7b1fa2" />
          </div>
          <div>
            <h3>{kpiStats.activeRiders}</h3>
            <p>Riders Online</p>
          </div>
        </div>
      </div>

      <div
        className="charts-row"
        style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr',
          gap: '20px',
          marginTop: '30px',
        }}
      >
        <div
          className="chart-card"
          style={{
            background: 'white',
            padding: '24px',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
            minHeight: '300px',
          }}
        >
          <h3>Revenue Trend</h3>
          <div
            style={{
              height: '200px',
              display: 'flex',
              alignItems: 'end',
              gap: '20px',
              padding: '20px 0',
            }}
          >
            {[40, 60, 45, 80, 55, 90, 75].map((h, i) => (
              <div
                key={i}
                style={{
                  flex: 1,
                  background: '#27ae60',
                  opacity: 0.7,
                  borderRadius: '4px 4px 0 0',
                  height: `${h}%`,
                }}
              ></div>
            ))}
          </div>
        </div>
        <div
          className="chart-card"
          style={{
            background: 'white',
            padding: '24px',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
          }}
        >
          <h3>Order Status</h3>
          <div
            className="donut-chart-mock"
            style={{
              width: '150px',
              height: '150px',
              borderRadius: '50%',
              border: '20px solid #eee',
              borderTopColor: '#27ae60',
              borderRightColor: '#f39c12',
              margin: '20px auto',
            }}
          ></div>
          <div
            style={{ textAlign: 'center', fontSize: '0.9rem', color: '#666' }}
          >
            <span style={{ color: '#27ae60' }}>● Completed</span> &nbsp;{' '}
            <span style={{ color: '#f39c12' }}>● Active</span>
          </div>
        </div>
      </div>
    </div>
  );

  const OrdersView = () => (
    <div className="admin-view fade-in">
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
        }}
      >
        <h2 className="view-title">Order Management</h2>
        <div className="search-box" style={{ position: 'relative' }}>
          <Search
            size={16}
            style={{
              position: 'absolute',
              left: '10px',
              top: '10px',
              color: '#999',
            }}
          />
          <input
            type="text"
            placeholder="Search Order ID"
            style={{
              padding: '8px 10px 8px 32px',
              borderRadius: '20px',
              border: '1px solid #ddd',
            }}
          />
        </div>
      </div>

      <table
        className="admin-table"
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          background: 'white',
          borderRadius: '12px',
          overflow: 'hidden',
        }}
      >
        <thead>
          <tr style={{ background: '#f8f9fa', textAlign: 'left' }}>
            <th style={{ padding: '16px' }}>Order ID</th>
            <th style={{ padding: '16px' }}>Customer</th>
            <th style={{ padding: '16px' }}>Restaurant</th>
            <th style={{ padding: '16px' }}>Total</th>
            <th style={{ padding: '16px' }}>Status</th>
            <th style={{ padding: '16px' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {recentOrders.map((order) => (
            <tr key={order.id} style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: '16px', fontWeight: '600' }}>{order.id}</td>
              <td style={{ padding: '16px' }}>{order.customer}</td>
              <td style={{ padding: '16px' }}>{order.restaurant}</td>
              <td style={{ padding: '16px' }}>Rs. {order.total}</td>
              <td style={{ padding: '16px' }}>
                <span
                  className={`status-badge status-${order.status}`}
                  style={{
                    background:
                      order.status === 'delivered'
                        ? '#27ae60'
                        : order.status === 'pending'
                        ? '#f39c12'
                        : order.status === 'cancelled'
                        ? '#c62828'
                        : '#2980b9',
                    color: 'white',
                    padding: '4px 10px',
                    borderRadius: '12px',
                    fontSize: '0.8rem',
                    textTransform: 'capitalize',
                  }}
                >
                  {order.status}
                </span>
              </td>
              <td style={{ padding: '16px' }}>
                <button
                  style={{
                    marginRight: '8px',
                    cursor: 'pointer',
                    border: 'none',
                    background: 'none',
                    color: '#2980b9',
                  }}
                >
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const ComingSoonView = ({ title }) => (
    <div
      className="admin-view fade-in"
      style={{ textAlign: 'center', padding: '50px' }}
    >
      <div
        style={{
          background: '#f0f4f8',
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 20px',
        }}
      >
        <Settings size={40} color="#666" />
      </div>
      <h2>{title} Module</h2>
      <p style={{ color: '#666' }}>
        This comprehensive module is under development.
      </p>
    </div>
  );

  // -- Sidebar Navigation Items --
  const navItems = [
    {
      id: 'analytics',
      label: 'Dashboard',
      icon: <LayoutDashboard size={20} />,
    },
    {
      id: 'orders',
      label: 'Order Management',
      icon: <ShoppingBag size={20} />,
    },
    { id: 'restaurants', label: 'Restaurants', icon: <Store size={20} /> },
    { id: 'riders', label: 'Riders', icon: <Bike size={20} /> },
    { id: 'customers', label: 'Customers', icon: <Users size={20} /> },
    {
      id: 'finance',
      label: 'Finance & Payments',
      icon: <CreditCard size={20} />,
    },
    { id: 'marketing', label: 'Promotions', icon: <Megaphone size={20} /> },
    { id: 'reports', label: 'Reports', icon: <BarChart2 size={20} /> },
    { id: 'settings', label: 'System Settings', icon: <Settings size={20} /> },
  ];

  return (
    <div
      className="admin-layout"
      style={{ display: 'flex', minHeight: '100vh', background: '#f4f6f8' }}
    >
      {/* Sidebar */}
      <aside
        className={`admin-sidebar ${mobileMenuOpen ? 'open' : ''}`}
        style={{
          width: '260px',
          background: 'white',
          borderRight: '1px solid #ddd',
          position: 'fixed',
          top: '80px',
          bottom: 0,
          overflowY: 'auto',
          padding: '20px 0',
          zIndex: 100,
        }}
      >
        <div className="sidebar-nav">
          {navItems.map((item) => (
            <div
              key={item.id}
              className={`nav-item-admin ${
                activeTab === item.id ? 'active' : ''
              }`}
              onClick={() => {
                setActiveTab(item.id);
                setMobileMenuOpen(false);
              }}
              style={{
                padding: '12px 24px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                cursor: 'pointer',
                color: activeTab === item.id ? '#d92662' : '#555',
                background: activeTab === item.id ? '#fff0f3' : 'transparent',
                borderRight:
                  activeTab === item.id ? '3px solid #d92662' : 'none',
              }}
            >
              {item.icon}
              <span style={{ fontWeight: 500 }}>{item.label}</span>
            </div>
          ))}
        </div>
      </aside>

      {/* Main Content Area */}
      <main
        className="admin-content"
        style={{
          flex: 1,
          marginLeft: '260px',
          padding: '30px',
          paddingTop: '30px', // Header offset handled by layout
          marginTop: '0',
        }}
      >
        {/* View Switching Logic */}
        {activeTab === 'analytics' && <AnalyticsView />}
        {activeTab === 'orders' && <OrdersView />}
        {activeTab === 'restaurants' && (
          <ComingSoonView title="Restaurant Management" />
        )}
        {activeTab === 'riders' && <ComingSoonView title="Rider Management" />}
        {activeTab === 'customers' && (
          <ComingSoonView title="Customer Management" />
        )}
        {activeTab === 'finance' && <ComingSoonView title="Finance" />}
        {activeTab === 'marketing' && <ComingSoonView title="Marketing" />}
        {activeTab === 'reports' && <ComingSoonView title="Reports" />}
        {activeTab === 'settings' && <ComingSoonView title="Settings" />}
      </main>

      {/* Mobile Toggle Overlay (Optional styling needed for full responsiveness) */}
      {mobileMenuOpen && (
        <div
          className="overlay"
          onClick={() => setMobileMenuOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            zIndex: 90,
          }}
        ></div>
      )}
    </div>
  );
};

export default AdminDashboard;
