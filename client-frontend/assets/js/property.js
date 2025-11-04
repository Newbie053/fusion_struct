const API_BASE = 'https://backend.fusionstructengineering.com';

// Helper to safely get property image URL
function getPropertyImage(property) {
    if (Array.isArray(property.images) && property.images.length > 0) {
        const firstImage = property.images[0];
        return `https://backend.fusionstructengineering.com${firstImage}`;
    }
    // fallback
    return 'assets/images/placeholder.jpg';
}

// Fetch properties from API
async function fetchProperties() {
    try {
        const response = await fetch(`${API_BASE}/api/properties`);
        if (!response.ok) {
            console.error(`API fetch failed with status: ${response.status}`);
            throw new Error(`Failed to fetch properties: ${response.status}`);
        }
        const data = await response.json();
        return data.map(property => ({
            ...property,
            images: Array.isArray(property.images) ? property.images : []
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
    if (!res.ok) {
        throw new Error(`Failed to fetch ${path}`);
    }
    const text = await res.text();
    return text;
}

// Main rendering
document.addEventListener("DOMContentLoaded", async () => {
    const propertyContainer = document.getElementById("property-container");
    if (!propertyContainer) {
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
        propertyContainer.innerHTML = '<p style="text-align:center; padding: 20px;">No properties available at the moment.</p>';
        return;
    }

    const MAX_LENGTH = 120;
    
    propertyContainer.innerHTML = properties
        .map((property, index) => {
            const shortDescription = property.description && property.description.length > MAX_LENGTH
                ? property.description.slice(0, MAX_LENGTH) + "..."
                : property.description || "No description available";

            const imageUrl = getPropertyImage(property);

            const createdDate = property.created_at
                ? new Date(property.created_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric"
                })
                : "Recently Added";

            // Replace placeholders in template
            let cardHtml = cardTemplate
                .replace(/Dummy Property Title/g, property.title || "Untitled Property")
                .replace(/This is a sample description for the property\./g, shortDescription)
                .replace(/DUMMY_PHONE/g, property.phone || "N/A")
                .replace(/DUMMY_DATE/g, createdDate)
                .replace(/DUMMY_ID/g, property.id || index);

            // Replace image source
            cardHtml = cardHtml.replace(
                'src="assets/images/placeholder.jpg"', 
                `src="${imageUrl}" alt="${property.title}"`
            );

            return cardHtml;
        })
        .join("");
});