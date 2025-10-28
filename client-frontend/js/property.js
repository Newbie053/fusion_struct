const BASE_URL = "https://backend.fusionstructengineering.com/api/admin";

async function loadProperties() {
  const res = await fetch(`${BASE_URL}/properties`);
  const data = await res.json();
  document.getElementById("property-list").innerHTML = data.map(p => `
    <div class="card">
      <img src="${p.image || 'assets/placeholder.jpg'}" alt="${p.title}">
      <h3>${p.title}</h3>
      <p>${p.description?.slice(0,150) || ''}...</p>
    </div>
  `).join('');
}

loadProperties();
