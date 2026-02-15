import React from 'react';
import { Link } from 'react-router-dom';
import { Bike, Utensils, ShieldCheck } from 'lucide-react';
import './Partner.css';

const BecomePartner = () => {
  return (
    <div className="partner-page">
      <div className="res-hero partner-hero">
        <div className="container">
          <h1>Grow with BiteDash</h1>
          <p>Join Karachi's fastest growing delivery network</p>
        </div>
      </div>

      <div className="container main-content">
        <div className="partner-grid">
          <div className="partner-card card">
            <Bike size={48} className="icon" />
            <h2>Be a Rider</h2>
            <p>
              Earn per delivery, choose your own hours, and enjoy premium badges
              & progress rewards.
            </p>
            <Link to="/register?role=rider" className="btn-primary">
              Sign Up as Rider
            </Link>
          </div>

          <div className="partner-card card">
            <Utensils size={48} className="icon" />
            <h2>Be a Restaurant Partner</h2>
            <p>
              Reach thousands of new customers in Karachi. We handle the
              logistics, you cook the food.
            </p>
            <Link to="/register?role=rider" className="btn-primary">
              Partner with Us
            </Link>
          </div>
        </div>

        <div className="trust-section card">
          <ShieldCheck size={32} />
          <div>
            <h3>Enterprise Verified</h3>
            <p>
              Every partner on BiteDash undergoes a strict verification process
              to ensure the highest standards of safety and quality for
              Karachiites.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BecomePartner;
