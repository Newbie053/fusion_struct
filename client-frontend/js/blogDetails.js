const BASE_URL = "https://backend.fusionstructengineering.com/api/admin";

const params = new URLSearchParams(window.location.search);
const id = params.get("id");

async function loadBlog() {
  if (!id) return;
  const res = await fetch(`${BASE_URL}/blogs/${id}`);
  const blog = await res.json();

  document.getElementById("blog-detail").innerHTML = `
    <h1>${blog.title}</h1>
    <p>${blog.content}</p>
  `;
}

loadBlog();
