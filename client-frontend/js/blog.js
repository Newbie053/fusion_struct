const BASE_URL = "https://backend.fusionstructengineering.com/api/admin";

async function loadBlogs() {
  const res = await fetch(`${BASE_URL}/blogs`);
  const data = await res.json();
  document.getElementById("blog-list").innerHTML = data.map(b => `
    <div class="card">
      <h3>${b.title}</h3>
      <p>${b.content?.slice(0,150) || ''}...</p>
      <a href="vlog-details.html?id=${b.id}">Read More</a>
    </div>
  `).join('');
}

loadBlogs();
