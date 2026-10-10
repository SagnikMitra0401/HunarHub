import { useState, useEffect, useRef } from "react";
import api from "../api/client";
import cache from "../api/cache";

// Stale-while-revalidate hook:
// 1. If cached data exists → show it immediately (no loading flash).
// 2. If data is stale (>60s old) or missing → fetch in background and update on arrival.
// 3. Deduplicate in-flight requests — two components asking for the same URL
//    at the same time only produce one network request.

const inflight = new Map(); // url+params → Promise

export default function useCachedApi(url, params = {}) {
  const cached = cache.get(url, params);

  const [data, setData] = useState(cached ? cached.data : null);
  const [loading, setLoading] = useState(!cached);
  const [error, setError] = useState(null);

  // Stable ref so the effect doesn't re-run when params object identity changes
  const paramsRef = useRef(params);
  paramsRef.current = params;

  useEffect(() => {
    if (!url) return;

    const hit = cache.get(url, paramsRef.current);

    // Fresh cache — no network call needed
    if (hit && !cache.isStale(hit)) {
      setData(hit.data);
      setLoading(false);
      return;
    }

    // Stale or missing — fetch, but show stale data immediately if we have it
    if (hit) {
      setData(hit.data);
      setLoading(false); // don't blank the screen while revalidating
    } else {
      setLoading(true);
    }

    const key = JSON.stringify({ url, params: paramsRef.current });

    // Deduplicate concurrent fetches for the same key
    let promise = inflight.get(key);
    if (!promise) {
      promise = api
        .get(url, { params: paramsRef.current })
        .then((res) => {
          cache.set(url, paramsRef.current, res.data);
          inflight.delete(key);
          return res.data;
        })
        .catch((err) => {
          inflight.delete(key);
          throw err;
        });
      inflight.set(key, promise);
    }

    let cancelled = false;
    promise
      .then((freshData) => {
        if (!cancelled) {
          setData(freshData);
          setLoading(false);
          setError(null);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err);
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  // Re-run when the serialised params change, not on every render
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url, JSON.stringify(params)]);

  return { data, loading, error };
}
