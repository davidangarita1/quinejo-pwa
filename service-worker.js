const CACHE_NAME = "xamplepwa",
  urlsToCache = [".", "./index.html"];
self.addEventListener("install", (e) => {
  e.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache).then(() => self.skipWaiting());
      })
      .catch((err) => console.log("Falló registro de cache", err))
  );
});
self.addEventListener("message", (event) => {
  if (event.data === "skipWaiting") {
    self.skipWaiting();
  }
});
self.addEventListener("activate", (e) => {
  const cacheWhitelist = [CACHE_NAME];
  e.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheWhitelist.indexOf(cacheName) === -1) {
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => self.clients.claim())
  );
});
self.addEventListener("fetch", (e) => {
  const url = new URL(e.request.url);

  if (url.pathname === "/share-target" && e.request.method === "POST") {
    e.respondWith(handleShareTarget(e.request));
    return;
  }

  e.respondWith(
    caches.match(e.request).then((res) => {
      if (res) {
        return res;
      }
      return fetch(e.request);
    })
  );
});

async function handleShareTarget(request) {
  const formData = await request.formData();
  const title = formData.get("title");
  const content = formData.get("content");
  const url = formData.get("url");
  const mediaFiles = formData.getAll("media");

  const sharedData = {
    title: title || "",
    content: content || "",
    url: url || "",
    files: [],
  };

  for (const file of mediaFiles) {
    if (file && file.size > 0) {
      const blob = new Blob([await file.arrayBuffer()], { type: file.type });
      const blobUrl = URL.createObjectURL(blob);
      sharedData.files.push(blobUrl);
    }
  }

  const cache = await caches.open("shared-data");
  await cache.put(
    "/shared-data",
    new Response(JSON.stringify(sharedData), {
      headers: { "Content-Type": "application/json" },
    })
  );

  return Response.redirect("/", 303);
}
