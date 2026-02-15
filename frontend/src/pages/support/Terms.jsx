import React from 'react';
import './Support.css';

const Terms = () => {
  return (
    <div className="container support-page">
      <h1>Terms of Service</h1>
      <div className="legal-content card">
        <h3>1. Introduction</h3>
        <p>
          Welcome to BiteDash. By using our website and services, you agree to
          these terms.
        </p>

        <h3>2. Service Availability</h3>
        <p>
          BiteDash currently operates exclusively in Karachi. Delivery zones are
          subject to change.
        </p>

        <h3>3. User Accounts</h3>
        <p>
          You are responsible for maintaining the confidentiality of your
          account and password.
        </p>

        <h3>4. Orders and Payments</h3>
        <p>
          All orders are subject to availability. Prices may change without
          notice. We accept cash on delivery and online payments.
        </p>
      </div>
    </div>
  );
};

export default Terms;
