import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import useCachedApi from "../hooks/useCachedApi";

export default function EntrepreneurList() {
  const [filters, setFilters] = useState({ category: "", location: "", search: "" });

  // Categories are static — cache hit after first visit is near-instant
  const { data: categories = [] } = useCachedApi("/categories");

  // Build params only from non-empty filters to keep the cache key stable
  const params = useMemo(() => {
    const p = {};
    if (filters.category) p.category = filters.category;
    if (filters.location) p.location = filters.location;
    if (filters.search) p.search = filters.search;
    return p;
  }, [filters.category, filters.location, filters.search]);

  const { data: entrepreneurs = [], loading } = useCachedApi("/entrepreneurs", params);

  return (
    <div className="container">
      <h2>Browse Entrepreneurs</h2>

      <div className="row mb-3 g-2">
        <div className="col-md-4">
          <input
            id="entrepreneur-search"
            name="search"
            className="form-control"
            placeholder="Search by name or skill"
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          />
        </div>
        <div className="col-md-4">
          <select
            id="entrepreneur-category"
            name="category"
            className="form-select"
            value={filters.category}
            onChange={(e) => setFilters({ ...filters, category: e.target.value })}
          >
            <option value="">All Skill Types</option>
            {categories.map((c) => (
              <option key={c.id} value={c.name}>{c.name}</option>
            ))}
          </select>
        </div>
        <div className="col-md-4">
          <input
            id="entrepreneur-location"
            name="location"
            className="form-control"
            placeholder="Filter by location"
            value={filters.location}
            onChange={(e) => setFilters({ ...filters, location: e.target.value })}
          />
        </div>
      </div>

      {loading && entrepreneurs.length === 0 && (
        <p className="text-muted">Loading entrepreneurs...</p>
      )}

      <div className="row">
        {entrepreneurs.map((e) => (
          <div className="col-md-4 mb-3" key={e.id}>
            <div className="card h-100">
              <div className="card-body">
                <h5 className="card-title">{e.user?.name}</h5>
                <p className="card-text mb-1"><strong>Skill:</strong> {e.category?.name}</p>
                <p className="card-text mb-1"><strong>Location:</strong> {e.location || "N/A"}</p>
                <p className="card-text mb-1"><strong>Price Range:</strong> {e.priceRange || "N/A"}</p>
                <Link className="btn btn-sm btn-primary mt-2" to={`/entrepreneurs/${e.id}`}>
                  View Profile
                </Link>
              </div>
            </div>
          </div>
        ))}
        {!loading && entrepreneurs.length === 0 && (
          <p className="text-muted">No entrepreneurs found.</p>
        )}
      </div>
    </div>
  );
}
