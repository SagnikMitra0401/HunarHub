import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="footer bg-white border-top mt-auto py-4">
      <div className="container">
        <div className="row align-items-center gy-3">
          <div className="col-md-6 text-center text-md-start">
            <span className="fw-bold text-dark me-2">HunarHub</span>
            <span className="text-muted small">
              &copy; {new Date().getFullYear()} Empowering Local Micro-Entrepreneurs.
            </span>
          </div>
          <div className="col-md-6 text-center text-md-end">
            <ul className="list-inline mb-0 small">
              <li className="list-inline-item me-3">
                <Link to="/entrepreneurs" className="text-decoration-none text-muted">
                  Entrepreneurs
                </Link>
              </li>
              <li className="list-inline-item me-3">
                <Link to="/products" className="text-decoration-none text-muted">
                  Marketplace
                </Link>
              </li>
              <li className="list-inline-item me-3">
                <Link to="/terms" className="text-decoration-none text-muted">
                  Terms of Use
                </Link>
              </li>
              <li className="list-inline-item">
                <Link to="/privacy" className="text-decoration-none text-muted">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
