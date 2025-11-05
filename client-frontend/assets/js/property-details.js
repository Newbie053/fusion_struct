const API_BASE = 'https://backend.fusionstructengineering.com';

// Helper to get property image
function getPropertyImage(property) {
    if (Array.isArray(property.images) && property.images.length > 0) {
        const firstImage = property.images[0];
        return firstImage.startsWith("http") ? firstImage : `${API_BASE}${firstImage}`;
    }
    return 'assets/images/placeholder.jpg';
}

// Main rendering
document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("property-details");
    if (!container) return;

    const storedProperty = sessionStorage.getItem("selectedProperty");
    if (!storedProperty) {
        container.innerHTML = `<div class="p-10 text-center text-red-500">No property selected.</div>`;
        return;
    }

    const property = JSON.parse(storedProperty);

    const imageUrl = getPropertyImage(property);

    const createdDate = property.created_at
        ? new Date(property.created_at).toLocaleDateString("en-US", { year:"numeric", month:"long", day:"numeric" })
        : "Recently Added";

    container.innerHTML = `
        <div class="relative">
            <img src="${imageUrl}" alt="${property.title}" class="w-full h-[400px] object-cover" />
            <div class="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                <h1 class="text-4xl md:text-5xl font-bold text-white drop-shadow-lg text-center px-4">${property.title}</h1>
            </div>
        </div>

        <article class="p-10 space-y-6">
            <p class="text-gray-500 text-sm">${createdDate}</p>
            <div class="prose max-w-none leading-relaxed text-lg">
                <p>${property.description || "No description available."}</p>
                <p><strong>Phone:</strong> ${property.phone || "N/A"}</p>
            </div>
            <a href="property.html" class="inline-block mt-8 text-blue-600 hover:text-blue-800 font-semibold">← Back to Properties</a>
        </article>
    `;
});
