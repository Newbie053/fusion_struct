const API_BASE = 'https://backend.fusionstructengineering.com';

// Helper to safely get blog image URL
function getBlogImage(blog) {
    if (Array.isArray(blog.image) && blog.image.length > 0) {
        const firstImage = blog.image[0];
        return firstImage.startsWith("http") ? firstImage : `${API_BASE}${firstImage}`;
    }
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
        title: "Designing Modern Infrastructure",
        description: "Learn how FusionStruct optimizes real estate structures for efficiency and sustainability...",
        content: "<p>Full content for Designing Modern Infrastructure...</p>",
        image: ["assets/images/blog1.jpg"], 
        created_at: new Date().toISOString() 
    },
    {
        title: "Smart Urban Development",
        description: "The future of city planning is intelligent. Smart urban development uses IoT, AI, and sustainable practices...",
        content: "<p>Full content for Smart Urban Development...</p>",
        image: ["assets/images/blog2.jpg"],
        created_at: new Date(Date.now() - 86400000).toISOString()
    },
    {
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

            let cardHtml = cardTemplate
                .replace(/Dummy Blog Title/g, blog.title)
                .replace(/This is a sample description[\s\S]*?API\./g, shortDescription)
                .replace(/DUMMY_DATE/g, createdDate)
                .replace(/DUMMY_ID/g, blog.id || index);

            cardHtml = cardHtml.replace(
                'src="assets/images/placeholder.jpg"', 
                `src="${imageUrl}"`
            );
            return cardHtml;
        })
        .join("");

    // ----- Add Read More functionality -----
    const readMoreBtns = document.querySelectorAll(".read-more-btn");
    readMoreBtns.forEach((btn, idx) => {
        btn.addEventListener("click", (e) => {
            e.preventDefault();
            const selectedBlog = blogs[idx];
            if (!selectedBlog) return alert("Blog not found");
            sessionStorage.setItem("selectedBlog", JSON.stringify(selectedBlog));
            window.location.href = "blog-details.html";
        });
    });

    // Make blogs accessible globally for safety
    window.blogs = blogs;
});
