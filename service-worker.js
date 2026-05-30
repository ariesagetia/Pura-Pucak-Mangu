const CACHE_NAME = "wisata-cache-v6";

const STATIC_ASSETS = [
  "./",
  "index.html",
  "deskripsi.html",
  "spiritual.html",
  "etika.html",
  "trekking.html",
  "admin.html",
  "manifest.json",
  "service-worker.js",
  "icon-192.png",
  "icon-512.png"
];

// Install
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(STATIC_ASSETS))
  );
});

// Activate
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) return caches.delete(key);
        })
      );
    })
  );
});

// Fetch
self.addEventListener("fetch", (event) => {
  const url = event.request.url;

  if (url.includes("script.google.com/macros")) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          const cloned = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, cloned));
          return response;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return cachedResponse || fetch(event.request);
    })
  );
});