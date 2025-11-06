const API_BASE = 'https://backend.fusionstructengineering.com';

// Helper to safely get property image URL - IMPROVED VERSION
function getPropertyImage(property) {
    if (Array.isArray(property.images) && property.images.length > 0) {
        // Filter only actual image files
        const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg'];
        
        for (let imagePath of property.images) {
            const ext = imagePath.split('.').pop().toLowerCase();
            if (imageExtensions.includes(ext)) {
                return imagePath.startsWith("http")
                    ? imagePath
                    : `${API_BASE}${imagePath}`;
            }
        }
    }
    // fallback - return placeholder if no valid image found
    return 'assets/images/placeholder.jpg';
}

// Fetch properties from API
async function fetchProperties() {
    try {
        const response = await fetch(`${API_BASE}/api/properties`);
        if (!response.ok) throw new Error(`API fetch failed: ${response.status}`);
        const data = await response.json();
        // Ensure images is always an array
        return data.map(p => ({
            ...p,
            images: Array.isArray(p.images) ? p.images : []
        }));
    } catch (error) {
        console.error("Error fetching properties, using dummy data:", error);
        return null;
    }
}

// Dummy fallback properties
const dummyProperties = [
    {
        id: 1,
        title: "Luxury Apartment in Banani",
        description: "3BHK luxury apartment near Banani Lake. Fully furnished with modern amenities and beautiful lake view.",
        phone: "01711-123456",
        images: ["assets/images/sample1.jpg"],
        created_at: new Date().toISOString()
    },
    {
        id: 2,
        title: "Commercial Space in Gulshan",
        description: "Modern commercial floor available for rent in prime Gulshan location. Perfect for offices or retail.",
        phone: "01822-654321",
        images: ["assets/images/sample2.jpg"],
        created_at: new Date(Date.now() - 86400000).toISOString()
    },
    {
        id: 3,
        title: "Residential Building in Mirpur",
        description: "Affordable housing in Mirpur with excellent connectivity and community facilities.",
        phone: "01999-332211",
        images: ["assets/images/sample3.jpg"],
        created_at: new Date(Date.now() - 172800000).toISOString()
    }
];

// Load HTML template for cards
async function loadHTML(path) {
    const res = await fetch(path);
    if (!res.ok) throw new Error(`Failed to fetch ${path}`);
    return await res.text();
}

// Store properties globally
let globalProperties = [];

// Function to handle read more click
function handleReadMore(property) {
    console.log("Storing property in sessionStorage:", property.title);
    sessionStorage.setItem("selectedProperty", JSON.stringify(property));
    window.location.href = "property-details.html";
}

// Direct event listener approach
function setupReadMoreButtons() {
    const readMoreButtons = document.querySelectorAll('.read-more-btn');
    console.log(`Found ${readMoreButtons.length} read more buttons`);
    
    readMoreButtons.forEach((button, index) => {
        // Remove any existing event listeners to avoid duplicates
        button.replaceWith(button.cloneNode(true));
    });
    
    // Re-select after cloning
    const freshButtons = document.querySelectorAll('.read-more-btn');
    
    freshButtons.forEach((button, index) => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log(`Read More button ${index} clicked`);
            
            if (globalProperties[index]) {
                handleReadMore(globalProperties[index]);
            } else {
                console.error(`No property found at index ${index}`);
                alert("Error: Could not load property details.");
            }
        });
        
        // Add visual feedback
        button.style.cursor = 'pointer';
    });
}

// Main rendering - UPDATED WITH BETTER DEBUGGING
document.addEventListener("DOMContentLoaded", async () => {
    const container = document.getElementById("property-container");
    if (!container) {
        console.error("property-container not found");
        return;
    }

    const cardTemplate = await loadHTML("components/propertycard.html");
    
    let properties = await fetchProperties();
    let isFallback = false;

    if (!properties || properties.length === 0) {
        console.log("Using dummy data as a fallback.");
        properties = dummyProperties;
        isFallback = true;
    }

    if (!properties || properties.length === 0) {
        container.innerHTML = `<p class="text-center py-10 text-gray-500">No properties available at the moment.</p>`;
        return;
    }

    // Store properties globally
    globalProperties = properties;

    const MAX_LENGTH = 120;

    // Render properties with better debugging
    container.innerHTML = properties
        .map((p, index) => {
            const desc = p.description?.length > MAX_LENGTH
                ? p.description.slice(0, MAX_LENGTH) + "..."
                : p.description || "No description available";

            const imageUrl = getPropertyImage(p);
            console.log(`Property ${index}:`, {
                title: p.title,
                images: p.images,
                finalImageUrl: imageUrl
            });

            const createdDate = p.created_at
                ? new Date(p.created_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric"
                })
                : "Date Unknown"; // Matched blog.js fallback text

            // SIMPLE REPLACEMENT - EXACTLY LIKE BLOG.JS
            let html = cardTemplate
                .replace(/Dummy Property Title/g, p.title || "Untitled Property")
                .replace(/This is a sample description for the property\./g, desc)
                .replace(/DUMMY_PHONE/g, p.phone || "N/A")
                .replace(/DUMMY_DATE/g, createdDate)
                .replace(/DUMMY_ID/g, p.id || index)
                .replace('src="assets/images/placeholder.jpg"', `src="${imageUrl}" alt="${p.title || 'Property Image'}"`);

            return html;
        })
        .join("");

    // Setup event listeners after a short delay to ensure DOM is ready
    setTimeout(() => {
        setupReadMoreButtons();
    }, 100);
});