// SportLab Service Worker — v3
// Stratégies :
// - Precache de la coquille (HTML, manifest, favicon) au premier install → app dispo offline immédiatement
// - /assets/* (JS/CSS hashés par Vite) → cache-first (immutables)
// - /images/* (gifs exos) → cache-first runtime
// - HTML & autres → network-first avec fallback cache puis "/"
// - Cross-origin (Google Fonts, etc.) → network-first avec fallback cache

const CACHE_VERSION = "v3";
const STATIC_CACHE = `sportlab-static-${CACHE_VERSION}`;
const RUNTIME_CACHE = `sportlab-runtime-${CACHE_VERSION}`;

const PRECACHE_URLS = ["/", "/manifest.json", "/favicon.svg"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .catch(() => undefined)
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((k) => !k.endsWith(CACHE_VERSION))
          .map((k) => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("message", (event) => {
  if (event.data === "SKIP_WAITING") self.skipWaiting();
});

function cacheFirst(request, cacheName) {
  return caches.match(request).then((cached) => {
    if (cached) return cached;
    return fetch(request).then((response) => {
      if (response.ok) {
        const clone = response.clone();
        caches.open(cacheName).then((c) => c.put(request, clone));
      }
      return response;
    });
  });
}

function networkFirst(request, cacheName, fallbackUrl) {
  return fetch(request)
    .then((response) => {
      if (response.ok && response.type === "basic") {
        const clone = response.clone();
        caches.open(cacheName).then((c) => c.put(request, clone));
      }
      return response;
    })
    .catch(() =>
      caches.match(request).then((cached) => {
        if (cached) return cached;
        if (fallbackUrl) return caches.match(fallbackUrl);
        return Response.error();
      })
    );
}

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.protocol !== "http:" && url.protocol !== "https:") return;

  // Cross-origin (Google Fonts, etc.)
  if (url.origin !== self.location.origin) {
    event.respondWith(networkFirst(request, RUNTIME_CACHE));
    return;
  }

  // Assets versionnés Vite (immutables)
  if (url.pathname.startsWith("/assets/")) {
    event.respondWith(cacheFirst(request, STATIC_CACHE));
    return;
  }

  // Images des exos
  if (url.pathname.startsWith("/images/")) {
    event.respondWith(cacheFirst(request, RUNTIME_CACHE));
    return;
  }

  // HTML & navigation : on préfère réseau (pour avoir les MAJ), fallback cache puis "/"
  event.respondWith(networkFirst(request, RUNTIME_CACHE, "/"));
});
