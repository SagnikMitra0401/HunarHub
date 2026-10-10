import React, { useEffect, useState } from "react";
import api from "../api/client";

export default function CustomerDashboard() {
  const [activeTab, setActiveTab] = useState("orders");
  const [orders, setOrders] = useState([]);
  const [requests, setRequests] = useState([]);
  const [reviewForm, setReviewForm] = useState({});
  const [message, setMessage] = useState("");

  function load() {
    api.get("/orders/mine").then((res) => setOrders(res.data)).catch(() => {});
    api.get("/service-requests/mine").then((res) => setRequests(res.data)).catch(() => {});
  }

  useEffect(load, []);

  async function submitReview(entrepreneurId, orderId, serviceRequestId) {
    const entry = reviewForm[entrepreneurId] || {};
    if (!entry.rating) {
      setMessage("Please select a rating first.");
      return;
    }
    try {
      await api.post("/reviews", {
        entrepreneurId,
        rating: Number(entry.rating),
        comment: entry.comment || "",
        orderId,
        serviceRequestId,
      });
      setMessage("Review submitted!");
      setReviewForm({ ...reviewForm, [entrepreneurId]: {} });
    } catch (err) {
      setMessage(err.response?.data?.error || "Failed to submit review.");
    }
  }

  function updateReviewField(entrepreneurId, field, value) {
    setReviewForm({
      ...reviewForm,
      [entrepreneurId]: { ...(reviewForm[entrepreneurId] || {}), [field]: value },
    });
  }

  return (
    <div className="container">
      <h2>My Dashboard</h2>
      {message && <div className="alert alert-info py-2">{message}</div>}

      <div className="d-flex flex-wrap gap-2 my-3 border-bottom pb-3">
        <button
          className={`nav-tab-btn ${activeTab === "orders" ? "active" : ""}`}
          onClick={() => setActiveTab("orders")}
        >
          Product Orders ({orders.length})
        </button>
        <button
          className={`nav-tab-btn ${activeTab === "requests" ? "active" : ""}`}
          onClick={() => setActiveTab("requests")}
        >
          Service Requests ({requests.length})
        </button>
      </div>

      {activeTab === "orders" && (
        <div>
          <h4>Order History</h4>
          <table className="table">
            <thead>
              <tr><th>Product</th><th>Entrepreneur</th><th>Qty</th><th>Total</th><th>Status</th><th>Review</th></tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id}>
                  <td>{o.product?.name}</td>
                  <td>{o.product?.entrepreneur?.user?.name}</td>
                  <td>{o.quantity}</td>
                  <td>₹{o.totalPrice}</td>
                  <td>
                    <span className={`badge badge-${o.status.toLowerCase()}`}>{o.status}</span>
                  </td>
                  <td>
                    {o.status === "COMPLETED" && (
                      <div className="d-flex gap-1 align-items-center">
                        <select
                          className="form-select form-select-sm"
                          style={{ width: 80 }}
                          onChange={(e) => updateReviewField(o.product.entrepreneurId, "rating", e.target.value)}
                        >
                          <option value="">Rate</option>
                          {[1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>{n} ★</option>)}
                        </select>
                        <button
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => submitReview(o.product.entrepreneurId, o.id, null)}
                        >
                          Submit
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr><td colSpan={6} className="text-muted">No product orders placed yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === "requests" && (
        <div>
          <h4>Service Request History</h4>
          <table className="table">
            <thead>
              <tr><th>Entrepreneur</th><th>Description</th><th>Status</th><th>Review</th></tr>
            </thead>
            <tbody>
              {requests.map((r) => (
                <tr key={r.id}>
                  <td>{r.entrepreneur?.user?.name}</td>
                  <td>{r.description}</td>
                  <td>
                    <span className={`badge badge-${r.status.toLowerCase()}`}>{r.status}</span>
                  </td>
                  <td>
                    {r.status === "COMPLETED" && (
                      <div className="d-flex gap-1 align-items-center">
                        <select
                          className="form-select form-select-sm"
                          style={{ width: 80 }}
                          onChange={(e) => updateReviewField(r.entrepreneurId, "rating", e.target.value)}
                        >
                          <option value="">Rate</option>
                          {[1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>{n} ★</option>)}
                        </select>
                        <button
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => submitReview(r.entrepreneurId, null, r.id)}
                        >
                          Submit
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
              {requests.length === 0 && (
                <tr><td colSpan={4} className="text-muted">No service requests placed yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
