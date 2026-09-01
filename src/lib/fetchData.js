const cache = new Map();
const CACHE_TTL = 5 * 60 * 1000;
const ERROR_TTL = 5 * 1000; 

export function fetchData(url) {
  const cached = cache.get(url);
  const now = Date.now();

  if (cached) {
    const ttl = cached.isError ? ERROR_TTL : CACHE_TTL;
    if (now - cached.timestamp < ttl) {
      return cached.resource;
    }
    cache.delete(url);
  }

  const resource = createResource(url, cache, url);
  cache.set(url, { resource, timestamp: now, isError: false });
  return resource;
}

function createResource(url, cacheRef, cacheKey) {
  let status = "pending";
  let result;

  const promise = fetch(url, { credentials: "include" })
    .then(async (res) => {
      if (!res.ok) {
        let detail;
        try {
          const body = await res.json();
          detail = body.detail || body.message;
        } catch {
          detail = null;
        }

        const err = new Error(detail || `Error ${res.status}`);
        err.status = res.status;
        err.retryAfter = res.headers.get("Retry-After");
        throw err;
      }
      return res.json();
    })
    .then(
      (data) => {
        status = "success";
        result = data;
      },
      (err) => {
        status = "error";
        result = err;
    
        const entry = cacheRef.get(cacheKey);
        if (entry) entry.isError = true;
      }
    );

  return {
    read() {
      if (status === "pending") throw promise;
      if (status === "error") throw result;
      return result;
    },
  };
}