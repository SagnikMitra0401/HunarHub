import React, { useEffect, useState } from "react";
import api from "../api/client";

export default function EntrepreneurDashboard() {
  const [activeTab, setActiveTab] = useState("profile");
  const [profile, setProfile] = useState(null);
  const [categories, setCategories] = useState([]);
  const [requests, setRequests] = useState([]);
  const [orders, setOrders] = useState([]);
  const [earnings, setEarnings] = useState(null);
  const [newProduct, setNewProduct] = useState({ name: "", description: "", price: "", imageUrl: "" });
  const [editingProduct, setEditingProduct] = useState(null);
  const [message, setMessage] = useState("");

  function loadAll() {
    api.get("/entrepreneurs/me/dashboard").then((res) => setProfile(res.data)).catch(() => {});
    api.get("/categories").then((res) => setCategories(res.data)).catch(() => {});
    api.get("/service-requests/received").then((res) => setRequests(res.data)).catch(() => {});
    api.get("/orders/received").then((res) => setOrders(res.data)).catch(() => {});
    api.get("/entrepreneurs/me/earnings").then((res) => setEarnings(res.data)).catch(() => {});
  }

  useEffect(loadAll, []);

  async function saveProfile(e) {
    e.preventDefault();
    setMessage("");
    try {
      await api.put("/entrepreneurs/me", {
        bio: profile.bio,
        location: profile.location,
        priceRange: profile.priceRange,
        categoryId: profile.categoryId,
        isAvailable: profile.isAvailable,
      });
      setMessage("Profile updated.");
      loadAll();
    } catch (err) {
      setMessage(err.response?.data?.error || "Failed to update profile.");
    }
  }

  async function addProduct(e) {
    e.preventDefault();
    setMessage("");
    try {
      await api.post("/products", { ...newProduct, price: Number(newProduct.price) });
      setNewProduct({ name: "", description: "", price: "", imageUrl: "" });
      setMessage("Product added.");
      loadAll();
    } catch (err) {
      setMessage(err.response?.data?.error || "Failed to add product.");
    }
  }

  async function saveEditProduct(e) {
    e.preventDefault();
    setMessage("");
    try {
      await api.put(`/products/${editingProduct.id}`, {
        name: editingProduct.name,
        description: editingProduct.description,
        price: Number(editingProduct.price),
        imageUrl: editingProduct.imageUrl,
      });
      setEditingProduct(null);
      setMessage("Product updated.");
      loadAll();
    } catch (err) {
      setMessage(err.response?.data?.error || "Failed to update product.");
    }
  }

  async function deleteProduct(productId) {
    if (!window.confirm("Remove this product?")) return;
    setMessage("");
    try {
      await api.delete(`/products/${productId}`);
      setMessage("Product removed.");
      loadAll();
    } catch (err) {
      setMessage(err.response?.data?.error || "Failed to remove product.");
    }
  }

  async function updateRequestStatus(id, status) {
    try {
      await api.put(`/service-requests/${id}/status`, { status });
      loadAll();
    } catch (err) {
      setMessage(err.response?.data?.error || "Failed to update request.");
    }
  }

  async function updateOrderStatus(id, status) {
    try {
      await api.put(`/orders/${id}/status`, { status });
      loadAll();
    } catch (err) {
      setMessage(err.response?.data?.error || "Failed to update order.");
    }
  }

  if (!profile) return <div className="container">Loading...</div>;

  return (
    <div className="container">
      <h2>Entrepreneur Dashboard</h2>
      {message && <div className="alert alert-info py-2">{message}</div>}
      {!profile.isVerified && (
        <div className="alert alert-warning py-2">Your profile is pending admin verification.</div>
      )}

      {/* Spaced Tab Buttons for Dashboard Sections */}
      <div className="d-flex flex-wrap gap-2 my-3 border-bottom pb-3">
        <button
          className={`nav-tab-btn ${activeTab === "profile" ? "active" : ""}`}
          onClick={() => setActiveTab("profile")}
        >
          My Profile
        </button>
        <button
          className={`nav-tab-btn ${activeTab === "products" ? "active" : ""}`}
          onClick={() => setActiveTab("products")}
        >
          My Products ({profile.products?.length || 0})
        </button>
        <button
          className={`nav-tab-btn ${activeTab === "requests" ? "active" : ""}`}
          onClick={() => setActiveTab("requests")}
        >
          Service Requests ({requests.length})
        </button>
        <button
          className={`nav-tab-btn ${activeTab === "orders" ? "active" : ""}`}
          onClick={() => setActiveTab("orders")}
        >
          Product Orders ({orders.length})
        </button>
        <button
          className={`nav-tab-btn ${activeTab === "earnings" ? "active" : ""}`}
          onClick={() => setActiveTab("earnings")}
        >
          Earnings Overview
        </button>
      </div>

      {activeTab === "profile" && (
        <div className="card p-3 mb-4">
          <h4>Edit Profile & Availability</h4>
          <form onSubmit={saveProfile}>
            <div className="mb-2">
              <label htmlFor="profile-category" className="form-label">Category</label>
              <select
                id="profile-category"
                name="categoryId"
                className="form-select"
                value={profile.categoryId}
                onChange={(e) => setProfile({ ...profile, categoryId: e.target.value })}
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div className="mb-2">
              <label htmlFor="profile-bio" className="form-label">Bio / Skills</label>
              <textarea
                id="profile-bio"
                name="bio"
                className="form-control"
                value={profile.bio || ""}
                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
              />
            </div>
            <div className="mb-2">
              <label htmlFor="profile-location" className="form-label">Location</label>
              <input
                id="profile-location"
                name="location"
                className="form-control"
                value={profile.location || ""}
                onChange={(e) => setProfile({ ...profile, location: e.target.value })}
              />
            </div>
            <div className="mb-2">
              <label htmlFor="profile-price-range" className="form-label">Price Range</label>
              <input
                id="profile-price-range"
                name="priceRange"
                className="form-control"
                placeholder="e.g. ₹200 - ₹1000"
                value={profile.priceRange || ""}
                onChange={(e) => setProfile({ ...profile, priceRange: e.target.value })}
              />
            </div>
            <div className="form-check mb-3">
              <input
                id="profile-available"
                name="isAvailable"
                type="checkbox"
                className="form-check-input"
                checked={profile.isAvailable}
                onChange={(e) => setProfile({ ...profile, isAvailable: e.target.checked })}
              />
              <label htmlFor="profile-available" className="form-check-label fw-bold">Available for new service requests</label>
            </div>
            <button type="submit" className="btn btn-primary">Save Profile</button>
          </form>
        </div>
      )}

      {activeTab === "earnings" && (
        <div className="card p-4 mb-4">
          <h4>Earnings Overview</h4>
          {earnings && (
            <div>
              <p className="fs-4 fw-bold text-success mb-1">
                ₹{earnings.totalEarnings.toFixed(2)}
              </p>
              <p className="text-muted">
                Earned from <strong>{earnings.completedOrderCount}</strong> completed product orders and{" "}
                <strong>{earnings.completedServiceCount}</strong> completed service requests.
              </p>
            </div>
          )}
        </div>
      )}

      {activeTab === "products" && (
        <div className="mb-4">
          <h4>My Products</h4>
          <table className="table table-sm mb-3">
            <thead>
              <tr><th>Name</th><th>Price</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {profile.products?.map((p) => (
                <tr key={p.id}>
                  <td>{p.name}</td>
                  <td>₹{p.price}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-outline-secondary me-1"
                      onClick={() => setEditingProduct({ ...p })}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => deleteProduct(p.id)}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
              {(!profile.products || profile.products.length === 0) && (
                <tr><td colSpan={3} className="text-muted">No products listed yet.</td></tr>
              )}
            </tbody>
          </table>

          {editingProduct && (
            <form onSubmit={saveEditProduct} className="card p-3 mb-3">
              <h6>Edit Product: {editingProduct.name}</h6>
              <div className="row g-2 mb-2">
                <div className="col-md-3">
                  <input
                    id="edit-product-name"
                    name="name"
                    className="form-control form-control-sm"
                    placeholder="Name"
                    required
                    value={editingProduct.name}
                    onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  />
                </div>
                <div className="col-md-4">
                  <input
                    id="edit-product-description"
                    name="description"
                    className="form-control form-control-sm"
                    placeholder="Description"
                    value={editingProduct.description || ""}
                    onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  />
                </div>
                <div className="col-md-2">
                  <input
                    id="edit-product-price"
                    name="price"
                    className="form-control form-control-sm"
                    type="number"
                    placeholder="Price"
                    required
                    value={editingProduct.price}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: e.target.value })}
                  />
                </div>
                <div className="col-md-2">
                  <input
                    id="edit-product-image"
                    name="imageUrl"
                    className="form-control form-control-sm"
                    placeholder="Image URL"
                    value={editingProduct.imageUrl || ""}
                    onChange={(e) => setEditingProduct({ ...editingProduct, imageUrl: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <button type="submit" className="btn btn-sm btn-primary me-2">Save Changes</button>
                <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => setEditingProduct(null)}>Cancel</button>
              </div>
            </form>
          )}

          <form onSubmit={addProduct} className="card p-3">
            <h6>Add New Product</h6>
            <div className="row g-2">
              <div className="col-md-3">
                <input
                  id="new-product-name"
                  name="name"
                  className="form-control"
                  placeholder="Product name"
                  required
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                />
              </div>
              <div className="col-md-4">
                <input
                  id="new-product-description"
                  name="description"
                  className="form-control"
                  placeholder="Description"
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                />
              </div>
              <div className="col-md-2">
                <input
                  id="new-product-price"
                  name="price"
                  className="form-control"
                  type="number"
                  placeholder="Price"
                  required
                  min="1"
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                />
              </div>
              <div className="col-md-2">
                <input
                  id="new-product-image"
                  name="imageUrl"
                  className="form-control"
                  placeholder="Image URL"
                  value={newProduct.imageUrl}
                  onChange={(e) => setNewProduct({ ...newProduct, imageUrl: e.target.value })}
                />
              </div>
              <div className="col-md-1">
                <button type="submit" className="btn btn-primary w-100">Add</button>
              </div>
            </div>
          </form>
        </div>
      )}

      {activeTab === "requests" && (
        <div className="mb-4">
          <h4>Service Requests</h4>
          <table className="table">
            <thead>
              <tr><th>Customer</th><th>Description</th><th>Status</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {requests.map((r) => (
                <tr key={r.id}>
                  <td>{r.customer?.name}</td>
                  <td>{r.description}</td>
                  <td>
                    <span className={`badge badge-${r.status.toLowerCase()}`}>{r.status}</span>
                  </td>
                  <td>
                    {r.status === "PENDING" && (
                      <>
                        <button className="btn btn-sm btn-success me-1" onClick={() => updateRequestStatus(r.id, "ACCEPTED")}>Accept</button>
                        <button className="btn btn-sm btn-danger" onClick={() => updateRequestStatus(r.id, "REJECTED")}>Reject</button>
                      </>
                    )}
                    {r.status === "ACCEPTED" && (
                      <button className="btn btn-sm btn-primary" onClick={() => updateRequestStatus(r.id, "COMPLETED")}>Mark Completed</button>
                    )}
                  </td>
                </tr>
              ))}
              {requests.length === 0 && <tr><td colSpan={4} className="text-muted">No requests received yet.</td></tr>}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === "orders" && (
        <div className="mb-4">
          <h4>Product Orders</h4>
          <table className="table">
            <thead>
              <tr><th>Customer</th><th>Product</th><th>Qty</th><th>Total</th><th>Status</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id}>
                  <td>{o.customer?.name}</td>
                  <td>{o.product?.name}</td>
                  <td>{o.quantity}</td>
                  <td>₹{o.totalPrice}</td>
                  <td>
                    <span className={`badge badge-${o.status.toLowerCase()}`}>{o.status}</span>
                  </td>
                  <td>
                    {o.status === "PENDING" && (
                      <button className="btn btn-sm btn-success" onClick={() => updateOrderStatus(o.id, "CONFIRMED")}>Confirm</button>
                    )}
                    {o.status === "CONFIRMED" && (
                      <button className="btn btn-sm btn-primary" onClick={() => updateOrderStatus(o.id, "COMPLETED")}>Mark Completed</button>
                    )}
                  </td>
                </tr>
              ))}
              {orders.length === 0 && <tr><td colSpan={6} className="text-muted">No orders received yet.</td></tr>}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
