import React from 'react';
import './Support.css';

const Privacy = () => {
  return (
    <div className="container support-page">
      <h1>Privacy Policy</h1>
      <div className="legal-content card">
        <h3>1. Data Collection</h3>
        <p>
          We collect personal information such as name, address, and phone
          number to facilitate deliveries.
        </p>

        <h3>2. Data Usage</h3>
        <p>
          Your data is used to process orders, improve our services, and
          communicate with you.
        </p>

        <h3>3. Data Sharing</h3>
        <p>
          We share necessary details with restaurants and riders to fulfill your
          order. We do not sell your data.
        </p>

        <h3>4. Security</h3>
        <p>
          We implement industry-standard security measures to protect your
          information.
        </p>
      </div>
    </div>
  );
};

export default Privacy;
