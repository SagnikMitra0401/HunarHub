import React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <nav className="navbar navbar-expand-md navbar-light bg-light border-bottom mb-4 px-3">
      <div className="container-fluid">
        <Link className="navbar-brand me-4" to="/">
          HunarHub
        </Link>
        <div className="d-flex flex-wrap align-items-center gap-1 my-1">
          <NavLink
            to="/entrepreneurs"
            className={({ isActive }) => `nav-tab-btn ${isActive ? "active" : ""}`}
          >
            Browse Entrepreneurs
          </NavLink>
          <NavLink
            to="/products"
            className={({ isActive }) => `nav-tab-btn ${isActive ? "active" : ""}`}
          >
            Products
          </NavLink>

          {!user && (
            <>
              <NavLink
                to="/login"
                className={({ isActive }) => `nav-tab-btn ${isActive ? "active" : ""}`}
              >
                Login
              </NavLink>
              <NavLink
                to="/register"
                className={({ isActive }) => `nav-tab-btn ${isActive ? "active" : ""}`}
              >
                Register
              </NavLink>
            </>
          )}

          {user && user.role === "CUSTOMER" && (
            <NavLink
              to="/customer/dashboard"
              className={({ isActive }) => `nav-tab-btn ${isActive ? "active" : ""}`}
            >
              My Dashboard
            </NavLink>
          )}
          {user && user.role === "ENTREPRENEUR" && (
            <NavLink
              to="/entrepreneur/dashboard"
              className={({ isActive }) => `nav-tab-btn ${isActive ? "active" : ""}`}
            >
              My Dashboard
            </NavLink>
          )}
          {user && user.role === "ADMIN" && (
            <NavLink
              to="/admin/dashboard"
              className={({ isActive }) => `nav-tab-btn ${isActive ? "active" : ""}`}
            >
              Admin Dashboard
            </NavLink>
          )}

          {user && (
            <button className="btn btn-sm btn-outline-secondary ms-2" onClick={handleLogout}>
              Logout ({user.name})
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
