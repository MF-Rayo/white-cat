const cache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutos

export function fetchData(url) {
  const cached = cache.get(url);
  const now = Date.now();

  // Si existe en cache y no ha expirado, reusarlo (sin nueva petición)
  if (cached && now - cached.timestamp < CACHE_TTL) {
    return cached.resource;
  }

  const resource = createResource(url);
  cache.set(url, { resource, timestamp: now });
  return resource;
}

function createResource(url) {
  let status = "pending";
  let result;

  const promise = fetch(url)
    .then((res) => res.json())
    .then(
      (data) => {
        status = "success";
        result = data;
      },
      (err) => {
        status = "error";
        result = err;
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