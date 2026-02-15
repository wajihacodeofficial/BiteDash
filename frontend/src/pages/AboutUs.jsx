import React from 'react';
import { motion } from 'framer-motion';
import {
  MapPin,
  Mail,
  Phone,
  Users,
  Award,
  Coffee,
  ArrowRight,
} from 'lucide-react';
import './AboutUs.css';

const AboutUs = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <div className="about-container">
      {/* Hero Section */}
      <section className="about-hero">
        <motion.div
          className="hero-content-inner"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        >
          <h1>Delivering Joy.</h1>
          <p>Karachi's premier culinary delivery experience since 2024.</p>
        </motion.div>
      </section>

      <div className="container">
        {/* Stats Section */}
        <motion.section
          className="stats-grid"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {[
            { label: 'Orders Delivered', value: '500k+' },
            { label: 'Active Restaurants', value: '50+' },
            { label: 'Riders Fleet', value: '250+' },
            { label: 'Karachi Areas', value: '20+' },
          ].map((stat, i) => (
            <motion.div
              key={i}
              className="stat-card card shadow-premium"
              variants={itemVariants}
            >
              <h3>{stat.value}</h3>
              <p>{stat.label}</p>
            </motion.div>
          ))}
        </motion.section>

        {/* Mission Section */}
        <section className="mission-section">
          <motion.div
            className="mission-image"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <img
              src="https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=800&q=60"
              alt="BiteDash Culture"
            />
          </motion.div>
          <motion.div
            className="mission-text"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span
              className="badge-premium"
              style={{
                color: 'var(--primary)',
                fontWeight: 'bold',
                textTransform: 'uppercase',
                letterSpacing: '2px',
                fontSize: '14px',
                marginBottom: '16px',
                display: 'block',
              }}
            >
              Our Mission
            </span>
            <h2>Connecting every kitchen to every Karachi home.</h2>
            <p>
              BiteDash isn't just about delivery; it's about bridging the gap
              between Karachi's vibrant culinary heritage and the fast-paced
              modern life of its citizens.
            </p>
            <p>
              We empower local businesses to reach new heights while providing
              our customers with a premium, reliable, and cinematic experience
              from tap to table.
            </p>
          </motion.div>
        </section>

        {/* Values Grid */}
        <section className="values-section">
          <motion.h2
            className="section-title text-center"
            style={{
              textAlign: 'center',
              fontSize: '3rem',
              marginBottom: '60px',
            }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
          >
            The Values That Drive Us
          </motion.h2>
          <div className="values-grid">
            <motion.div
              className="value-card customer"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="icon-box">
                <Users size={32} color="#d92662" />
              </div>
              <h3>Customer Obsession</h3>
              <p>
                We start with the customer and work backwards to ensure every
                bite is perfect.
              </p>
            </motion.div>
            <motion.div
              className="value-card quality"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <div className="icon-box">
                <Award size={32} color="#f1c40f" />
              </div>
              <h3>Unmatched Quality</h3>
              <p>
                From restaurant selection to delivery speed, quality is our
                north star.
              </p>
            </motion.div>
            <motion.div
              className="value-card community"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <div className="icon-box">
                <Coffee size={32} color="#2ecc71" />
              </div>
              <h3>Empowered Community</h3>
              <p>
                We grow only when our partner restaurants and riders grow with
                us.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Contact Banner */}
        <motion.section
          className="about-contact-banner shadow-premium"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="banner-text">
            <h2>
              Experience the{' '}
              <span style={{ color: 'var(--primary)' }}>RapidWave</span>{' '}
              standard.
            </h2>
            <p
              style={{ opacity: 0.8, fontSize: '1.2rem', marginBottom: '30px' }}
            >
              Whether you're a restaurant looking to partner or a food lover
              with questions, we're here for you 24/7.
            </p>
            <button className="btn-primary" style={{ padding: '16px 32px' }}>
              Contact Support{' '}
              <ArrowRight size={20} style={{ marginLeft: '10px' }} />
            </button>
          </div>
          <div className="contact-info-grid">
            <div className="contact-pill">
              <div className="pill-icon">
                <MapPin size={24} />
              </div>
              <div className="pill-text">
                <h4>Karachi HQ</h4>
                <p>Clifton Block 5, Marine Drive</p>
              </div>
            </div>
            <div className="contact-pill">
              <div className="pill-icon">
                <Mail size={24} />
              </div>
              <div className="pill-text">
                <h4>Email Hub</h4>
                <p>hello@bitedash.com</p>
              </div>
            </div>
            <div className="contact-pill">
              <div className="pill-icon">
                <Phone size={24} />
              </div>
              <div className="pill-text">
                <h4>Hotline</h4>
                <p>UAN: 111-BITE-KARACHI</p>
              </div>
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  );
};

export default AboutUs;
