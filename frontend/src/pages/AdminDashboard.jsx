import React, { useState, useEffect } from 'react';
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
  TrendingUp,
  DollarSign,
  Eye,
  EyeOff,
  Plus,
  Edit,
  Trash2,
  Download,
  Filter,
  Calendar,
  PieChart,
  LineChart,
  AlertCircle,
  Phone,
  Globe,
  Ban,
  Loader,
  MapPin,
  Clock,
  Activity,
  Package,
  Utensils,
  BarChart,
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import api from '../api';
import ActionKPICard from '../components/ActionKPICard';
import AdminFilters from '../components/AdminFilters';
import LiveOrdersWidget from '../components/LiveOrdersWidget';
import './Dashboard.css';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('analytics');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Analytics Data
  const [analytics, setAnalytics] = useState({
    totalRevenue: 450000,
    totalOrders: 1250,
    totalUsers: 850,
    activeRiders: 45,
    restaurantCount: 120,
    orderTrend: [
      { date: 'Mon', orders: 150 },
      { date: 'Tue', orders: 180 },
      { date: 'Wed', orders: 200 },
      { date: 'Thu', orders: 220 },
      { date: 'Fri', orders: 280 },
      { date: 'Sat', orders: 320 },
      { date: 'Sun', orders: 250 },
    ],
  });

  // State for different modules
  const [orders, setOrders] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [riders, setRiders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [payments, setPayments] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

  // Filter state
  const [filters, setFilters] = useState({
    dateRange: 'today',
    city: 'all',
    status: 'all',
  });

  // Actionable KPI Data
  const [actionableKPIs, setActionableKPIs] = useState({
    failedOrders: { count: 0, trend: '+0', severity: 'critical' },
    pendingPayouts: { count: 8, trend: '-2', severity: 'high' },
    supportTickets: { count: 15, trend: '+5', severity: 'high' },
  });

  // State for confirmation dialogs and actions
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    type: '', // 'removeRider' or 'banCustomer'
    target: null,
    reason: '',
    processing: false,
  });

  // Mock data arrays with IDs
  const [ridersList, setRidersList] = useState([]);
  const [customersList, setCustomersList] = useState([]);

  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
  });

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
      toast.success('Admin profile updated!');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update admin profile.');
    }
  };

  const navItems = [
    { id: 'analytics', label: 'Analytics', icon: <BarChart size={20} /> },
    { id: 'orders', label: 'Orders', icon: <Package size={20} /> },
    { id: 'restaurants', label: 'Restaurants', icon: <Utensils size={20} /> },
    { id: 'riders', label: 'Riders', icon: <Bike size={20} /> },
    { id: 'customers', label: 'Customers', icon: <Users size={20} /> },
    { id: 'finance', label: 'Finance', icon: <CreditCard size={20} /> },
    {
      id: 'monitoring',
      label: 'Live Monitoring',
      icon: <Activity size={20} />,
    },
    { id: 'settings', label: 'Profile Settings', icon: <Settings size={20} /> },
  ];

  useEffect(() => {
    fetchAnalytics();
    fetchUsers();

    // Listen for real-time updates
    const handleUpdate = (data) => {
      fetchAnalytics(); // Refresh all
    };

    // In a real app we'd use useSocket() hook
    // For now we'll rely on the global refresh or the stats interval
    const interval = setInterval(fetchAnalytics, 30000); // 30s refresh
    return () => clearInterval(interval);
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await api.get('/admin/users');
      const allUsers = res.data || [];
      setRidersList(allUsers.filter((u) => u.role === 'rider'));
      setCustomersList(allUsers.filter((u) => u.role === 'customer'));
    } catch (err) {
      console.error('Error fetching users', err);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const res = await api.get('/admin/stats');
      const { totals, recentOrders, allRestaurants } = res.data;

      setAnalytics({
        totalRevenue: totals.revenue,
        totalOrders: totals.totalOrders,
        totalUsers: totals.totalUsers,
        activeRiders: totals.totalRiders,
        restaurantCount: totals.totalRestaurants,
        orderTrend: analytics.orderTrend, // Keep mock trend for now
      });

      setOrders(recentOrders || []);
      setRestaurants(allRestaurants || []);

      // Calculate failed orders for KPI
      const failed = (recentOrders || []).filter(
        (o) => o.status === 'cancelled'
      ).length;
      setActionableKPIs((prev) => ({
        ...prev,
        failedOrders: {
          count: failed,
          trend: '+' + failed,
          severity: 'critical',
        },
      }));
    } catch (error) {
      console.error('Error fetching analytics:', error);
    }
  };

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
    // Trigger re-fetch of analytics based on new filters
    fetchAnalytics();
  };

  const handleActionKPI = (kpiType) => {
    console.log(`Action triggered for: ${kpiType}`);
    // Navigate to relevant section or open modal
    if (kpiType === 'failedOrders') {
      setActiveTab('orders');
    } else if (kpiType === 'pendingPayouts') {
      setActiveTab('payments');
    } else if (kpiType === 'supportTickets') {
      setActiveTab('support');
    }
  };

  // Admin Action Handlers
  const handleUpdateOrderStatus = async (orderId, status) => {
    try {
      await api.put(`/orders/status/${orderId}`, { status });
      toast.success(`Order status updated to ${status}`);
      fetchAnalytics();
      if (selectedOrder && selectedOrder._id === orderId) {
        setSelectedOrder((prev) => ({ ...prev, status }));
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Failed to update order status');
    }
  };

  const openConfirmDialog = (type, target) => {
    setConfirmDialog({
      isOpen: true,
      type,
      target,
      reason: '',
      processing: false,
    });
  };

  const closeConfirmDialog = () => {
    setConfirmDialog({
      isOpen: false,
      type: '',
      target: null,
      reason: '',
      processing: false,
    });
  };

  const handleRemoveRider = async () => {
    setConfirmDialog((prev) => ({ ...prev, processing: true }));
    try {
      await api.delete(`/admin/user/${confirmDialog.target._id}`);
      setRidersList((prev) =>
        prev.filter((rider) => rider._id !== confirmDialog.target._id)
      );
      toast.success(`Rider "${confirmDialog.target.name}" has been removed.`);
      closeConfirmDialog();
    } catch (error) {
      console.error('Error removing rider:', error);
      toast.error('Failed to remove rider');
      setConfirmDialog((prev) => ({ ...prev, processing: false }));
    }
  };

  const handleBanCustomer = async () => {
    setConfirmDialog((prev) => ({ ...prev, processing: true }));
    try {
      // In a real app we'd have a ban endpoint, let's assume we update status or delete
      await api.delete(`/admin/user/${confirmDialog.target._id}`);
      setCustomersList((prev) =>
        prev.filter((customer) => customer._id !== confirmDialog.target._id)
      );
      toast.success(
        `Customer "${confirmDialog.target.name}" has been removed.`
      );
      closeConfirmDialog();
    } catch (error) {
      console.error('Error removing customer:', error);
      toast.error('Failed to remove customer');
      setConfirmDialog((prev) => ({ ...prev, processing: false }));
    }
  };

  // ==================== ORDER MODAL ====================
  const OrderModal = () => {
    if (!isOrderModalOpen || !selectedOrder) return null;

    return (
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1100,
          backdropFilter: 'blur(5px)',
        }}
        onClick={() => setIsOrderModalOpen(false)}
      >
        <div
          style={{
            background: 'white',
            width: '90%',
            maxWidth: '700px',
            borderRadius: '20px',
            padding: '40px',
            position: 'relative',
            maxHeight: '90vh',
            overflowY: 'auto',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={() => setIsOrderModalOpen(false)}
            style={{
              position: 'absolute',
              top: '20px',
              right: '24px',
              background: '#f8f9fa',
              border: 'none',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = '#e9ecef')}
            onMouseLeave={(e) => (e.currentTarget.style.background = '#f8f9fa')}
          >
            <XCircle size={24} color="#5a67d8" />
          </button>

          <div style={{ marginBottom: '32px' }}>
            <span
              style={{
                background: '#f0f4ff',
                color: '#5a67d8',
                padding: '8px 16px',
                borderRadius: '50px',
                fontSize: '0.85rem',
                fontWeight: 700,
                marginBottom: '16px',
                display: 'inline-block',
              }}
            >
              ORDER #{selectedOrder._id.slice(-8).toUpperCase()}
            </span>
            <h2
              style={{
                fontSize: '2rem',
                fontWeight: 800,
                margin: '8px 0',
                color: '#1a202c',
              }}
            >
              Order Details
            </h2>
            <p
              style={{
                color: '#718096',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <Calendar size={16} /> Placed on{' '}
              {new Date(selectedOrder.createdAt).toLocaleString()}
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '32px',
              marginBottom: '32px',
            }}
          >
            <div>
              <h4
                style={{
                  textTransform: 'uppercase',
                  fontSize: '0.75rem',
                  letterSpacing: '0.05em',
                  color: '#a0aec0',
                  marginBottom: '12px',
                }}
              >
                Customer Info
              </h4>
              <p
                style={{
                  fontWeight: 700,
                  margin: '0 0 4px 0',
                  color: '#2d3748',
                }}
              >
                {selectedOrder.user?.name || 'Guest User'}
              </p>
              <p
                style={{
                  color: '#718096',
                  margin: '0 0 4px 0',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <MapPin size={14} /> {selectedOrder.deliveryAddress}
              </p>
              <p
                style={{
                  color: '#718096',
                  margin: 0,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <Phone size={14} />{' '}
                {selectedOrder.user?.phone || '+92 3XX XXXXXXX'}
              </p>
            </div>
            <div>
              <h4
                style={{
                  textTransform: 'uppercase',
                  fontSize: '0.75rem',
                  letterSpacing: '0.05em',
                  color: '#a0aec0',
                  marginBottom: '12px',
                }}
              >
                Restaurant
              </h4>
              <p
                style={{
                  fontWeight: 700,
                  margin: '0 0 4px 0',
                  color: '#2d3748',
                }}
              >
                {selectedOrder.restaurant?.name || 'N/A'}
              </p>
              <p
                style={{
                  color: '#718096',
                  margin: 0,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <Store size={14} />{' '}
                {selectedOrder.restaurant?.address ||
                  'Pickup address not specified'}
              </p>
            </div>
          </div>

          <div
            style={{
              background: '#f8fafc',
              borderRadius: '16px',
              padding: '24px',
              marginBottom: '32px',
            }}
          >
            <h4
              style={{
                textTransform: 'uppercase',
                fontSize: '0.75rem',
                letterSpacing: '0.05em',
                color: '#a0aec0',
                marginBottom: '16px',
              }}
            >
              Order Items
            </h4>
            {selectedOrder.items?.map((item, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '12px',
                  paddingBottom: '12px',
                  borderBottom:
                    idx === selectedOrder.items.length - 1
                      ? 'none'
                      : '1px solid #edf2f7',
                }}
              >
                <div>
                  <span style={{ fontWeight: 700, color: '#2d3748' }}>
                    {item.quantity}x
                  </span>{' '}
                  {item.name}
                </div>
                <span style={{ fontWeight: 600, color: '#4a5568' }}>
                  Rs. {item.price * item.quantity}
                </span>
              </div>
            ))}
            <div
              style={{
                borderTop: '2px dashed #e2e8f0',
                marginTop: '16px',
                paddingTop: '16px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '8px',
                  color: '#718096',
                }}
              >
                <span>Subtotal</span>
                <span>Rs. {selectedOrder.itemsTotal}</span>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '8px',
                  color: '#718096',
                }}
              >
                <span>Delivery Fee</span>
                <span>Rs. {selectedOrder.deliveryFee}</span>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontWeight: 800,
                  fontSize: '1.2rem',
                  color: '#2d3748',
                  marginTop: '8px',
                }}
              >
                <span>Total Amount</span>
                <span style={{ color: '#5a67d8' }}>
                  Rs. {selectedOrder.finalAmount}
                </span>
              </div>
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '12px',
              justifyContent: 'flex-end',
              paddingTop: '24px',
              borderTop: '1px solid #edf2f7',
            }}
          >
            {selectedOrder.status === 'pending' && (
              <button
                onClick={() =>
                  handleUpdateOrderStatus(selectedOrder._id, 'preparing')
                }
                style={{
                  background: '#5a67d8',
                  color: 'white',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '10px',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                Mark as Preparing
              </button>
            )}
            {selectedOrder.status === 'preparing' && (
              <button
                onClick={() =>
                  handleUpdateOrderStatus(selectedOrder._id, 'out_for_delivery')
                }
                style={{
                  background: '#48bb78',
                  color: 'white',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '10px',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                Mark as Out for Delivery
              </button>
            )}
            {['pending', 'preparing'].includes(selectedOrder.status) && (
              <button
                onClick={() =>
                  handleUpdateOrderStatus(selectedOrder._id, 'cancelled')
                }
                style={{
                  background: '#fed7d7',
                  color: '#c53030',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '10px',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                Cancel Order
              </button>
            )}
            <button
              onClick={() => setIsOrderModalOpen(false)}
              style={{
                background: '#f7fafc',
                color: '#4a5568',
                border: '1px solid #e2e8f0',
                padding: '12px 24px',
                borderRadius: '10px',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  // ==================== ANALYTICS VIEW ====================
  const AnalyticsView = () => (
    <div className="admin-view professional-admin-view">
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '8px' }}>
          Dashboard
        </h1>
        <p style={{ color: '#666', marginBottom: '24px' }}>
          Welcome back, {user?.name}. Here's your business overview.
        </p>
      </div>

      {/* Admin Filters */}
      <AdminFilters
        onFiltersChange={handleFiltersChange}
        initialFilters={filters}
      />

      {/* Actionable KPI Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '24px',
          marginBottom: '40px',
          marginTop: '24px',
        }}
      >
        <ActionKPICard
          icon={AlertCircle}
          metric="Failed Orders"
          value={actionableKPIs.failedOrders.count}
          trend={actionableKPIs.failedOrders.trend}
          severity={actionableKPIs.failedOrders.severity}
          action="Review"
          onClick={() => handleActionKPI('failedOrders')}
        />
        <ActionKPICard
          icon={CreditCard}
          metric="Pending Payouts"
          value={actionableKPIs.pendingPayouts.count}
          trend={actionableKPIs.pendingPayouts.trend}
          severity={actionableKPIs.pendingPayouts.severity}
          action="Process"
          onClick={() => handleActionKPI('pendingPayouts')}
        />
        <ActionKPICard
          icon={Megaphone}
          metric="Support Tickets"
          value={actionableKPIs.supportTickets.count}
          trend={actionableKPIs.supportTickets.trend}
          severity={actionableKPIs.supportTickets.severity}
          action="Address"
          onClick={() => handleActionKPI('supportTickets')}
        />
      </div>

      {/* KPI Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '24px',
          marginBottom: '40px',
        }}
      >
        {[
          {
            label: 'Total Revenue',
            value: `Rs. ${analytics.totalRevenue.toLocaleString()}`,
            icon: <DollarSign size={24} />,
            trend: '+12.5%',
            color: '#667eea',
          },
          {
            label: 'Total Orders',
            value: analytics.totalOrders,
            icon: <ShoppingBag size={24} />,
            trend: '+8.2%',
            color: '#764ba2',
          },
          {
            label: 'Active Users',
            value: analytics.totalUsers,
            icon: <Users size={24} />,
            trend: '+5.1%',
            color: '#f093fb',
          },
          {
            label: 'Active Riders',
            value: analytics.activeRiders,
            icon: <Bike size={24} />,
            trend: '+2.3%',
            color: '#4facfe',
          },
          {
            label: 'Restaurants',
            value: analytics.restaurantCount,
            icon: <Store size={24} />,
            trend: '+3.8%',
            color: '#43e97b',
          },
          {
            label: 'This Month',
            value: 'Rs. 125,000',
            icon: <TrendingUp size={24} />,
            trend: '+18.2%',
            color: '#fa709a',
          },
        ].map((kpi, idx) => (
          <div
            key={idx}
            style={{
              background: 'white',
              padding: '24px',
              borderRadius: '16px',
              boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
              border: '1px solid #f0f0f0',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.12)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.08)';
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '16px',
              }}
            >
              <div style={{ color: kpi.color }}>{kpi.icon}</div>
              <span
                style={{
                  fontSize: '0.8rem',
                  color: '#27ae60',
                  fontWeight: 700,
                  background: '#d4edda',
                  padding: '4px 10px',
                  borderRadius: '8px',
                }}
              >
                {kpi.trend}
              </span>
            </div>
            <p
              style={{ margin: '0 0 8px 0', color: '#999', fontSize: '0.9rem' }}
            >
              {kpi.label}
            </p>
            <h3 style={{ margin: 0, fontSize: '1.8rem', fontWeight: 700 }}>
              {kpi.value}
            </h3>
          </div>
        ))}
      </div>

      {/* Live Orders Widget */}
      <div style={{ marginBottom: '40px' }}>
        <h3
          style={{ marginBottom: '16px', fontSize: '1.3rem', fontWeight: 700 }}
        >
          Live Orders
        </h3>
        <LiveOrdersWidget />
      </div>

      {/* Chart Section */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr',
          gap: '24px',
          marginBottom: '40px',
        }}
      >
        {/* Orders Trend */}
        <div
          style={{
            background: 'white',
            padding: '24px',
            borderRadius: '16px',
            boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
            border: '1px solid #f0f0f0',
          }}
        >
          <h3
            style={{
              margin: '0 0 24px 0',
              fontSize: '1.2rem',
              fontWeight: 700,
            }}
          >
            Weekly Orders Trend
          </h3>
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-end',
              gap: '12px',
              height: '200px',
            }}
          >
            {analytics.orderTrend.map((item, idx) => (
              <div
                key={idx}
                style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <div
                  style={{
                    width: '100%',
                    height: `${(item.orders / 350) * 150}px`,
                    background:
                      'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    borderRadius: '8px 8px 0 0',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.opacity = '0.8';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.opacity = '1';
                  }}
                />
                <span
                  style={{ fontSize: '0.8rem', color: '#666', fontWeight: 600 }}
                >
                  {item.date}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Revenue Distribution */}
        <div
          style={{
            background: 'white',
            padding: '24px',
            borderRadius: '16px',
            boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
            border: '1px solid #f0f0f0',
          }}
        >
          <h3
            style={{
              margin: '0 0 24px 0',
              fontSize: '1.2rem',
              fontWeight: 700,
            }}
          >
            Revenue Breakdown
          </h3>
          {[
            { label: 'Orders', value: 65, color: '#667eea' },
            { label: 'Subscriptions', value: 20, color: '#764ba2' },
            { label: 'Ads', value: 15, color: '#f093fb' },
          ].map((item, idx) => (
            <div key={idx} style={{ marginBottom: '16px' }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '6px',
                }}
              >
                <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>
                  {item.label}
                </span>
                <span style={{ fontWeight: 700, color: item.color }}>
                  {item.value}%
                </span>
              </div>
              <div
                style={{
                  background: '#f0f0f0',
                  borderRadius: '8px',
                  height: '8px',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    height: '100%',
                    width: `${item.value}%`,
                    background: item.color,
                    transition: 'width 0.3s ease',
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div
        style={{
          background: 'white',
          padding: '24px',
          borderRadius: '16px',
          boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
          border: '1px solid #f0f0f0',
        }}
      >
        <h3
          style={{ margin: '0 0 24px 0', fontSize: '1.2rem', fontWeight: 700 }}
        >
          Recent Activity
        </h3>
        <div style={{ display: 'grid', gap: '12px' }}>
          {[
            {
              type: 'order',
              message: 'New order #ORD-5624 from Ali Khan',
              time: '5 minutes ago',
            },
            {
              type: 'rider',
              message: 'Rider Ahmed is now online',
              time: '12 minutes ago',
            },
            {
              type: 'restaurant',
              message: 'Kababjees updated menu',
              time: '25 minutes ago',
            },
            {
              type: 'user',
              message: 'New customer registration',
              time: '1 hour ago',
            },
          ].map((activity, idx) => (
            <div
              key={idx}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px',
                background: '#f8f9fa',
                borderRadius: '8px',
              }}
            >
              <div
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background:
                    activity.type === 'order'
                      ? '#667eea'
                      : activity.type === 'rider'
                      ? '#43e97b'
                      : '#f093fb',
                }}
              />
              <div style={{ flex: 1 }}>
                <p style={{ margin: 0, fontSize: '0.95rem', fontWeight: 500 }}>
                  {activity.message}
                </p>
              </div>
              <span style={{ fontSize: '0.8rem', color: '#999' }}>
                {activity.time}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // ==================== ORDERS VIEW ====================
  const OrdersView = () => (
    <div className="admin-view professional-admin-view">
      <div
        style={{
          marginBottom: '24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0 }}>
          Order Management
        </h2>
        <button
          style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <Download size={18} />
          Export
        </button>
      </div>

      {/* Filters */}
      <div
        style={{
          display: 'flex',
          gap: '12px',
          marginBottom: '24px',
          flexWrap: 'wrap',
        }}
      >
        <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
          <Search
            size={18}
            style={{
              position: 'absolute',
              left: '12px',
              top: '12px',
              color: '#999',
            }}
          />
          <input
            type="text"
            placeholder="Search by Order ID or Customer..."
            style={{
              width: '100%',
              padding: '10px 40px',
              borderRadius: '8px',
              border: '1px solid #e0e0e0',
              fontSize: '0.95rem',
            }}
          />
        </div>
        <select
          style={{
            padding: '10px 16px',
            borderRadius: '8px',
            border: '1px solid #e0e0e0',
            fontSize: '0.95rem',
          }}
        >
          <option>All Status</option>
          <option>Pending</option>
          <option>Preparing</option>
          <option>Delivered</option>
          <option>Cancelled</option>
        </select>
        <select
          style={{
            padding: '10px 16px',
            borderRadius: '8px',
            border: '1px solid #e0e0e0',
            fontSize: '0.95rem',
          }}
        >
          <option>Last 7 Days</option>
          <option>Last 30 Days</option>
          <option>Last 3 Months</option>
        </select>
      </div>

      {/* Orders Table */}
      <div
        style={{
          background: 'white',
          borderRadius: '12px',
          border: '1px solid #e0e0e0',
          overflow: 'hidden',
        }}
      >
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr
              style={{
                background: '#f8f9fa',
                borderBottom: '1px solid #e0e0e0',
              }}
            >
              {[
                'Order ID',
                'Customer',
                'Restaurant',
                'Amount',
                'Status',
                'Date',
                'Actions',
              ].map((header) => (
                <th
                  key={header}
                  style={{
                    padding: '16px',
                    textAlign: 'left',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    color: '#555',
                  }}
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr
                key={order._id}
                style={{
                  borderBottom: '1px solid #f0f0f0',
                  transition: 'background 0.2s ease',
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = '#f8f9fa')
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = 'white')
                }
              >
                <td
                  style={{ padding: '16px', fontWeight: 600, color: '#667eea' }}
                >
                  #{order._id.slice(-6).toUpperCase()}
                </td>
                <td style={{ padding: '16px' }}>
                  {order.user?.name || 'Customer'}
                </td>
                <td style={{ padding: '16px' }}>
                  {order.restaurant?.name || 'Restaurant'}
                </td>
                <td style={{ padding: '16px', fontWeight: 600 }}>
                  Rs. {order.finalAmount}
                </td>
                <td style={{ padding: '16px' }}>
                  <span
                    style={{
                      display: 'inline-block',
                      padding: '6px 12px',
                      borderRadius: '8px',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      background:
                        order.status === 'delivered'
                          ? '#d4edda'
                          : order.status === 'pending'
                          ? '#fff3cd'
                          : order.status === 'preparing'
                          ? '#cfe2ff'
                          : '#f8d7da',
                      color:
                        order.status === 'delivered'
                          ? '#155724'
                          : order.status === 'pending'
                          ? '#856404'
                          : order.status === 'preparing'
                          ? '#084298'
                          : '#842029',
                      textTransform: 'capitalize',
                    }}
                  >
                    {order.status}
                  </span>
                </td>
                <td style={{ padding: '16px', color: '#666' }}>
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>
                <td style={{ padding: '16px' }}>
                  <button
                    onClick={() => {
                      setSelectedOrder(order);
                      setIsOrderModalOpen(true);
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#667eea',
                      cursor: 'pointer',
                      fontWeight: 600,
                      fontSize: '0.9rem',
                    }}
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  // ==================== RESTAURANTS VIEW ====================
  const RestaurantsView = () => (
    <div className="admin-view professional-admin-view">
      <div
        style={{
          marginBottom: '24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0 }}>
          Restaurants
        </h2>
        <button
          style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <Plus size={18} />
          Add Restaurant
        </button>
      </div>

      {/* Search */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ position: 'relative' }}>
          <Search
            size={18}
            style={{
              position: 'absolute',
              left: '12px',
              top: '12px',
              color: '#999',
            }}
          />
          <input
            type="text"
            placeholder="Search restaurants..."
            style={{
              width: '100%',
              padding: '10px 40px',
              borderRadius: '8px',
              border: '1px solid #e0e0e0',
              fontSize: '0.95rem',
            }}
          />
        </div>
      </div>

      {/* Restaurants Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '24px',
        }}
      >
        {restaurants.map((restaurant) => (
          <div
            key={restaurant._id}
            style={{
              background: 'white',
              borderRadius: '12px',
              border: '1px solid #e0e0e0',
              overflow: 'hidden',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.12)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <div style={{ padding: '20px' }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                }}
              >
                <h3
                  style={{
                    margin: '0 0 8px 0',
                    fontSize: '1.1rem',
                    fontWeight: 700,
                  }}
                >
                  {restaurant.name}
                </h3>
                <span
                  style={{
                    fontSize: '0.75rem',
                    padding: '2px 8px',
                    borderRadius: '10px',
                    background:
                      restaurant.status === 'open' ? '#e8f5e9' : '#ffebee',
                    color: restaurant.status === 'open' ? '#2e7d32' : '#c62828',
                    textTransform: 'capitalize',
                  }}
                >
                  {restaurant.status}
                </span>
              </div>
              <p
                style={{
                  margin: '0 0 12px 0',
                  color: '#666',
                  fontSize: '0.9rem',
                }}
              >
                {Array.isArray(restaurant.cuisine)
                  ? restaurant.cuisine.join(', ')
                  : restaurant.cuisine}
              </p>
              <div
                style={{
                  display: 'flex',
                  gap: '16px',
                  marginBottom: '16px',
                  fontSize: '0.85rem',
                }}
              >
                <div>
                  <p style={{ margin: '0 0 4px 0', color: '#999' }}>Rating</p>
                  <p style={{ margin: 0, fontWeight: 700, color: '#f39c12' }}>
                    ⭐ {restaurant.rating}
                  </p>
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ margin: '0 0 4px 0', color: '#999' }}>Address</p>
                  <p
                    style={{
                      margin: 0,
                      fontWeight: 500,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {restaurant.location?.address}
                  </p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  style={{
                    flex: 1,
                    padding: '8px',
                    background: '#f8f9fa',
                    border: '1px solid #e0e0e0',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: 600,
                    color: '#444',
                    fontSize: '0.8rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px',
                  }}
                >
                  <Edit size={14} />
                  Edit
                </button>
                <button
                  style={{
                    flex: 1,
                    padding: '8px',
                    background: '#fff',
                    border: '1px solid #ffcdd2',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: 600,
                    color: '#c62828',
                    fontSize: '0.8rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px',
                  }}
                >
                  <Trash2 size={14} />
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // ==================== RIDERS VIEW ====================
  const RidersView = () => (
    <div className="admin-view professional-admin-view">
      <div
        style={{
          marginBottom: '24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0 }}>
          Riders Management
        </h2>
        <button
          style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <Plus size={18} />
          Add Rider
        </button>
      </div>

      {ridersList.length === 0 ? (
        <div
          style={{
            background: 'white',
            borderRadius: '12px',
            border: '1px solid #e0e0e0',
            padding: '48px 24px',
            textAlign: 'center',
          }}
        >
          <Bike size={48} color="#ccc" style={{ marginBottom: '16px' }} />
          <p style={{ color: '#999', margin: 0 }}>No riders found</p>
        </div>
      ) : (
        <div
          style={{
            background: 'white',
            borderRadius: '12px',
            border: '1px solid #e0e0e0',
            overflow: 'hidden',
          }}
        >
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr
                style={{
                  background: '#f8f9fa',
                  borderBottom: '1px solid #e0e0e0',
                }}
              >
                {[
                  'Name',
                  'Phone',
                  'Status',
                  'Earnings',
                  'Deliveries',
                  'Rating',
                  'Actions',
                ].map((header) => (
                  <th
                    key={header}
                    style={{
                      padding: '16px',
                      textAlign: 'left',
                      fontWeight: 700,
                      fontSize: '0.9rem',
                      color: '#555',
                    }}
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ridersList.map((rider) => (
                <tr
                  key={rider.id}
                  style={{ borderBottom: '1px solid #f0f0f0' }}
                >
                  <td style={{ padding: '16px', fontWeight: 600 }}>
                    {rider.name}
                  </td>
                  <td style={{ padding: '16px', color: '#666' }}>
                    {rider.phone}
                  </td>
                  <td style={{ padding: '16px' }}>
                    <span
                      style={{
                        display: 'inline-block',
                        padding: '6px 12px',
                        borderRadius: '8px',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        background:
                          rider.status === 'online' ? '#d4edda' : '#f0f0f0',
                        color: rider.status === 'online' ? '#155724' : '#666',
                        textTransform: 'capitalize',
                      }}
                    >
                      {rider.status}
                    </span>
                  </td>
                  <td style={{ padding: '16px', fontWeight: 600 }}>
                    Rs. {rider.earnings}
                  </td>
                  <td style={{ padding: '16px' }}>{rider.deliveries}</td>
                  <td style={{ padding: '16px', color: '#f39c12' }}>
                    ⭐ {rider.rating}
                  </td>
                  <td style={{ padding: '16px' }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#667eea',
                          cursor: 'pointer',
                          fontWeight: 600,
                          fontSize: '0.85rem',
                          padding: '4px 8px',
                        }}
                      >
                        View
                      </button>
                      <button
                        onClick={() => openConfirmDialog('removeRider', rider)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#e74c3c',
                          cursor: 'pointer',
                          fontWeight: 600,
                          fontSize: '0.85rem',
                          padding: '4px 8px',
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  // ==================== CUSTOMERS VIEW ====================
  const CustomersView = () => (
    <div className="admin-view professional-admin-view">
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0 }}>
          Customers Management
        </h2>
      </div>

      {/* Search */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ position: 'relative' }}>
          <Search
            size={18}
            style={{
              position: 'absolute',
              left: '12px',
              top: '12px',
              color: '#999',
            }}
          />
          <input
            type="text"
            placeholder="Search customers..."
            style={{
              width: '100%',
              padding: '10px 40px',
              borderRadius: '8px',
              border: '1px solid #e0e0e0',
              fontSize: '0.95rem',
            }}
          />
        </div>
      </div>

      {/* Customers Table */}
      <div
        style={{
          background: 'white',
          borderRadius: '12px',
          border: '1px solid #e0e0e0',
          overflow: 'hidden',
        }}
      >
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr
              style={{
                background: '#f8f9fa',
                borderBottom: '1px solid #e0e0e0',
              }}
            >
              {[
                'Name',
                'Email',
                'Orders',
                'Spending',
                'Joined',
                'Status',
                'Actions',
              ].map((header) => (
                <th
                  key={header}
                  style={{
                    padding: '16px',
                    textAlign: 'left',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    color: '#555',
                  }}
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {customersList.map((customer) => (
              <tr
                key={customer.id}
                style={{ borderBottom: '1px solid #f0f0f0' }}
              >
                <td style={{ padding: '16px', fontWeight: 600 }}>
                  {customer.name}
                </td>
                <td style={{ padding: '16px', color: '#666' }}>
                  {customer.email}
                </td>
                <td style={{ padding: '16px' }}>{customer.orders}</td>
                <td style={{ padding: '16px', fontWeight: 600 }}>
                  Rs. {customer.spending}
                </td>
                <td style={{ padding: '16px', color: '#666' }}>
                  {customer.joined}
                </td>
                <td style={{ padding: '16px' }}>
                  <span
                    style={{
                      display: 'inline-block',
                      padding: '6px 12px',
                      borderRadius: '8px',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      background:
                        customer.status === 'active'
                          ? '#d4edda'
                          : customer.status === 'banned'
                          ? '#f8d7da'
                          : '#f0f0f0',
                      color:
                        customer.status === 'active'
                          ? '#155724'
                          : customer.status === 'banned'
                          ? '#721c24'
                          : '#666',
                      textTransform: 'capitalize',
                    }}
                  >
                    {customer.status}
                  </span>
                </td>
                <td style={{ padding: '16px' }}>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {customer.status !== 'banned' && (
                      <button
                        onClick={() =>
                          openConfirmDialog('banCustomer', customer)
                        }
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#e74c3c',
                          cursor: 'pointer',
                          fontWeight: 600,
                          fontSize: '0.85rem',
                          padding: '4px 8px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                        }}
                      >
                        <Ban size={14} />
                        Ban
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  // ==================== FINANCE VIEW ====================
  const FinanceView = () => (
    <div className="admin-view professional-admin-view">
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0 }}>
          Finance & Payments
        </h2>
      </div>

      {/* Summary Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '24px',
          marginBottom: '40px',
        }}
      >
        {[
          { label: 'Total Revenue', value: 'Rs. 2,500,000', color: '#27ae60' },
          { label: 'Pending Payments', value: 'Rs. 245,000', color: '#f39c12' },
          { label: 'Payouts', value: 'Rs. 1,850,000', color: '#2980b9' },
          { label: 'Balance', value: 'Rs. 405,000', color: '#667eea' },
        ].map((card, idx) => (
          <div
            key={idx}
            style={{
              background: 'white',
              padding: '24px',
              borderRadius: '12px',
              border: `3px solid ${card.color}`,
            }}
          >
            <p
              style={{ margin: '0 0 8px 0', color: '#999', fontSize: '0.9rem' }}
            >
              {card.label}
            </p>
            <h3
              style={{
                margin: 0,
                fontSize: '1.8rem',
                fontWeight: 700,
                color: card.color,
              }}
            >
              {card.value}
            </h3>
          </div>
        ))}
      </div>

      {/* Payments Table */}
      <div
        style={{
          background: 'white',
          borderRadius: '12px',
          border: '1px solid #e0e0e0',
          overflow: 'hidden',
        }}
      >
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr
              style={{
                background: '#f8f9fa',
                borderBottom: '1px solid #e0e0e0',
              }}
            >
              {['Transaction ID', 'Type', 'Amount', 'Date', 'Status'].map(
                (header) => (
                  <th
                    key={header}
                    style={{
                      padding: '16px',
                      textAlign: 'left',
                      fontWeight: 700,
                      fontSize: '0.9rem',
                      color: '#555',
                    }}
                  >
                    {header}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {[
              {
                id: '#TXN-001',
                type: 'Order Payment',
                amount: '+Rs. 1,500',
                date: 'Dec 28, 2025',
                status: 'completed',
              },
              {
                id: '#TXN-002',
                type: 'Rider Payout',
                amount: '-Rs. 500',
                date: 'Dec 28, 2025',
                status: 'completed',
              },
              {
                id: '#TXN-003',
                type: 'Restaurant Commission',
                amount: '+Rs. 200',
                date: 'Dec 27, 2025',
                status: 'pending',
              },
            ].map((tx) => (
              <tr key={tx.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                <td
                  style={{ padding: '16px', fontWeight: 600, color: '#667eea' }}
                >
                  {tx.id}
                </td>
                <td style={{ padding: '16px' }}>{tx.type}</td>
                <td
                  style={{
                    padding: '16px',
                    fontWeight: 600,
                    color: tx.amount.startsWith('+') ? '#27ae60' : '#c62828',
                  }}
                >
                  {tx.amount}
                </td>
                <td style={{ padding: '16px', color: '#666' }}>{tx.date}</td>
                <td style={{ padding: '16px' }}>
                  <span
                    style={{
                      display: 'inline-block',
                      padding: '6px 12px',
                      borderRadius: '8px',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      background:
                        tx.status === 'completed' ? '#d4edda' : '#fff3cd',
                      color: tx.status === 'completed' ? '#155724' : '#856404',
                    }}
                  >
                    {tx.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  // ==================== PROMOTIONS VIEW ====================
  const PromotionsView = () => (
    <div className="admin-view professional-admin-view">
      <div
        style={{
          marginBottom: '24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0 }}>
          Promotions & Offers
        </h2>
        <button
          style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <Plus size={18} />
          Create Promotion
        </button>
      </div>

      {/* Promotions Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '24px',
        }}
      >
        {[
          { code: 'AUTO50', discount: '50%', active: true, usage: 245 },
          {
            code: 'FREEDEL',
            discount: 'Free Delivery',
            active: true,
            usage: 189,
          },
          { code: 'SAVE5', discount: '$5 OFF', active: false, usage: 0 },
        ].map((promo) => (
          <div
            key={promo.code}
            style={{
              background: 'white',
              borderRadius: '12px',
              border: '1px solid #e0e0e0',
              padding: '20px',
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
              <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 700 }}>
                {promo.code}
              </h3>
              <span
                style={{
                  padding: '6px 12px',
                  borderRadius: '8px',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  background: promo.active ? '#d4edda' : '#f0f0f0',
                  color: promo.active ? '#155724' : '#666',
                }}
              >
                {promo.active ? 'Active' : 'Inactive'}
              </span>
            </div>
            <p
              style={{
                margin: '0 0 12px 0',
                fontSize: '1.5rem',
                fontWeight: 700,
                color: '#667eea',
              }}
            >
              {promo.discount}
            </p>
            <p
              style={{
                margin: '0 0 16px 0',
                color: '#666',
                fontSize: '0.9rem',
              }}
            >
              Used {promo.usage} times
            </p>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                style={{
                  flex: 1,
                  padding: '8px',
                  background: '#e3f2fd',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: 600,
                  color: '#1976d2',
                  fontSize: '0.85rem',
                }}
              >
                Edit
              </button>
              <button
                style={{
                  flex: 1,
                  padding: '8px',
                  background: '#f3e5f5',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: 600,
                  color: '#7b1fa2',
                  fontSize: '0.85rem',
                }}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // ==================== SETTINGS VIEW ====================
  const SettingsView = () => (
    <div className="admin-view professional-admin-view">
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0 }}>
          Admin Settings
        </h2>
        <p style={{ color: '#666' }}>
          Manage your administrator account details
        </p>
      </div>

      <div
        className="card shadow-premium"
        style={{
          background: 'white',
          padding: '40px',
          borderRadius: '15px',
          maxWidth: '800px',
        }}
      >
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
                }}
              >
                Name
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
                }}
              >
                Phone
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
                }}
              >
                Email (Account Identifier)
              </label>
              <input
                type="email"
                className="form-control"
                value={profileData.email}
                disabled
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid #ddd',
                  background: '#f8f9fa',
                }}
              />
            </div>
            <div style={{ gridColumn: 'span 2' }}>
              <label
                style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontWeight: 600,
                }}
              >
                System Location / Base
              </label>
              <textarea
                className="form-control"
                value={profileData.address}
                onChange={(e) =>
                  setProfileData({ ...profileData, address: e.target.value })
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

          <div style={{ display: 'flex', gap: '15px' }}>
            <button
              type="submit"
              style={{
                padding: '14px 28px',
                background: '#667eea',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Save Settings
            </button>
            <button
              type="button"
              onClick={fetchProfile}
              style={{
                padding: '14px 28px',
                background: '#f8f9fa',
                color: '#666',
                border: '1px solid #ddd',
                borderRadius: '8px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Reset Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  // ==================== CONFIRMATION DIALOG ====================
  const ConfirmationDialog = () => {
    if (!confirmDialog.isOpen) return null;

    const isRemoval = confirmDialog.type === 'removeRider';
    const isBanning = confirmDialog.type === 'banCustomer';

    return (
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
        }}
        onClick={closeConfirmDialog}
      >
        <div
          style={{
            background: 'white',
            borderRadius: '12px',
            padding: '32px',
            maxWidth: '500px',
            width: '90%',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '16px',
            }}
          >
            <AlertTriangle size={24} color="#e74c3c" />
            <h3 style={{ margin: 0, fontSize: '1.3rem', color: '#333' }}>
              {isRemoval ? 'Remove Rider' : 'Ban Customer'}
            </h3>
          </div>

          <p style={{ color: '#666', marginBottom: '16px', lineHeight: '1.5' }}>
            {isRemoval
              ? `Are you sure you want to remove "${confirmDialog.target?.name}" from the system? This action cannot be easily undone.`
              : `Are you sure you want to ban "${confirmDialog.target?.name}"? They will no longer be able to use the platform.`}
          </p>

          {isRemoval && (
            <div style={{ marginBottom: '16px' }}>
              <label
                style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontWeight: 600,
                  color: '#333',
                }}
              >
                Reason for removal (optional):
              </label>
              <textarea
                value={confirmDialog.reason}
                onChange={(e) =>
                  setConfirmDialog((prev) => ({
                    ...prev,
                    reason: e.target.value,
                  }))
                }
                placeholder="e.g., Fraudulent activity, Poor service quality..."
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #e0e0e0',
                  borderRadius: '8px',
                  fontFamily: 'inherit',
                  fontSize: '0.9rem',
                  minHeight: '80px',
                  boxSizing: 'border-box',
                }}
              />
            </div>
          )}

          <div
            style={{
              display: 'flex',
              gap: '12px',
              justifyContent: 'flex-end',
            }}
          >
            <button
              onClick={closeConfirmDialog}
              disabled={confirmDialog.processing}
              style={{
                padding: '10px 20px',
                border: '1px solid #e0e0e0',
                background: 'white',
                borderRadius: '8px',
                cursor: confirmDialog.processing ? 'not-allowed' : 'pointer',
                fontWeight: 600,
                color: '#666',
                opacity: confirmDialog.processing ? 0.5 : 1,
              }}
            >
              Cancel
            </button>
            <button
              onClick={isRemoval ? handleRemoveRider : handleBanCustomer}
              disabled={confirmDialog.processing}
              style={{
                padding: '10px 20px',
                background: isRemoval ? '#e74c3c' : '#e74c3c',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: confirmDialog.processing ? 'not-allowed' : 'pointer',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                opacity: confirmDialog.processing ? 0.7 : 1,
              }}
            >
              {confirmDialog.processing && (
                <Loader size={16} className="spin" />
              )}
              {isRemoval ? 'Remove Rider' : 'Ban Customer'}
            </button>
          </div>
        </div>
      </div>
    );
  };

  // ==================== LIVE MONITORING VIEW ====================
  const LiveMonitoringView = () => (
    <div className="admin-view professional-admin-view">
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0 }}>
          🌍 Live System Monitor
        </h2>
        <p style={{ color: '#666', marginTop: '8px' }}>
          Real-time tracking of all active orders and riders across the platform
        </p>
      </div>

      {/* Map Simulation */}
      <div
        style={{
          background: '#f0f2f5',
          borderRadius: '12px',
          border: '2px solid #667eea',
          height: '600px',
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              "linear-gradient(135deg, #667eea15 0%, #764ba215 100%), url(\"data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M10 10 L90 90 M90 10 L10 90' stroke='%23ddd' stroke-width='1'/%3E%3C/svg%3E\")",
            zIndex: 0,
          }}
        />

        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <Globe size={48} color="#667eea" />
          <h3
            style={{
              marginTop: '16px',
              color: '#667eea',
              fontWeight: 700,
              fontSize: '1.2rem',
            }}
          >
            Live Map Monitoring
          </h3>
          <p style={{ color: '#666', marginTop: '8px' }}>
            Integrated with Google Maps API - Showing real-time GPS tracking
          </p>

          {/* Mock Active Tracking */}
          <div
            style={{
              marginTop: '20px',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '12px',
              maxWidth: '600px',
              margin: '20px auto 0',
            }}
          >
            <div
              style={{
                background: 'white',
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid #e0e0e0',
              }}
            >
              <div
                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <Bike size={18} color="#27ae60" />
                <div style={{ textAlign: 'left' }}>
                  <p style={{ margin: 0, fontWeight: 600, color: '#333' }}>
                    12 Active Riders
                  </p>
                  <p
                    style={{
                      margin: '4px 0 0',
                      fontSize: '0.8rem',
                      color: '#666',
                    }}
                  >
                    In transit
                  </p>
                </div>
              </div>
            </div>

            <div
              style={{
                background: 'white',
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid #e0e0e0',
              }}
            >
              <div
                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <ShoppingBag size={18} color="#f39c12" />
                <div style={{ textAlign: 'left' }}>
                  <p style={{ margin: 0, fontWeight: 600, color: '#333' }}>
                    28 Active Orders
                  </p>
                  <p
                    style={{
                      margin: '4px 0 0',
                      fontSize: '0.8rem',
                      color: '#666',
                    }}
                  >
                    Being delivered
                  </p>
                </div>
              </div>
            </div>

            <div
              style={{
                background: 'white',
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid #e0e0e0',
              }}
            >
              <div
                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <Users size={18} color="#2980b9" />
                <div style={{ textAlign: 'left' }}>
                  <p style={{ margin: 0, fontWeight: 600, color: '#333' }}>
                    342 Active Users
                  </p>
                  <p
                    style={{
                      margin: '4px 0 0',
                      fontSize: '0.8rem',
                      color: '#666',
                    }}
                  >
                    On platform
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Active Deliveries Summary */}
      <div
        style={{
          background: 'white',
          borderRadius: '12px',
          border: '1px solid #e0e0e0',
          padding: '24px',
          marginBottom: '24px',
        }}
      >
        <h3
          style={{
            fontSize: '1.1rem',
            fontWeight: 700,
            marginTop: 0,
            marginBottom: '16px',
            color: '#333',
          }}
        >
          📍 Active Deliveries
        </h3>

        <div
          style={{
            display: 'grid',
            gap: '12px',
          }}
        >
          {orders
            .filter((o) =>
              ['pending', 'preparing', 'out_for_delivery'].includes(o.status)
            )
            .slice(0, 5)
            .map((delivery) => (
              <div
                key={delivery._id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '12px',
                  background: '#f8f9fa',
                  borderRadius: '8px',
                  border: '1px solid #e0e0e0',
                }}
              >
                <div>
                  <p
                    style={{
                      margin: '0 0 4px',
                      fontWeight: 600,
                      color: '#333',
                    }}
                  >
                    #{delivery._id.slice(-6).toUpperCase()} -{' '}
                    {delivery.user?.name || 'Customer'}
                  </p>
                  <p
                    style={{
                      margin: '0 0 2px',
                      fontSize: '0.85rem',
                      color: '#666',
                    }}
                  >
                    📍 {delivery.restaurant?.name || 'Restaurant'} →{' '}
                    {delivery.deliveryAddress}
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p
                    style={{
                      margin: '0 0 4px',
                      fontWeight: 700,
                      color: '#667eea',
                    }}
                  >
                    {delivery.status === 'pending'
                      ? 'Waiting'
                      : delivery.status === 'preparing'
                      ? 'Cooking'
                      : 'In Transit'}
                  </p>
                  <span
                    style={{
                      display: 'inline-block',
                      padding: '4px 10px',
                      background:
                        delivery.status === 'pending' ? '#ffeaa7' : '#d4edda',
                      color:
                        delivery.status === 'pending' ? '#856404' : '#155724',
                      borderRadius: '6px',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      textTransform: 'capitalize',
                    }}
                  >
                    {delivery.status}
                  </span>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* System Health */}
      <div
        style={{
          background: 'white',
          borderRadius: '12px',
          border: '1px solid #e0e0e0',
          padding: '24px',
        }}
      >
        <h3
          style={{
            fontSize: '1.1rem',
            fontWeight: 700,
            marginTop: 0,
            marginBottom: '16px',
            color: '#333',
          }}
        >
          ⚡ System Health
        </h3>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '12px',
          }}
        >
          {[
            { label: 'API Response', value: '95ms', status: 'good' },
            { label: 'Database', value: 'Connected', status: 'good' },
            { label: 'Queue Jobs', value: '12 pending', status: 'warning' },
            { label: 'Cache', value: '98% hit rate', status: 'good' },
          ].map((metric) => (
            <div
              key={metric.label}
              style={{
                padding: '12px',
                background: metric.status === 'good' ? '#d4edda' : '#fff3cd',
                borderRadius: '8px',
                border:
                  metric.status === 'good'
                    ? '1px solid #c3e6cb'
                    : '1px solid #ffeaa7',
              }}
            >
              <p
                style={{
                  margin: '0 0 4px',
                  fontSize: '0.85rem',
                  color: '#666',
                }}
              >
                {metric.label}
              </p>
              <p
                style={{
                  margin: 0,
                  fontWeight: 700,
                  color: metric.status === 'good' ? '#155724' : '#856404',
                }}
              >
                {metric.value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div
      className="admin-layout"
      style={{ display: 'flex', minHeight: '100vh', background: '#f5f6fa' }}
    >
      {/* Sidebar */}
      <aside
        className={`admin-sidebar ${mobileMenuOpen ? 'open' : ''}`}
        style={{
          width: '260px',
          background: 'white',
          borderRight: '1px solid #e0e0e0',
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
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setMobileMenuOpen(false);
              }}
              style={{
                width: '100%',
                padding: '14px 24px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                cursor: 'pointer',
                color: activeTab === item.id ? '#667eea' : '#555',
                background: activeTab === item.id ? '#f0f4ff' : 'transparent',
                borderRight:
                  activeTab === item.id ? '4px solid #667eea' : 'none',
                border: 'none',
                fontSize: '0.95rem',
                fontWeight: activeTab === item.id ? 600 : 500,
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                if (activeTab !== item.id) {
                  e.currentTarget.style.background = '#f8f9fa';
                }
              }}
              onMouseLeave={(e) => {
                if (activeTab !== item.id) {
                  e.currentTarget.style.background = 'transparent';
                }
              }}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </aside>

      {/* Main Content */}
      <main
        className="admin-content"
        style={{
          flex: 1,
          marginLeft: '260px',
          padding: '30px',
          marginTop: 0,
        }}
      >
        {activeTab === 'analytics' && <AnalyticsView />}
        {activeTab === 'orders' && <OrdersView />}
        {activeTab === 'restaurants' && <RestaurantsView />}
        {activeTab === 'riders' && <RidersView />}
        {activeTab === 'customers' && <CustomersView />}
        {activeTab === 'finance' && <FinanceView />}
        {activeTab === 'promotions' && <PromotionsView />}
        {activeTab === 'monitoring' && <LiveMonitoringView />}
        {activeTab === 'settings' && <SettingsView />}
      </main>

      <OrderModal />
      <ConfirmationDialog />

      {mobileMenuOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            zIndex: 90,
          }}
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
