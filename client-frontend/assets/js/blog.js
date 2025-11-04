const API_BASE = 'https://backend.fusionstructengineering.com';

// Helper to safely get blog image URL
function getBlogImage(blog) {
    if (Array.isArray(blog.image) && blog.image.length > 0) {
        const firstImage = blog.image[0];
        const ext = firstImage.split('.').pop().toLowerCase();
        const imageExtensions = ['png', 'jpg', 'jpeg', 'webp', 'gif'];
        return `https://backend.fusionstructengineering.com${firstImage}`;
        // if (imageExtensions.includes(ext)) {
            
        // }
    }
    // fallback
    return 'assets/images/placeholder.jpg';
}


// Fetch blogs from API
async function fetchBlogs() {
    try {
        const response = await fetch(`${API_BASE}/api/blogs`);
        if (!response.ok) {
            console.error(`API fetch failed with status: ${response.status}`);
            throw new Error(`Failed to fetch blogs: ${response.status}`);
        }
        const data = await response.json();
        return data.map(blog => ({
            ...blog,
            image: Array.isArray(blog.image) ? blog.image : []
        }));
    } catch (error) {
        console.error("Error fetching blogs, using dummy data:", error);
        return null;
    }
}

// Dummy fallback blogs
const dummyBlogs = [
    {
        title: "Designing Modern Infrastructure",
        description: "Learn how FusionStruct optimizes real estate structures for efficiency and sustainability. This article is ideal for engineers, architects, and enthusiasts who want to understand the future of building modern infrastructure.",
        image: ["assets/images/blog1.jpg"], 
        created_at: new Date().toISOString() 
    },
    {
        title: "Smart Urban Development",
        description: "The future of city planning is intelligent. Smart urban development uses IoT, AI, and sustainable practices to create cities that are livable, efficient, and eco-friendly.",
        image: ["assets/images/blog2.jpg"],
        created_at: new Date(Date.now() - 86400000).toISOString()
    },
    {
        title: "Engineering the Future",
        description: "At FusionStruct, we bring precision and innovation to every project. This article highlights engineering breakthroughs, problem-solving methodologies, and advanced analytics.",
        image: ["assets/images/blog3.jpg"],
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
// Main rendering
document.addEventListener("DOMContentLoaded", async () => {
    
    const blogContainer = document.getElementById("blog-container");
    if (!blogContainer) {
        console.error("blog-container not found");
        return;
    }

    const cardTemplate = await loadHTML("components/cards.html");

    let blogs = await fetchBlogs();
    let isFallback = false;

    if (!blogs || blogs.length === 0) {
        console.log("Using dummy data as a fallback.");
        blogs = dummyBlogs;
        isFallback = true;
    }

    if (!blogs || blogs.length === 0) {
        blogContainer.innerHTML = '<p style="text-align:center; padding: 20px;">No blogs available at the moment.</p>';
        return;
    }

    
    const MAX_LENGTH = 150;
    
    blogContainer.innerHTML = blogs
        .map((blog, index) => {

            const shortDescription = blog.description.length > MAX_LENGTH
                ? blog.description.slice(0, MAX_LENGTH) + "..."
                : blog.description;

            const imageUrl = getBlogImage(blog);

            const createdDate = blog.created_at
                ? new Date(blog.created_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric"
                })
                : "Date Unknown";

            // FIX: Use more specific replacement
            let cardHtml = cardTemplate
                .replace(/Dummy Blog Title/g, blog.title)
                .replace(/This is a sample description[\s\S]*?API\./g, shortDescription)
                .replace(/DUMMY_DATE/g, createdDate)
                .replace(/DUMMY_ID/g, blog.id || index);

            // FIX: Replace the image src more carefully
            cardHtml = cardHtml.replace(
                'src="assets/images/placeholder.jpg"', 
                `src="${imageUrl}"`
            );
            return cardHtml;
        })
        .join("");
});