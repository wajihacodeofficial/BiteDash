import React from 'react';
import './Support.css';

const CookiePolicy = () => {
  return (
    <div className="support-page container">
      <div className="card legal-content">
        <h1 className="text-center">Cookie Policy</h1>
        <p className="text-center mb-5">Last Updated: December 2025</p>

        <section>
          <p>
            This Cookie Policy explains how BiteDash ("we", "us", and "our")
            uses cookies and similar technologies to recognize you when you
            visit our website at bitedash.com ("Website"). It explains what
            these technologies are and why we use them, as well as your rights
            to control our use of them.
          </p>
        </section>

        <section>
          <h3>What are cookies?</h3>
          <p>
            Cookies are small data files that are placed on your computer or
            mobile device when you visit a website. Cookies are widely used by
            website owners in order to make their websites work, or to work more
            efficiently, as well as to provide reporting information.
          </p>
        </section>

        <section>
          <h3>Why do we use cookies?</h3>
          <p>
            We use first- and third-party cookies for several reasons. Some
            cookies are required for technical reasons in order for our Website
            to operate, and we refer to these as "essential" or "strictly
            necessary" cookies. Other cookies also enable us to track and target
            the interests of our users to enhance the experience on our Online
            Properties. Third parties serve cookies through our Website for
            advertising, analytics and other purposes.
          </p>
        </section>

        <section>
          <h3>Types of Cookies We Use</h3>
          <ul>
            <li>
              <strong>Essential Cookies:</strong> These cookies are strictly
              necessary to provide you with services available through our
              Website and to use some of its features, such as access to secure
              areas.
            </li>
            <li>
              <strong>Performance and Functionality Cookies:</strong> These
              cookies are used to enhance the performance and functionality of
              our Website but are non-essential to their use. However, without
              these cookies, certain functionality (like videos) may become
              unavailable.
            </li>
            <li>
              <strong>Analytics and Customization Cookies:</strong> These
              cookies collect information that is used either in aggregate form
              to help us understand how our Website is being used or how
              effective our marketing campaigns are, or to help us customize our
              Website for you.
            </li>
            <li>
              <strong>Advertising Cookies:</strong> These cookies are used to
              make advertising messages more relevant to you. They perform
              functions like preventing the same ad from continuously
              reappearing, ensuring that ads are properly displayed for
              advertisers, and in some cases selecting advertisements that are
              based on your interests.
            </li>
          </ul>
        </section>

        <section>
          <h3>How can you control cookies?</h3>
          <p>
            You have the right to decide whether to accept or reject cookies.
            You can exercise your cookie rights by setting your preferences in
            the Cookie Consent Manager. The Cookie Consent Manager allows you to
            select which categories of cookies you accept or reject. Essential
            cookies cannot be rejected as they are strictly necessary to provide
            you with services.
          </p>
        </section>

        <section>
          <h3>Updates to this Policy</h3>
          <p>
            We may update this Cookie Policy from time to time in order to
            reflect, for example, changes to the cookies we use or for other
            operational, legal or regulatory reasons. Please therefore re-visit
            this Cookie Policy regularly to stay informed about our use of
            cookies and related technologies.
          </p>
        </section>

        <div className="contact-box success-message">
          <h3>Have questions?</h3>
          <p>
            If you have any questions about our use of cookies or other
            technologies, please email us at{' '}
            <a href="mailto:privacy@bitedash.com">privacy@bitedash.com</a>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CookiePolicy;
