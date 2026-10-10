// Module-level in-memory cache — survives React navigation (component unmount/remount)
// but is cleared on full page refresh, which is the right behaviour for a small live system.

const store = new Map(); // key → { data, fetchedAt }

const TTL_MS = 60 * 1000; // treat cached data as fresh for 60 seconds

function cacheKey(url, params) {
  if (!params || Object.keys(params).length === 0) return url;
  const sorted = Object.keys(params)
    .sort()
    .map((k) => `${k}=${params[k]}`)
    .join("&");
  return `${url}?${sorted}`;
}

function isStale(entry) {
  return Date.now() - entry.fetchedAt > TTL_MS;
}

function get(url, params) {
  const key = cacheKey(url, params);
  return store.get(key) || null;
}

function set(url, params, data) {
  const key = cacheKey(url, params);
  store.set(key, { data, fetchedAt: Date.now() });
}

// Invalidate a specific entry or everything starting with a prefix
function invalidate(urlPrefix) {
  for (const key of store.keys()) {
    if (key === urlPrefix || key.startsWith(urlPrefix)) {
      store.delete(key);
    }
  }
}

export default { get, set, isStale, invalidate };
