import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/client";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "CUSTOMER",
    phone: "",
    location: "",
    categoryId: "",
    bio: "",
    priceRange: "",
  });

  useEffect(() => {
    api.get("/categories").then((res) => setCategories(res.data)).catch(() => {});
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      const user = await register(form);
      if (user.role === "ENTREPRENEUR") navigate("/entrepreneur/dashboard");
      else navigate("/customer/dashboard");
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed");
    }
  }

  return (
    <div className="container" style={{ maxWidth: 500 }}>
      <h2>Register</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">I am a</label>
          <select
            className="form-select"
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
          >
            <option value="CUSTOMER">Customer</option>
            <option value="ENTREPRENEUR">Micro-Entrepreneur</option>
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label">Name</label>
          <input
            className="form-control"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            type="email"
            className="form-control"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Password</label>
          <input
            type="password"
            className="form-control"
            required
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Phone</label>
          <input
            className="form-control"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Location</label>
          <input
            className="form-control"
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
          />
        </div>

        {form.role === "ENTREPRENEUR" && (
          <>
            <div className="mb-3">
              <label className="form-label">Skill Category</label>
              <select
                className="form-select"
                required
                value={form.categoryId}
                onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
              >
                <option value="">Select a category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label">Skills & Experience (bio)</label>
              <textarea
                className="form-control"
                value={form.bio}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Price Range</label>
              <input
                className="form-control"
                placeholder="e.g. ₹200 - ₹1000"
                value={form.priceRange}
                onChange={(e) => setForm({ ...form, priceRange: e.target.value })}
              />
            </div>
          </>
        )}

        <button type="submit" className="btn btn-primary">Register</button>
      </form>
    </div>
  );
}
