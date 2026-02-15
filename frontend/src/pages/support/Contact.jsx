import { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import './Support.css';
import { toast } from 'react-hot-toast';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success(
      'Thank you for contacting us! We will get back to you shortly.'
    );
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="support-page">
      <div className="support-header">
        <div className="container">
          <h1>Contact Us</h1>
          <p>We're here to help and answer any question you might have</p>
        </div>
      </div>

      <div className="container support-content">
        <div className="contact-grid">
          <div className="contact-info-card card">
            <h2>Get in Touch</h2>
            <div className="info-item">
              <div className="icon-box">
                <Phone size={24} />
              </div>
              <div>
                <h3>Phone</h3>
                <p>+92 300 1234567</p>
                <p>Mon-Sat 9am to 6pm</p>
              </div>
            </div>
            <div className="info-item">
              <div className="icon-box">
                <Mail size={24} />
              </div>
              <div>
                <h3>Email</h3>
                <p>support@bitedash.com</p>
                <p>Online support 24/7</p>
              </div>
            </div>
            <div className="info-item">
              <div className="icon-box">
                <MapPin size={24} />
              </div>
              <div>
                <h3>Office</h3>
                <p>Defence View Phase 2</p>
                <p>Karachi, Pakistan</p>
              </div>
            </div>
          </div>

          <div className="contact-form-card card">
            <h2>Send us a Message</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  placeholder="John Doe"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>
              <div className="form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  placeholder="john@example.com"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>
              <div className="form-group">
                <label>Subject</label>
                <select
                  value={formData.subject}
                  onChange={(e) =>
                    setFormData({ ...formData, subject: e.target.value })
                  }
                >
                  <option value="">Select a topic</option>
                  <option value="order">Order Issue</option>
                  <option value="payment">Payment Problem</option>
                  <option value="account">Account Support</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="form-group">
                <label>Message</label>
                <textarea
                  rows="5"
                  placeholder="How can we help you?"
                  required
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                ></textarea>
              </div>
              <button
                type="submit"
                className="btn-primary"
                style={{ width: '100%' }}
              >
                <Send size={18} style={{ marginRight: '8px' }} /> Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
