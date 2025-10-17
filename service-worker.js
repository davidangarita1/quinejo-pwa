const CACHE_NAME = "image-share-pwa-cache-v1";
const PRECACHE_URLS = [
  "/",
  "/index.html",
  "/manifest.json",
  "/app.js",
  "/service-worker.js",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
];

self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS))
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      );
      await self.clients.claim();
    })()
  );
});

async function handleShare(event) {
  const formData = await event.request.formData();
  const photos = formData.getAll("photos") || [];
  const title = formData.get("title") || "";
  const text = formData.get("text") || "";
  const urlValue = formData.get("url") || "";

  const clientId = event.resultingClientId || event.clientId;
  if (clientId) {
    const client = await self.clients.get(clientId);
    if (client) {
      client.postMessage({ photos, title, text, url: urlValue });
    }
  } else {
    const clientsList = await self.clients.matchAll({
      type: "window",
      includeUncontrolled: true,
    });
    if (clientsList.length > 0) {
      clientsList[0].postMessage({ photos, title, text, url: urlValue });
    }
  }

  return Response.redirect("/", 303);
}

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);
  if (event.request.method === "POST" && url.pathname === "/share") {
    event.respondWith(
      (async () => {
        const formData = await event.request.formData();
        const link = formData.get("url") || "";
        const responseUrl = await saveBookmark(link);
        return Response.redirect(responseUrl, 303);
      })()
    );
  }
});
