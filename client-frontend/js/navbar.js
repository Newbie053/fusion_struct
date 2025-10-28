// Dynamically load the navbar
document.addEventListener("DOMContentLoaded", async () => {
  const header = document.querySelector("header");
  if (header) {
    const res = await fetch("components/navbar.html");
    const html = await res.text();
    header.innerHTML = html;

    // highlight active page
    const current = window.location.pathname.split("/").pop();
    document.querySelectorAll(".nav-links a").forEach(link => {
      if (link.getAttribute("href") === current) link.classList.add("active");
    });
  }
});
