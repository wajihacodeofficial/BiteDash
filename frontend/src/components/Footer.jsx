import { Link } from 'react-router-dom';
import {
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Mail,
  MapPin,
  Phone,
  Clock,
  Shield,
  Truck,
  CreditCard,
} from 'lucide-react';
import logo from '../assets/logo.png';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-features">
        <div className="container features-grid">
          <div className="feature-item">
            <Shield size={24} />
            <h4>Secure Payments</h4>
            <p>100% secure payment methods</p>
          </div>
          <div className="feature-item">
            <Truck size={24} />
            <h4>Fast Delivery</h4>
            <p>Average 25-35 min delivery</p>
          </div>
          <div className="feature-item">
            <CreditCard size={24} />
            <h4>Multiple Payment Options</h4>
            <p>Cash, Card, Mobile Wallet</p>
          </div>
          <div className="feature-item">
            <Clock size={24} />
            <h4>Real-time Tracking</h4>
            <p>Track your order live</p>
          </div>
        </div>
      </div>
      <div className="container footer-grid">
        <div className="footer-brand">
          <img src={logo} alt="BiteDash" className="footer-logo" />
          <p className="footer-tagline">
            Experience the finest culinary delights from Karachi's top
            restaurants, delivered fresh and fast to your doorstep.
          </p>
          <div className="social-links">
            <a href="#" aria-label="Facebook">
              <Facebook size={20} />
            </a>
            <a href="#" aria-label="Twitter">
              <Twitter size={20} />
            </a>
            <a href="#" aria-label="Instagram">
              <Instagram size={20} />
            </a>
            <a href="#" aria-label="YouTube">
              <Youtube size={20} />
            </a>
          </div>
          <div className="app-download">
            <h4>Download our app</h4>
            <div className="app-buttons">
              <a href="#" className="app-store-btn">
                <img
                  src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg"
                  alt="Download on App Store"
                />
              </a>
              <a href="#" className="play-store-btn">
                <img
                  src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png"
                  alt="Get it on Google Play"
                />
              </a>
            </div>
          </div>
        </div>

        <div className="footer-links-group">
          <h3>Quick Links</h3>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/about">About Us</Link>
            </li>
            <li>
              <Link to="/restaurants">Browse Restaurants</Link>
            </li>
            <li>
              <Link to="/become-partner">Become a Partner</Link>
            </li>
          </ul>
        </div>

        <div className="footer-links-group">
          <h3>Support</h3>
          <ul>
            <li>
              <Link to="/help">Help Center</Link>
            </li>
            <li>
              <Link to="/faq">FAQs</Link>
            </li>
            <li>
              <Link to="/terms">Terms of Service</Link>
            </li>
            <li>
              <Link to="/privacy">Privacy Policy</Link>
            </li>
            <li>
              <Link to="/cookies">Privacy Settings</Link>
            </li>
          </ul>
        </div>

        <div className="footer-contact">
          <h3>Contact Us</h3>
          <div className="contact-item">
            <MapPin size={18} />
            <span>Defence View Phase 2, Karachi</span>
          </div>
          <div className="contact-item">
            <Phone size={18} />
            <span>+92 300 1234567</span>
          </div>
          <div className="contact-item">
            <Mail size={18} />
            <span>support@bitedash.com</span>
          </div>
          <div className="contact-item">
            <Clock size={18} />
            <span>24/7 Customer Support</span>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container divider"></div>
        <div className="footer-bottom-content">
          <p>
            &copy; {new Date().getFullYear()} BiteDash. All rights reserved.
            Providing the best food delivery service exclusively in Karachi.
          </p>
          <div className="developer-banner">
            Developed by <span className="dev-name">RapidWave Software</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
