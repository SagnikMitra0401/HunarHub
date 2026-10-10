import React from "react";
import { Link } from "react-router-dom";
import useCachedApi from "../hooks/useCachedApi";

export default function Home() {
  // Categories are fetched once and shared with EntrepreneurList from the same cache entry
  const { data: categories = [] } = useCachedApi("/categories");

  return (
    <div className="container my-4">
      <div className="hero-banner text-center">
        <h1 className="display-5">Empowering Local Micro-Entrepreneurs</h1>
        <p className="lead mb-4">
          Discover skilled cobblers, potters, tailors, artisans, and local vendors in your area.
          Book custom services or buy authentic handmade products directly.
        </p>
        <div className="d-flex justify-content-center gap-3">
          <Link className="btn btn-warning btn-lg px-4 fw-bold" to="/entrepreneurs">
            Find Local Talent
          </Link>
          <Link className="btn btn-outline-light btn-lg px-4" to="/products">
            Explore Marketplace
          </Link>
        </div>
      </div>

      <div className="my-5">
        <h4 className="fw-bold mb-3 text-center">Browse by Skill &amp; Category</h4>
        <div className="d-flex flex-wrap justify-content-center gap-2">
          {categories.map((c) => (
            <Link key={c.id} to={`/entrepreneurs?category=${encodeURIComponent(c.name)}`} className="category-pill">
              {c.name}
            </Link>
          ))}
          {categories.length === 0 && (
            <p className="text-muted">Loading categories...</p>
          )}
        </div>
      </div>

      <div className="row text-center my-5">
        <div className="col-md-4 mb-3">
          <div className="p-3 border rounded bg-white h-100">
            <h5>Direct Support</h5>
            <p className="text-muted small mb-0">Connect directly with artisans and small vendors without middlemen fees.</p>
          </div>
        </div>
        <div className="col-md-4 mb-3">
          <div className="p-3 border rounded bg-white h-100">
            <h5>Custom Service Requests</h5>
            <p className="text-muted small mb-0">Book repairs, tailoring, pottery orders, and custom crafted goods effortlessly.</p>
          </div>
        </div>
        <div className="col-md-4 mb-3">
          <div className="p-3 border rounded bg-white h-100">
            <h5>Transparent Pricing</h5>
            <p className="text-muted small mb-0">Clear price ranges, customer ratings, and direct contact details for full trust.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
