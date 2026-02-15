import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLocation } from '../context/LocationContext';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="container hero-content">
          <motion.div
            className="hero-text"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <h1>
              Hungry? <br />
              <span>Fast Delivery from Top Restaurants</span>
            </h1>
            <p className="hero-subtitle">
              Experience the finest restaurants in Karachi delivered straight to
              your doorstep. Fast, fresh, and premium.
            </p>

            <div className="hero-cta-group">
              <button
                className="btn-primary btn-order-now"
                onClick={() => navigate('/restaurants')}
              >
                Order Now
              </button>
              <button
                className="btn-secondary btn-partner"
                onClick={() => navigate('/become-partner')}
              >
                Become a Partner <ArrowRight size={18} />
              </button>
            </div>

            {/* Social Proof */}
            <div className="social-proof">
              <div className="trust-indicators">
                <div className="indicator">
                  <Check size={18} color="#d92662" />
                  <span>50+ Premium Verified Restaurants</span>
                </div>
                <div className="indicator">
                  <Check size={18} color="#d92662" />
                  <span>Serving Clifton, DHA, Gulshan & more</span>
                </div>
                <div className="indicator">
                  <Check size={18} color="#d92662" />
                  <span>At least 30 items per menu</span>
                </div>
              </div>
            </div>
          </motion.div>
          <motion.div
            className="hero-image"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <div className="image-overlay"></div>
            <img
              src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=60"
              alt="Delicious Food"
              loading="eager"
              onError={(e) => {
                e.target.src =
                  'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=60';
              }}
            />
          </motion.div>
        </div>
      </section>

      {/* Categories */}
      <section className="categories container">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          What's on your mind?
        </motion.h2>
        <div className="category-grid">
          {[
            {
              name: 'Burgers',
              img: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?auto=format&fit=crop&w=400&q=60',
            },
            {
              name: 'Pizza',
              img: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=400&q=60',
            },
            {
              name: 'Chinese',
              img: 'https://images.unsplash.com/photo-1525755662778-989d0cf2444b?auto=format&fit=crop&w=400&q=60',
            },
            {
              name: 'Desi',
              img: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=400&q=60',
            },
            {
              name: 'Shakes',
              img: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=400&q=60',
            },
            {
              name: 'Snacks',
              img: 'https://images.unsplash.com/photo-1599487488170-d11ec9c17580?auto=format&fit=crop&w=400&q=60',
            },
          ].map((cat, index) => (
            <motion.div
              key={cat.name}
              className="category-card card"
              onClick={() => navigate(`/restaurants?category=${cat.name}`)}
              style={{ cursor: 'pointer' }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -10, transition: { duration: 0.2 } }}
            >
              <img
                src={cat.img}
                alt={cat.name}
                loading="lazy"
                onError={(e) => {
                  e.target.src =
                    'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=60';
                }}
              />
              <span>{cat.name}</span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Why BiteDash */}
      <section className="features container">
        <motion.div
          className="feature-card"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="feature-info">
            <h2>Why Choose BiteDash?</h2>
            <p>
              The most reliable delivery fleet in Karachi, offering hot and
              fresh meals from top-rated restaurants to your home.
            </p>
            <button className="btn-outline" onClick={() => navigate('/about')}>
              Learn More <ArrowRight size={18} />
            </button>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default Home;
