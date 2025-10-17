(() => {
  if (!("serviceWorker" in navigator)) {
    return;
  }

  let refreshing = false;

  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/service-worker.js")
      .catch((err) => console.error("Service worker registration failed", err));
  });

  navigator.serviceWorker.addEventListener("controllerchange", () => {
    if (refreshing) {
      return;
    }
    refreshing = true;
    window.location.reload();
  });

  navigator.serviceWorker.addEventListener("message", (event) => {
    const data = event.data || {};
    const { photos = [], title = "", text = "", url = "" } = data;
    const status = document.getElementById("status");
    const imagesContainer = document.getElementById("images");
    status.textContent = "";
    imagesContainer.innerHTML = "";
    if (photos.length > 0) {
      photos.forEach((file) => {
        const img = document.createElement("img");
        img.src = URL.createObjectURL(file);
        img.style.maxWidth = "150px";
        img.style.maxHeight = "150px";
        img.style.margin = "5px";
        img.onload = () => URL.revokeObjectURL(img.src);
        imagesContainer.appendChild(img);
      });
    } else {
      status.textContent = "No images found.";
    }
  });
})();
