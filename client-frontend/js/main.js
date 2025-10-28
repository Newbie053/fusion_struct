const BASE_URL = "https://backend.fusionstructengineering.com/api/admin";

async function loadProperties() {
  const res = await fetch(`${BASE_URL}/properties`);
  const data = await res.json();
  document.getElementById("property-list").innerHTML = data.map(p => `
    <div class="card">
      <img src="${p.image || 'assets/placeholder.jpg'}" alt="${p.title}">
      <h3>${p.title}</h3>
      <p>${p.description?.slice(0,100) || ''}...</p>
    </div>
  `).join('');
}

async function loadBlogs() {
  const res = await fetch(`${BASE_URL}/blogs`);
  const data = await res.json();
  document.getElementById("blog-list").innerHTML = data.map(b => `
    <div class="card">
      <h3>${b.title}</h3>
      <p>${b.content?.slice(0,100) || ''}...</p>
      <a href="vlog-details.html?id=${b.id}">Read more</a>
    </div>
  `).join('');
}

loadProperties();
loadBlogs();
