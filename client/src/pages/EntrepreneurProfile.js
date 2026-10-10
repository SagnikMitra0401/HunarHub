import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/client";
import { useAuth } from "../context/AuthContext";

export default function EntrepreneurProfile() {
  const { id } = useParams();
  const { user } = useAuth();
  const [entrepreneur, setEntrepreneur] = useState(null);
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");

  function load() {
    api.get(`/entrepreneurs/${id}`).then((res) => setEntrepreneur(res.data)).catch(() => {});
  }

  useEffect(load, [id]);

  async function handleRequest(e) {
    e.preventDefault();
    setMessage("");
    try {
      await api.post("/service-requests", { entrepreneurId: id, description });
      setMessage("Service request sent!");
      setDescription("");
    } catch (err) {
      setMessage(err.response?.data?.error || "Failed to send request.");
    }
  }

  async function handleBuy(productId) {
    setMessage("");
    try {
      await api.post("/orders", { productId, quantity: 1 });
      setMessage("Order placed! Check your dashboard for status.");
    } catch (err) {
      setMessage(err.response?.data?.error || "Failed to place order.");
    }
  }

  if (!entrepreneur) return <div className="container">Loading...</div>;

  return (
    <div className="container">
      <h2>{entrepreneur.user?.name}</h2>
      <p><strong>Skill:</strong> {entrepreneur.category?.name}</p>
      <p><strong>Location:</strong> {entrepreneur.location || "N/A"}</p>
      <p><strong>Price Range:</strong> {entrepreneur.priceRange || "N/A"}</p>
      <p><strong>About:</strong> {entrepreneur.bio || "N/A"}</p>
      <p>
        <strong>Available:</strong>{" "}
        <span className={entrepreneur.isAvailable ? "text-success" : "text-muted"}>
          {entrepreneur.isAvailable ? "Yes" : "Currently unavailable"}
        </span>
      </p>

      {message && <div className="alert alert-info">{message}</div>}

      <h4>Products</h4>
      <div className="row mb-4">
        {entrepreneur.products?.map((p) => (
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
                <h6 className="card-title">{p.name}</h6>
                {p.description && <p className="card-text small">{p.description}</p>}
                <p className="fw-bold">₹{p.price}</p>
                {user && user.role === "CUSTOMER" && (
                  <button className="btn btn-sm btn-success" onClick={() => handleBuy(p.id)}>
                    Buy
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
        {(!entrepreneur.products || entrepreneur.products.length === 0) && (
          <p className="text-muted">No products listed.</p>
        )}
      </div>

      {user && user.role === "CUSTOMER" && entrepreneur.isAvailable && (
        <div className="mb-4">
          <h4>Place a Service Request</h4>
          <form onSubmit={handleRequest}>
            <div className="mb-2">
              <textarea
                className="form-control"
                required
                placeholder="Describe what you need"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-primary">Send Request</button>
          </form>
        </div>
      )}

      <h4>Reviews</h4>
      {entrepreneur.reviews?.length > 0 ? (
        entrepreneur.reviews.map((r) => (
          <div key={r.id} className="border-bottom py-2">
            <strong>{r.customer?.name}</strong> — {r.rating}/5
            {r.comment && <p className="mb-0 small">{r.comment}</p>}
          </div>
        ))
      ) : (
        <p className="text-muted">No reviews yet.</p>
      )}
    </div>
  );
}
