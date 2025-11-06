// assets/js/api.js

// const BASE_URL = "https://backend.fusionstructengineering.com/api";
const BASE_URL = "https://backend.fusionstructengineering.com/api";
// const BASE_URL = "http://localhost:5000/api";

//const BASE_URL = "http://localhost:5000/api";
export async function fetchBlogs() {
  try {
    const res = await fetch(`${BASE_URL}/blogs`);
    const data = await res.json();
    return data;
  } catch (err) {
    console.error("Error fetching blogs:", err);
    return [];
  }
}

export async function fetchProperties() {
  try {
    const res = await fetch(`${BASE_URL}/properties`);
    const data = await res.json();
    return data;
  } catch (err) {
    console.error("Error fetching properties:", err);
    return [];
  }
}
