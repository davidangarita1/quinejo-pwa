window.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const title = params.get("title");
  const content = params.get("content");
  const url = params.get("url");

  if (title || content || url) {
    document.querySelector("#shared").style.display = "block";
    document.querySelector("#sharedContent").textContent = `Título: ${
      title || "-"
    }\nTexto: ${content || "-"}\nURL: ${url || "-"}`;
  }
});
