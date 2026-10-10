import React, { useEffect, useState } from "react";
import api from "../api/client";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("analytics");
  const [pending, setPending] = useState([]);
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [orders, setOrders] = useState([]);
  const [requests, setRequests] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [message, setMessage] = useState("");

  function loadAll() {
    api.get("/admin/entrepreneurs/pending").then((res) => setPending(res.data)).catch(() => {});
    api.get("/categories").then((res) => setCategories(res.data)).catch(() => {});
    api.get("/admin/orders").then((res) => setOrders(res.data)).catch(() => {});
    api.get("/admin/service-requests").then((res) => setRequests(res.data)).catch(() => {});
    api.get("/admin/analytics").then((res) => setAnalytics(res.data)).catch(() => {});
  }

  useEffect(loadAll, []);

  async function verify(id) {
    await api.put(`/entrepreneurs/${id}/verify`);
    loadAll();
  }

  async function addCategory(e) {
    e.preventDefault();
    setMessage("");
    try {
      await api.post("/categories", { name: newCategory });
      setNewCategory("");
      loadAll();
    } catch (err) {
      setMessage(err.response?.data?.error || "Failed to add category");
    }
  }

  async function deleteCategory(id) {
    await api.delete(`/categories/${id}`);
    loadAll();
  }

  async function disputeOrder(id) {
    await api.put(`/admin/orders/${id}/dispute`);
    loadAll();
  }

  async function disputeRequest(id) {
    await api.put(`/admin/service-requests/${id}/dispute`);
    loadAll();
  }

  return (
    <div className="container">
      <h2>Admin Dashboard</h2>
      {message && <div className="alert alert-danger py-2">{message}</div>}

      <div className="d-flex flex-wrap gap-2 my-3 border-bottom pb-3">
        <button
          className={`nav-tab-btn ${activeTab === "analytics" ? "active" : ""}`}
          onClick={() => setActiveTab("analytics")}
        >
          Platform Analytics
        </button>
        <button
          className={`nav-tab-btn ${activeTab === "pending" ? "active" : ""}`}
          onClick={() => setActiveTab("pending")}
        >
          Pending Verifications ({pending.length})
        </button>
        <button
          className={`nav-tab-btn ${activeTab === "categories" ? "active" : ""}`}
          onClick={() => setActiveTab("categories")}
        >
          Manage Categories ({categories.length})
        </button>
        <button
          className={`nav-tab-btn ${activeTab === "orders" ? "active" : ""}`}
          onClick={() => setActiveTab("orders")}
        >
          All Orders ({orders.length})
        </button>
        <button
          className={`nav-tab-btn ${activeTab === "requests" ? "active" : ""}`}
          onClick={() => setActiveTab("requests")}
        >
          All Service Requests ({requests.length})
        </button>
      </div>

      {activeTab === "analytics" && (
        <div className="card p-4 mb-4">
          <h4>Platform Analytics & KPIs</h4>
          {analytics ? (
            <div className="row g-3 my-2">
              <div className="col-md-4">
                <div className="border p-3 rounded bg-light">
                  <div className="text-muted small">Registered Entrepreneurs</div>
                  <div className="fs-3 fw-bold">{analytics.registeredEntrepreneurs}</div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="border p-3 rounded bg-light">
                  <div className="text-muted small">Active Customers</div>
                  <div className="fs-3 fw-bold">{analytics.activeUsers}</div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="border p-3 rounded bg-light">
                  <div className="text-muted small">Request Conversion Rate</div>
                  <div className="fs-3 fw-bold">{(analytics.serviceRequestConversionRate * 100).toFixed(1)}%</div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="border p-3 rounded bg-light">
                  <div className="text-muted small">Product Sales Volume</div>
                  <div className="fs-3 fw-bold">{analytics.productSalesVolume} items</div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="border p-3 rounded bg-light">
                  <div className="text-muted small">Avg. Entrepreneur Earnings</div>
                  <div className="fs-3 fw-bold">₹{analytics.averageEntrepreneurEarnings.toFixed(2)}</div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="border p-3 rounded bg-light">
                  <div className="text-muted small">Avg. Customer Rating</div>
                  <div className="fs-3 fw-bold">{analytics.averageCustomerSatisfaction.toFixed(2)} / 5 ★</div>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-muted">Loading analytics...</p>
          )}
        </div>
      )}

      {activeTab === "pending" && (
        <div className="mb-4">
          <h4>Pending Entrepreneur Verifications</h4>
          <table className="table">
            <thead><tr><th>Name</th><th>Email</th><th>Category</th><th>Action</th></tr></thead>
            <tbody>
              {pending.map((e) => (
                <tr key={e.id}>
                  <td>{e.user?.name}</td>
                  <td>{e.user?.email}</td>
                  <td>{e.category?.name}</td>
                  <td><button className="btn btn-sm btn-success" onClick={() => verify(e.id)}>Verify</button></td>
                </tr>
              ))}
              {pending.length === 0 && <tr><td colSpan={4} className="text-muted">No pending verifications.</td></tr>}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === "categories" && (
        <div className="mb-4">
          <h4>Manage Categories</h4>
          <form onSubmit={addCategory} className="d-flex gap-2 mb-3" style={{ maxWidth: 400 }}>
            <input
              className="form-control"
              placeholder="New category name"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
            />
            <button type="submit" className="btn btn-primary">Add</button>
          </form>
          <ul className="list-group" style={{ maxWidth: 400 }}>
            {categories.map((c) => (
              <li key={c.id} className="list-group-item d-flex justify-content-between align-items-center">
                {c.name}
                <button className="btn btn-sm btn-outline-danger" onClick={() => deleteCategory(c.id)}>Remove</button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {activeTab === "orders" && (
        <div className="mb-4">
          <h4>All Platform Orders</h4>
          <table className="table">
            <thead><tr><th>Customer</th><th>Product</th><th>Entrepreneur</th><th>Status</th><th>Action</th></tr></thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id}>
                  <td>{o.customer?.name}</td>
                  <td>{o.product?.name}</td>
                  <td>{o.product?.entrepreneur?.user?.name}</td>
                  <td><span className={`badge badge-${o.status.toLowerCase()}`}>{o.status}</span></td>
                  <td>
                    {o.status !== "CANCELLED" && o.status !== "COMPLETED" && (
                      <button className="btn btn-sm btn-outline-danger" onClick={() => disputeOrder(o.id)}>
                        Cancel (Dispute)
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {orders.length === 0 && <tr><td colSpan={5} className="text-muted">No orders found.</td></tr>}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === "requests" && (
        <div className="mb-4">
          <h4>All Service Requests</h4>
          <table className="table">
            <thead><tr><th>Customer</th><th>Entrepreneur</th><th>Status</th><th>Action</th></tr></thead>
            <tbody>
              {requests.map((r) => (
                <tr key={r.id}>
                  <td>{r.customer?.name}</td>
                  <td>{r.entrepreneur?.user?.name}</td>
                  <td><span className={`badge badge-${r.status.toLowerCase()}`}>{r.status}</span></td>
                  <td>
                    {r.status === "PENDING" || r.status === "ACCEPTED" ? (
                      <button className="btn btn-sm btn-outline-danger" onClick={() => disputeRequest(r.id)}>
                        Reject (Dispute)
                      </button>
                    ) : null}
                  </td>
                </tr>
              ))}
              {requests.length === 0 && <tr><td colSpan={4} className="text-muted">No service requests found.</td></tr>}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
