if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("./service-worker.js")
      .then((registration) => {
        console.log("ServiceWorker registrado con scope:", registration.scope);

        registration.addEventListener("updatefound", () => {
          const newWorker = registration.installing;
          newWorker.addEventListener("statechange", () => {
            if (
              newWorker.state === "installed" &&
              navigator.serviceWorker.controller
            ) {
              console.log("Nueva versión disponible. Recargando...");
              newWorker.postMessage("skipWaiting");
              window.location.reload(); // 🔄 recarga automática
            }
          });
        });
      })
      .catch((err) => console.log("Error registrando SW:", err));
  });
}
