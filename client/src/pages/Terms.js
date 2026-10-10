import React from "react";
import { Link } from "react-router-dom";

export default function Terms() {
  return (
    <div className="container my-5" style={{ maxWidth: 840 }}>
      <div className="card shadow-sm p-4 p-md-5">
        <h1 className="h2 mb-3 fw-bold">Terms of Use</h1>
        <p className="text-muted small mb-4">Last Updated: October 2026</p>

        <section className="mb-4">
          <h5 className="fw-bold">1. Purpose & Scope of HunarHub</h5>
          <p>
            HunarHub is a community platform designed to bridge local micro-entrepreneurs
            (including cobblers, potters/kumhars, tailors, artisans, and small vendors)
            with local customers. The platform acts as a digital marketplace and service
            directory to empower informal sector workers with direct visibility, catalog management,
            and service booking capabilities without commission fees.
          </p>
        </section>

        <section className="mb-4">
          <h5 className="fw-bold">2. User Accounts & Registration</h5>
          <p>
            Users may register either as a <strong>Customer</strong> or as a <strong>Micro-Entrepreneur</strong>.
            You agree to provide accurate, up-to-date contact and location details. You are responsible
            for maintaining the confidentiality of your account credentials.
          </p>
          <ul>
            <li><strong>Entrepreneurs:</strong> Subject to administrative review and verification before public listing.</li>
            <li><strong>Customers:</strong> May browse listings, place product orders, and submit service requests.</li>
          </ul>
        </section>

        <section className="mb-4">
          <h5 className="fw-bold">3. Product Orders & Custom Service Requests</h5>
          <p>
            HunarHub enables customers to place direct orders for handmade products and book custom
            work requests (repairs, tailoring, crafts).
          </p>
          <ul>
            <li>Service requests are subject to entrepreneur acceptance and availability.</li>
            <li>Entrepreneurs maintain discretion over their scheduling and completion status.</li>
            <li>Customers and entrepreneurs are expected to communicate honestly regarding requirements, timelines, and deliverables.</li>
          </ul>
        </section>

        <section className="mb-4">
          <h5 className="fw-bold">4. Reviews & Community Guidelines</h5>
          <p>
            Customers may leave authentic ratings and reviews following completed transactions.
            Reviews must reflect genuine interactions. Abusive, defamatory, fraudulent, or spam
            content is strictly prohibited and subject to immediate administrative removal and account suspension.
          </p>
        </section>

        <section className="mb-4">
          <h5 className="fw-bold">5. Dispute Resolution & Admin Moderation</h5>
          <p>
            In the event of unresolved disputes regarding orders or service requests, platform administrators
            reserve the right to mediate, update order statuses, or take corrective action to preserve community trust.
          </p>
        </section>

        <section className="mb-4">
          <h5 className="fw-bold">6. Platform Disclaimers</h5>
          <p>
            HunarHub provides catalog hosting, discovery, and coordination tools. We do not manufacture
            the listed goods or directly perform the artisan services. While we enforce verification processes,
            users should practice standard prudence when coordinating local delivery and fulfillment.
          </p>
        </section>

        <div className="border-top pt-3 mt-4 text-center">
          <Link to="/" className="btn btn-outline-secondary me-2">Back to Home</Link>
          <Link to="/privacy" className="btn btn-outline-primary">View Privacy Policy</Link>
        </div>
      </div>
    </div>
  );
}
