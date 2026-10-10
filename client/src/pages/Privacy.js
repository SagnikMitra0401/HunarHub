import React from "react";
import { Link } from "react-router-dom";

export default function Privacy() {
  return (
    <div className="container my-5" style={{ maxWidth: 840 }}>
      <div className="card shadow-sm p-4 p-md-5">
        <h1 className="h2 mb-3 fw-bold">Privacy Policy</h1>
        <p className="text-muted small mb-4">Last Updated: October 2026</p>

        <section className="mb-4">
          <h5 className="fw-bold">1. Information We Collect</h5>
          <p>
            HunarHub collects only the essential data needed to facilitate local micro-business discovery
            and service fulfillment:
          </p>
          <ul>
            <li><strong>Account Details:</strong> Name, email address, password hash, and user role.</li>
            <li><strong>Entrepreneur Profiles:</strong> Skill category, biography, service location, and representative price range.</li>
            <li><strong>Transactions & Requests:</strong> Product order histories, custom service descriptions, request statuses, and customer ratings/reviews.</li>
          </ul>
        </section>

        <section className="mb-4">
          <h5 className="fw-bold">2. How Your Information Is Used</h5>
          <p>
            Your information is used strictly to:
          </p>
          <ul>
            <li>Enable local discovery of verified micro-entrepreneurs by skill and area.</li>
            <li>Coordinate service requests and notify entrepreneurs of incoming customer orders.</li>
            <li>Calculate aggregate platform KPIs and analytics for administrative quality control.</li>
            <li>Maintain security, rate-limiting, and dispute resolution mechanisms.</li>
          </ul>
        </section>

        <section className="mb-4">
          <h5 className="fw-bold">3. Data Security & Storage</h5>
          <p>
            We adhere to security-first practices:
          </p>
          <ul>
            <li><strong>Password Protection:</strong> All passwords are salted and hashed using bcrypt (cost factor 12). Raw passwords are never stored.</li>
            <li><strong>Token Security:</strong> Session management utilizes signed JWT tokens.</li>
            <li><strong>Infrastructure:</strong> Data is hosted securely with automated connection pooling and encrypted transport.</li>
          </ul>
        </section>

        <section className="mb-4">
          <h5 className="fw-bold">4. Third-Party Sharing</h5>
          <p>
            We <strong>do not sell, rent, or trade</strong> your personal data to third-party advertisers
            or data brokers. Information is shared only between participating customers and entrepreneurs
            to the extent necessary to complete a service request or order.
          </p>
        </section>

        <section className="mb-4">
          <h5 className="fw-bold">5. Your Rights & Contact</h5>
          <p>
            Users can review and update their profile details and availability status directly through their
            dashboard at any time. For questions regarding privacy or account management, please reach out
            via your account dashboard.
          </p>
        </section>

        <div className="border-top pt-3 mt-4 text-center">
          <Link to="/" className="btn btn-outline-secondary me-2">Back to Home</Link>
          <Link to="/terms" className="btn btn-outline-primary">View Terms of Use</Link>
        </div>
      </div>
    </div>
  );
}
