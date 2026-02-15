import { useState } from 'react';
import { Trash2, Plus, Minus, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import api from '../api';
import './Cart.css';

const Cart = () => {
  const { cartItems, updateQuantity, removeFromCart, subtotal, clearCart } =
    useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { addNotification } = useNotification();
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  if (cartItems.length === 0) {
    return (
      <div className="container empty-cart-page">
        <img
          src="https://images.unsplash.com/photo-1549465220-1d8c9d9c674a?auto=format&fit=crop&w=400&q=80"
          alt="Empty Cart"
          onError={(e) => {
            e.target.src =
              'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80';
          }}
        />
        <h1>Your cart is empty</h1>
        <p>Looks like you haven't added anything to your cart yet.</p>
        <Link to="/restaurants" className="btn-primary">
          Browse Restaurants
        </Link>
      </div>
    );
  }

  const handleCheckout = async () => {
    if (!user) {
      addNotification('Login Required', 'Please login to place an order');
      navigate('/login');
      return;
    }

    if (cartItems.length === 0) return;

    setIsCheckingOut(true);
    try {
      // Assuming all items are from same restaurant for now as we enforce it in RestaurantDetails
      const restaurantId = cartItems[0].restaurantId;

      const orderData = {
        restaurant: restaurantId,
        items: cartItems.map((item) => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price,
        })),
        totalAmount: subtotal + 50,
        deliveryAddress: user.address || 'Defence View Society, Karachi',
        paymentMethod: paymentMethod,
      };

      await api.post('/orders', orderData);

      addNotification(
        'Order Placed',
        `Your order has been placed successfully using ${paymentMethod.toUpperCase()}!`
      );
      clearCart();
      navigate('/dashboard/customer?tab=orders');
    } catch (err) {
      console.error('Order placement failed:', err);
      addNotification(
        'Order Failed',
        err.response?.data?.message ||
          'Could not place order. Please try again.'
      );
    } finally {
      setIsCheckingOut(false);
    }
  };

  return (
    <div className="cart-page container">
      <div className="cart-header">
        <Link to="/restaurants" className="back-link">
          <ArrowLeft size={20} /> Back to Shopping
        </Link>
        <h1>Your Shopping Cart</h1>
      </div>

      <div className="cart-content">
        <div className="cart-items-section">
          {cartItems.map((item) => (
            <div key={item.id} className="cart-item-card card">
              <div className="item-info">
                <h3>{item.name}</h3>
                <p>From {item.restaurantName}</p>
              </div>
              <div className="item-actions">
                <div className="quantity-controls">
                  <button onClick={() => updateQuantity(item.id, -1)}>
                    <Minus size={16} />
                  </button>
                  <span>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, 1)}>
                    <Plus size={16} />
                  </button>
                </div>
                <span className="item-price">
                  Rs. {item.price * item.quantity}
                </span>
                <button
                  className="remove-btn"
                  onClick={() => removeFromCart(item.id)}
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="order-summary-section">
          <div className="summary-card card">
            <h3>Order Summary</h3>
            <div className="summary-row">
              <span>Subtotal</span>
              <span>Rs. {subtotal}</span>
            </div>
            <div className="summary-row">
              <span>Delivery Fee</span>
              <span>Rs. 50</span>
            </div>
            <div className="summary-row total">
              <span>Total</span>
              <span>Rs. {subtotal + 50}</span>
            </div>

            <div
              className="payment-method-selection"
              style={{ margin: '20px 0' }}
            >
              <h4 style={{ marginBottom: '10px' }}>Payment Method</h4>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                }}
              >
                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    cursor: 'pointer',
                  }}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={paymentMethod === 'cod'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  Cash on Delivery
                </label>
                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    cursor: 'pointer',
                  }}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="card"
                    checked={paymentMethod === 'card'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  Credit/Debit Card
                </label>
              </div>
            </div>

            <button
              className="btn-primary checkout-large"
              onClick={handleCheckout}
              disabled={isCheckingOut}
            >
              {isCheckingOut
                ? 'Processing...'
                : user
                ? 'Place Order'
                : 'Login to Order'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
