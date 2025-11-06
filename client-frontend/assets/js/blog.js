const API_BASE = 'https://backend.fusionstructengineering.com';

// Helper to safely get blog image URL - IMPROVED VERSION
function getBlogImage(blog) {
    if (Array.isArray(blog.image) && blog.image.length > 0) {
        // Filter only actual image files
        const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg'];
        
        for (let imagePath of blog.image) {
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

// Fetch blogs from API
async function fetchBlogs() {
    try {
        const response = await fetch(`${API_BASE}/api/blogs`);
        if (!response.ok) throw new Error(`Failed to fetch blogs: ${response.status}`);
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
        id: 1,
        title: "Designing Modern Infrastructure",
        description: "Learn how FusionStruct optimizes real estate structures for efficiency and sustainability...",
        content: "<p>Full content for Designing Modern Infrastructure...</p>",
        image: ["assets/images/blog1.jpg"], 
        created_at: new Date().toISOString() 
    },
    {
        id: 2,
        title: "Smart Urban Development",
        description: "The future of city planning is intelligent. Smart urban development uses IoT, AI, and sustainable practices...",
        content: "<p>Full content for Smart Urban Development...</p>",
        image: ["assets/images/blog2.jpg"],
        created_at: new Date(Date.now() - 86400000).toISOString()
    },
    {
        id: 3,
        title: "Engineering the Future",
        description: "At FusionStruct, we bring precision and innovation to every project...",
        content: "<p>Full content for Engineering the Future...</p>",
        image: ["assets/images/blog3.jpg"],
        created_at: new Date(Date.now() - 172800000).toISOString()
    }
];

// Load HTML template for cards
async function loadHTML(path) {
    const res = await fetch(path);
    if (!res.ok) throw new Error(`Failed to fetch ${path}`);
    return await res.text();
}

// Store blogs globally
let globalBlogs = [];

// Function to handle read more click
function handleReadMore(blog) {
    console.log("Storing blog in sessionStorage:", blog.title);
    sessionStorage.setItem("selectedBlog", JSON.stringify(blog));
    window.location.href = "blog-details.html";
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
            
            if (globalBlogs[index]) {
                handleReadMore(globalBlogs[index]);
            } else {
                console.error(`No blog found at index ${index}`);
                alert("Error: Could not load blog details.");
            }
        });
        
        // Add visual feedback
        button.style.cursor = 'pointer';
    });
}

// Main rendering - UPDATED WITH BETTER DEBUGGING
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

    // Store blogs globally
    globalBlogs = blogs;

    const MAX_LENGTH = 150;

    // Render blogs with better debugging
    blogContainer.innerHTML = blogs
        .map((blog, index) => {
            const shortDescription = blog.description.length > MAX_LENGTH
                ? blog.description.slice(0, MAX_LENGTH) + "..."
                : blog.description;

            const imageUrl = getBlogImage(blog);
            console.log(`Blog ${index}:`, {
                title: blog.title,
                images: blog.image,
                finalImageUrl: imageUrl
            });

            const createdDate = blog.created_at
                ? new Date(blog.created_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric"
                })
                : "Date Unknown";

            // SIMPLE REPLACEMENT - EXACTLY LIKE PROPERTY.JS
            let html = cardTemplate
                .replace(/Dummy Blog Title/g, blog.title)
                .replace(/This is a sample description[\s\S]*?API\./g, shortDescription)
                .replace(/DUMMY_DATE/g, createdDate)
                .replace(/DUMMY_ID/g, blog.id || index)
                .replace('src="assets/images/placeholder.jpg"', `src="${imageUrl}"`);

            return html;
        })
        .join("");

    // Setup event listeners after a short delay to ensure DOM is ready
    setTimeout(() => {
        setupReadMoreButtons();
    }, 100);
});