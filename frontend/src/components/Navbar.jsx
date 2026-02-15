import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShoppingCart,
  User as UserIcon,
  LogOut,
  Menu,
  Package,
  Settings,
  ChevronDown,
  Bell,
  MapPin,
  Check,
  Navigation,
  Search,
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useNotification } from '../context/NotificationContext';
import { useLocation } from '../context/LocationContext';
import FloatingWhatsApp from './FloatingWhatsApp';
import logo from '../assets/logo.png';
import LocationPickerModal from './LocationPickerModal';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { totalCount } = useCart();
  const { notifications, unreadCount, markAllAsRead, markAsRead } =
    useNotification();
  const { location, detectLocation, updateLocation, loading } = useLocation();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [showMapPicker, setShowMapPicker] = useState(false);
  const notifRef = useRef(null);
  const locationRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (locationRef.current && !locationRef.current.contains(event.target)) {
        setShowLocationDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
    setShowDropdown(false);
  };

  return (
    <nav className="navbar">
      <div className="container nav-content">
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <Link to="/" className="logo-container">
            <img src={logo} alt="BiteDash" className="nav-logo" />
          </Link>

          {/* Location Selector */}
          <div className="location-container" ref={locationRef}>
            <div
              className="location-selector"
              onClick={() => setShowLocationDropdown(!showLocationDropdown)}
              style={{
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 12px',
                borderRadius: '20px',
                background: '#f8f8f8',
                transition: 'all 0.2s',
              }}
              title="Click to change delivery location"
            >
              <MapPin size={16} color="#d92662" />
              <div
                style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <span
                  className="delivering-label"
                  style={{ fontSize: '12px', color: '#161e2e', opacity: 0.7 }}
                >
                  Delivering to:
                </span>
                <span
                  className="address-display"
                  style={{
                    fontSize: '13px',
                    color: '#161e2e',
                    fontWeight: '600',
                    whiteSpace: 'nowrap',
                    maxWidth: '180px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {loading
                    ? 'Locating...'
                    : location?.address || 'Set Location'}
                </span>
              </div>
              <ChevronDown
                size={14}
                color="#d92662"
                className={showLocationDropdown ? 'rotate-180' : ''}
              />
            </div>

            {showLocationDropdown && (
              <div className="location-dropdown card shadow-premium">
                <div className="dropdown-header">
                  <h3>Select Location</h3>
                  <p>Choose your delivery area</p>
                </div>

                <div className="location-actions">
                  <button
                    className="btn-detect"
                    onClick={() => {
                      detectLocation();
                      setShowLocationDropdown(false);
                    }}
                    disabled={loading}
                  >
                    <Navigation size={16} />
                    {loading ? 'Detecting...' : 'Detect Current Location'}
                  </button>

                  <button
                    className="btn-detect"
                    style={{
                      background: '#f5f5f5',
                      color: '#161e2e',
                      marginTop: '10px',
                      borderColor: '#eee',
                    }}
                    onClick={() => {
                      setShowMapPicker(true);
                      setShowLocationDropdown(false);
                    }}
                  >
                    <MapPin size={16} color="#d92662" />
                    Select on Map
                  </button>

                  <div className="divider">
                    <span>OR</span>
                  </div>

                  <form
                    className="manual-entry"
                    onSubmit={(e) => {
                      e.preventDefault();
                      const val = e.target.manualAddress.value;
                      if (val.trim()) {
                        updateLocation({
                          address: val,
                          latitude: null,
                          longitude: null,
                          isFallback: false,
                        });
                        setShowLocationDropdown(false);
                        toast.success('Address updated!');
                      }
                    }}
                  >
                    <div className="input-with-icon">
                      <Search size={16} />
                      <input
                        type="text"
                        name="manualAddress"
                        placeholder="Enter area or building..."
                        defaultValue={location?.address || ''}
                      />
                    </div>
                    <button type="submit" className="btn-manual-save">
                      Update Address
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>

        <button
          className="mobile-menu-btn"
          onClick={() => setShowMobileMenu(!showMobileMenu)}
        >
          <Menu size={24} />
        </button>

        <div className={`nav-links ${showMobileMenu ? 'active' : ''}`}>
          <Link
            to="/restaurants"
            className="nav-item"
            onClick={() => setShowMobileMenu(false)}
          >
            Browse
          </Link>
          <Link
            to="/about"
            className="nav-item"
            onClick={() => setShowMobileMenu(false)}
          >
            About
          </Link>
          <Link
            to="/become-partner"
            className="nav-item"
            onClick={() => setShowMobileMenu(false)}
          >
            Partner
          </Link>

          {user ? (
            <div className="user-dropdown-container">
              <button
                className="user-profile-trigger"
                onClick={() => setShowDropdown(!showDropdown)}
              >
                <div className="avatar-circle">{user.name.charAt(0)}</div>
                <span className="user-name">{user.name}</span>
                <ChevronDown
                  size={16}
                  className={showDropdown ? 'rotate-180' : ''}
                />
              </button>

              {showDropdown && (
                <div className="nav-dropdown card">
                  <Link
                    to="/profile"
                    className="dropdown-item"
                    onClick={() => setShowDropdown(false)}
                  >
                    <UserIcon size={18} /> Profile Settings
                  </Link>
                  {user.role === 'customer' && (
                    <Link
                      to="/dashboard/customer"
                      className="dropdown-item"
                      onClick={() => setShowDropdown(false)}
                    >
                      <Package size={18} /> My Dashboard
                    </Link>
                  )}
                  {user.role === 'rider' && (
                    <Link
                      to="/dashboard/rider"
                      className="dropdown-item"
                      onClick={() => setShowDropdown(false)}
                    >
                      <Package size={18} /> Rider Dashboard
                    </Link>
                  )}
                  {user.role === 'admin' && (
                    <Link
                      to="/dashboard/admin"
                      className="dropdown-item"
                      onClick={() => setShowDropdown(false)}
                    >
                      <Settings size={18} /> Admin Panel
                    </Link>
                  )}
                  {user.role === 'restaurant' && (
                    <Link
                      to="/dashboard/restaurant"
                      className="dropdown-item"
                      onClick={() => setShowDropdown(false)}
                    >
                      <Settings size={18} /> Partner Dashboard
                    </Link>
                  )}
                  <div className="dropdown-divider"></div>
                  <button
                    onClick={handleLogout}
                    className="logout-dropdown-btn"
                  >
                    <LogOut size={18} /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="auth-btns">
              <Link to="/login" className="btn-outline-small">
                Login
              </Link>
              <Link to="/register" className="btn-primary-small">
                Sign Up
              </Link>
            </div>
          )}

          {user && (
            <div className="notification-container" ref={notifRef}>
              <button
                className="notification-trigger"
                onClick={() => setShowNotifications(!showNotifications)}
                style={{
                  position: 'relative',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  marginRight: '15px',
                }}
              >
                <Bell size={24} color="#555" />
                {unreadCount > 0 && (
                  <span className="notification-badge">{unreadCount}</span>
                )}
              </button>

              {showNotifications && (
                <div
                  className="notification-panel card"
                  style={{
                    position: 'fixed',
                    top: '90px',
                    right: '20px',
                    width: '360px',
                    backgroundColor: 'white',
                    borderRadius: '12px',
                    boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
                    zIndex: 2000,
                    overflow: 'hidden',
                    border: '1px solid #eee',
                    maxHeight: 'calc(100vh - 120px)',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <div
                    className="panel-header"
                    style={{
                      padding: '16px',
                      borderBottom: '1px solid #eee',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <h3 style={{ margin: 0, fontSize: '1rem' }}>
                      Notifications
                    </h3>
                    <button
                      onClick={markAllAsRead}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#d92662',
                        fontSize: '0.8rem',
                        cursor: 'pointer',
                        fontWeight: 600,
                      }}
                    >
                      Mark all read
                    </button>
                  </div>
                  <div
                    className="panel-body"
                    style={{ maxHeight: '320px', overflowY: 'auto', flex: 1 }}
                  >
                    {notifications.length === 0 ? (
                      <div
                        style={{
                          padding: '20px',
                          textAlign: 'center',
                          color: '#999',
                        }}
                      >
                        No notifications
                      </div>
                    ) : (
                      notifications.map((n) => (
                        <div
                          key={n.id}
                          className={`notification-item ${
                            n.read ? 'read' : 'unread'
                          }`}
                          style={{
                            padding: '12px 16px',
                            borderBottom: '1px solid #f9f9f9',
                            background: n.read ? 'white' : '#fff0f3',
                            cursor: 'pointer',
                          }}
                          onClick={() => markAsRead(n.id)}
                        >
                          <div
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              marginBottom: '4px',
                            }}
                          >
                            <span
                              style={{
                                fontWeight: 600,
                                fontSize: '0.9rem',
                                color: '#333',
                              }}
                            >
                              {n.title}
                            </span>
                            <span
                              style={{ fontSize: '0.75rem', color: '#999' }}
                            >
                              {n.time}
                            </span>
                          </div>
                          <p
                            style={{
                              margin: 0,
                              fontSize: '0.85rem',
                              color: '#666',
                              lineHeight: 1.4,
                            }}
                          >
                            {n.message}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {user && (
            <Link to="/cart" className="cart-icon">
              <ShoppingCart size={24} />
              {totalCount > 0 && (
                <span className="cart-count">{totalCount}</span>
              )}
            </Link>
          )}
        </div>
      </div>
      <LocationPickerModal
        isOpen={showMapPicker}
        onClose={() => setShowMapPicker(false)}
      />
    </nav>
  );
};

export default Navbar;
