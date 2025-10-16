window.addEventListener("DOMContentLoaded", async () => {
  const cache = await caches.open("shared-data");
  const response = await cache.match("/shared-data");

  if (response) {
    const data = await response.json();
    await cache.delete("/shared-data");

    showSharedContent(data);
    return;
  }

  const params = new URLSearchParams(window.location.search);
  const title = params.get("title");
  const content = params.get("content");
  const url = params.get("url");

  if (title || content || url) {
    showSharedContent({ title, content, url });
  }
});

function showSharedContent(data) {
  const { title, content, url, files } = data;

  let html = `<h2>Contenido compartido</h2>`;

  if (title) html += `<p><strong>Título:</strong> ${title}</p>`;
  if (content) html += `<p><strong>Texto:</strong> ${content}</p>`;
  if (url) html += `<p><strong>URL:</strong> <a href="${url}" target="_blank">${url}</a></p>`;

  if (files && files.length > 0) {
    html += `<div id="sharedImages">`;
    files.forEach((fileUrl) => {
      html += `<img src="${fileUrl}" style="max-width: 100%; margin: 10px 0; border-radius: 8px;" />`;
    });
    html += `</div>`;
  }

  let container = document.querySelector("#shared");
  if (!container) {
    container = document.createElement("div");
    container.id = "shared";
    document.querySelector("main").prepend(container);
  }

  container.style.display = "block";
  container.innerHTML = html;
}
