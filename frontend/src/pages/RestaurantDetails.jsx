import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Plus,
  Minus,
  ShoppingBag,
  ArrowLeft,
  Star,
  MapPin,
} from 'lucide-react';
import api, { restaurantApi } from '../api';
import { useCart } from '../context/CartContext';
import './RestaurantDetails.css';
import { toast } from 'react-hot-toast';

const RestaurantDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    subtotal,
    clearCart,
  } = useCart();

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        setLoading(true);
        // Use restaurantApi wrapper if available or direct api call
        const res = await api.get(`/restaurants/${id}`);
        setRestaurant(res.data);
      } catch (err) {
        console.error('Failed to fetch restaurant', err);
        setError('Restaurant not found or currently unavailable.');
      } finally {
        setLoading(false);
      }
    };
    fetchRestaurant();
  }, [id]);

  const getCartItemQuantity = (itemId) => {
    const item = cartItems.find((i) => i.id === itemId);
    return item ? item.quantity : 0;
  };

  const handleAddItem = (item) => {
    // Check if cart has items from another restaurant
    if (cartItems.length > 0 && cartItems[0].restaurantId !== restaurant._id) {
      clearCart();
      toast.success(
        'Your cart has been cleared to allow adding items from ' +
          restaurant.name
      );
    }
    addToCart(item, restaurant._id, restaurant.name);
  };

  if (loading) {
    return (
      <div className="restaurant-details loading-skeleton">
        <div className="res-hero skeleton"></div>
        <div className="container main-content">
          <div className="menu-section">
            <div
              className="skeleton skeleton-title"
              style={{ width: '200px', height: '32px', marginBottom: '24px' }}
            ></div>
            <div className="menu-list">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="menu-card card">
                  <div className="item-image skeleton"></div>
                  <div className="item-info">
                    <div
                      className="skeleton skeleton-title"
                      style={{ width: '150px' }}
                    ></div>
                    <div className="skeleton skeleton-text"></div>
                    <div
                      className="skeleton skeleton-price"
                      style={{ width: '80px' }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="cart-sidebar">
            <div className="cart-card card">
              <div
                className="skeleton skeleton-title"
                style={{ width: '100px', margin: '0 auto 20px' }}
              ></div>
              <div className="skeleton skeleton-text"></div>
              <div
                className="skeleton skeleton-button"
                style={{ height: '48px', marginTop: '20px' }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !restaurant) {
    return (
      <div
        className="container error-state"
        style={{ padding: '100px', textAlign: 'center' }}
      >
        <h2>unavailable</h2>
        <p>{error || 'Restaurant not found.'}</p>
        <button
          className="btn-primary"
          onClick={() => navigate('/restaurants')}
        >
          Back to Restaurants
        </button>
      </div>
    );
  }

  return (
    <div className="restaurant-details">
      <div className="res-hero">
        <img
          src={`${restaurant.image}${restaurant.image.includes('?') ? '&' : '?'}auto=format&fit=crop&w=1200&q=70`}
          alt={restaurant.name}
          loading="eager"
          onError={(e) => {
            e.target.src =
              'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=70';
          }}
        />
        <div className="res-hero-overlay">
          <div className="container">
            <button
              className="back-btn-overlay"
              onClick={() => navigate(-1)}
              style={{
                background: 'rgba(255,255,255,0.2)',
                border: 'none',
                color: 'white',
                padding: '10px',
                borderRadius: '50%',
                cursor: 'pointer',
                marginBottom: '20px',
                display: 'inline-flex',
              }}
            >
              <ArrowLeft size={24} />
            </button>
            <h1>{restaurant.name}</h1>
            <p className="res-meta">
              <span>
                {Array.isArray(restaurant.cuisine)
                  ? restaurant.cuisine.join(' • ')
                  : restaurant.cuisine || 'Cuisine'}
              </span>
              <span className="dot">•</span>
              <div
                className="rating-pill"
                style={{
                  background: 'white',
                  color: 'black',
                  padding: '2px 8px',
                  borderRadius: '12px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '0.9rem',
                }}
              >
                <Star size={12} fill="orange" color="orange" />{' '}
                {restaurant.rating || 4.5}
              </div>
              <span className="dot">•</span>
              <span>{restaurant.location?.address || 'Karachi'}</span>
            </p>
          </div>
        </div>
      </div>

      <div className="container main-content">
        <div className="menu-section">
          <h2>Menu</h2>
          <div className="menu-list">
            {Array.isArray(restaurant.menu) && restaurant.menu.length > 0 ? (
              restaurant.menu.map((item) => {
                const qty = getCartItemQuantity(item._id);
                return (
                  <div key={item._id} className="menu-card card">
                    {item.image && (
                      <div className="item-image">
                        <img
                          src={`${item.image}${item.image.includes('?') ? '&' : '?'}auto=format&fit=crop&w=300&q=60`}
                          alt={item.name}
                          loading="lazy"
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      </div>
                    )}
                    <div className="item-info">
                      <h3>{item.name}</h3>
                      <p>{item.description}</p>
                      <span className="price">Rs. {item.price}</span>
                    </div>
                    <div className="item-actions">
                      {qty > 0 ? (
                        <div
                          className="qty-controls-small"
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            background: '#f8f9fa',
                            padding: '5px',
                            borderRadius: '20px',
                          }}
                        >
                          <button
                            onClick={() => updateQuantity(item._id, -1)}
                            style={{
                              border: 'none',
                              background: 'none',
                              cursor: 'pointer',
                              color: '#d92662',
                            }}
                          >
                            <Minus size={16} />
                          </button>
                          <span style={{ fontWeight: 'bold' }}>{qty}</span>
                          <button
                            onClick={() => updateQuantity(item._id, 1)}
                            style={{
                              border: 'none',
                              background: 'none',
                              cursor: 'pointer',
                              color: '#d92662',
                            }}
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                      ) : (
                        <button
                          className="add-btn"
                          onClick={() => handleAddItem(item)}
                        >
                          <Plus size={20} />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <div
                className="empty-menu"
                style={{ textAlign: 'center', padding: '40px' }}
              >
                <p>No menu items available for this restaurant.</p>
              </div>
            )}
          </div>
        </div>

        <div className="cart-sidebar">
          <div
            className="cart-card card"
            style={{ position: 'sticky', top: '100px' }}
          >
            <h3>Your Order</h3>
            {cartItems.length === 0 ? (
              <div className="empty-cart">
                <ShoppingBag size={48} color="#ddd" />
                <p>
                  Good food is always cooking! Go ahead, order some yummy items
                  from the menu.
                </p>
              </div>
            ) : (
              <div className="cart-items-list">
                <div
                  className="restaurant-name-cart"
                  style={{
                    fontSize: '0.9rem',
                    marginBottom: '10px',
                    color: '#888',
                  }}
                >
                  From <strong>{cartItems[0].restaurantName}</strong>
                </div>
                {cartItems.map((item) => (
                  <div key={item.id} className="cart-item-mini">
                    <div className="item-details">
                      <div className="qty-small">{item.quantity}x</div>
                      <span className="name">{item.name}</span>
                    </div>
                    <span className="price">
                      Rs. {item.price * item.quantity}
                    </span>
                  </div>
                ))}
                <div className="cart-total-mini">
                  <span>Subtotal</span>
                  <span>Rs. {subtotal}</span>
                </div>
              </div>
            )}
            <button
              className="btn-primary checkout-btn"
              disabled={cartItems.length === 0}
              onClick={() => navigate('/cart')}
            >
              Go to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantDetails;
