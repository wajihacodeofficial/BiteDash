import React from 'react';
import './Partner.css';

const FAQ = () => {
  const faqs = [
    {
      q: 'How do I track my order?',
      a: "You can track your order in real-time through the 'Track Order' section in your dashboard.",
    },
    {
      q: 'What is the delivery fee?',
      a: 'Our base delivery fee in Karachi is Rs. 150. This may vary based on distance.',
    },
    {
      q: 'Can I cancel my order?',
      a: "Orders can only be cancelled before they enter the 'Preparing' stage.",
    },
    {
      q: 'How can I become a rider?',
      a: "Go to the 'Become a Partner' page and signup as a Rider. Our team will contact you for verification.",
    },
  ];

  return (
    <div className="container support-page">
      <h1>Frequently Asked Questions</h1>
      <div className="faq-list">
        {faqs.map((faq, i) => (
          <div key={i} className="faq-item card">
            <h3>{faq.q}</h3>
            <p>{faq.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQ;
