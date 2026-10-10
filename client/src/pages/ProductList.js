import React, { useEffect, useState } from "react";
import api from "../api/client";
import { useAuth } from "../context/AuthContext";

export default function ProductList() {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({ category: "", minPrice: "", maxPrice: "" });
  const [message, setMessage] = useState("");

  useEffect(() => {
    api.get("/categories").then((res) => setCategories(res.data)).catch(() => {});
  }, []);

  useEffect(() => {
    const params = {};
    if (filters.category) params.category = filters.category;
    if (filters.minPrice) params.minPrice = filters.minPrice;
    if (filters.maxPrice) params.maxPrice = filters.maxPrice;
    api.get("/products", { params }).then((res) => setProducts(res.data)).catch(() => {});
  }, [filters]);

  async function handleBuy(productId) {
    setMessage("");
    try {
      await api.post("/orders", { productId, quantity: 1 });
      setMessage("Order placed! Check your dashboard for status.");
    } catch (err) {
      setMessage(err.response?.data?.error || "Failed to place order.");
    }
  }

  return (
    <div className="container">
      <h2>Product Marketplace</h2>

      <div className="row mb-3 g-2">
        <div className="col-md-4">
          <select
            className="form-select"
            value={filters.category}
            onChange={(e) => setFilters({ ...filters, category: e.target.value })}
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.name}>{c.name}</option>
            ))}
          </select>
        </div>
        <div className="col-md-3">
          <input
            className="form-control"
            type="number"
            placeholder="Min price"
            value={filters.minPrice}
            onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
          />
        </div>
        <div className="col-md-3">
          <input
            className="form-control"
            type="number"
            placeholder="Max price"
            value={filters.maxPrice}
            onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
          />
        </div>
      </div>

      {message && <div className="alert alert-info">{message}</div>}

      <div className="row">
        {products.map((p) => (
          <div className="col-md-4 mb-3" key={p.id}>
            <div className="card h-100">
              {p.imageUrl && (
                <img
                  src={p.imageUrl}
                  alt={p.name}
                  className="card-img-top"
                  style={{ height: 180, objectFit: "cover" }}
                  onError={(e) => { e.target.style.display = "none"; }}
                />
              )}
              <div className="card-body">
                <h5 className="card-title">{p.name}</h5>
                {p.description && <p className="card-text small">{p.description}</p>}
                <p className="fw-bold">₹{p.price}</p>
                <p className="text-muted small">By {p.entrepreneur?.user?.name} ({p.entrepreneur?.category?.name})</p>
                {user && user.role === "CUSTOMER" && (
                  <button className="btn btn-sm btn-success" onClick={() => handleBuy(p.id)}>
                    Buy
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
        {products.length === 0 && <p className="text-muted">No products found.</p>}
      </div>
    </div>
  );
}
