import React, { useState } from 'react';
import { Send, MessageCircle } from 'lucide-react';
import './Support.css';

const HelpCenter = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate API call
    console.log('Support request:', formData);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 3000);
  };

  return (
    <div className="container support-page">
      <h1>Help Center</h1>
      <p className="text-center mb-5">How can we help you today, Karachi?</p>

      <div className="help-grid">
        <div className="help-card card">
          <h3>I have an issue with my order</h3>
          <p>
            Missing items, wrong order, or quality issues? Let us know
            immediately.
          </p>
        </div>
        <div className="help-card card">
          <h3>Payment & Refunds</h3>
          <p>Questions about charges, refunds, or payment methods.</p>
        </div>
        <div className="help-card card">
          <h3>Account & App Issues</h3>
          <p>Login trouble, profile updates, or app performance.</p>
        </div>
        <div className="help-card card">
          <h3>BiteDash for Business</h3>
          <p>Partner with us or set up a corporate account.</p>
        </div>
      </div>

      <div className="contact-section">
        <div className="contact-form-card card">
          <div className="form-header">
            <MessageCircle size={32} className="icon-primary" />
            <h2>Contact Support</h2>
            <p>Can't find what you're looking for? Send us a message.</p>
          </div>

          {submitted ? (
            <div className="success-message">
              <h3>Message Sent!</h3>
              <p>Our support team will get back to you within 24 hours.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>Your Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Enter your name"
                  />
                </div>
                <div className="form-group">
                  <label>Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Subject</label>
                <select
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select a topic</option>
                  <option value="Order Issue">Order Issue</option>
                  <option value="Payment">Payment & Billing</option>
                  <option value="Account">Account Settings</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label>Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  placeholder="Describe your issue in detail..."
                  rows="5"
                ></textarea>
              </div>

              <button type="submit" className="btn-primary w-100">
                Send Message <Send size={18} style={{ marginLeft: '8px' }} />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default HelpCenter;
