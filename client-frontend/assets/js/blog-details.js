// document.addEventListener("DOMContentLoaded", () => {
//   const container = document.getElementById("blog-details");
//   if (!container) return;

//   const storedBlog = sessionStorage.getItem("selectedBlog");
//   if (!storedBlog) {
//     container.innerHTML = `<div class="p-10 text-center text-red-500">No blog selected.</div>`;
//     return;
//   }

//   const blog = JSON.parse(storedBlog);

//   const imageUrl = Array.isArray(blog.image) && blog.image.length > 0
//     ? (blog.image[0].startsWith("http") ? blog.image[0] : `assets/images/${blog.image[0]}`)
//     : "assets/images/placeholder.jpg";

//   const createdDate = blog.created_at
//     ? new Date(blog.created_at).toLocaleDateString("en-US", { year:"numeric", month:"long", day:"numeric" })
//     : "Date Unknown";

//   container.innerHTML = `
//     <div class="relative">
//       <img src="${imageUrl}" alt="${blog.title}" class="w-full h-[400px] object-cover" />
//       <div class="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
//         <h1 class="text-4xl md:text-5xl font-bold text-white drop-shadow-lg text-center px-4">${blog.title}</h1>
//       </div>
//     </div>

//     <article class="p-10 space-y-6">
//       <p class="text-gray-500 text-sm">${createdDate}</p>
//       <div class="prose max-w-none leading-relaxed text-lg">
//         ${blog.content || "<p>No content available.</p>"}
//       </div>
//       <a href="blog.html" class="inline-block mt-8 text-blue-600 hover:text-blue-800 font-semibold">← Back to Blogs</a>
//     </article>
//   `;
// });

document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("blog-details");
    if (!container) return;

    const storedBlog = sessionStorage.getItem("selectedBlog");
    console.log("Stored blog from sessionStorage:", storedBlog);
    
    if (!storedBlog) {
        container.innerHTML = `
            <div class="p-10 text-center">
                <p class="text-red-500 text-lg mb-4">No blog selected.</p>
                <a href="blog.html" class="inline-block mt-4 text-blue-600 hover:text-blue-800 font-semibold">
                    ← Back to Blogs
                </a>
            </div>`;
        return;
    }

    try {
        const blog = JSON.parse(storedBlog);
        console.log("Parsed blog:", blog);

        const API_BASE = 'https://backend.fusionstructengineering.com';
        let imageUrl = "assets/images/placeholder.jpg";
        
        if (Array.isArray(blog.image) && blog.image.length > 0) {
            const firstImage = blog.image[0];
            console.log("Raw image path from API:", firstImage);
            
            if (firstImage.startsWith("http")) {
                imageUrl = firstImage;
            } else if (firstImage.startsWith("/")) {
                imageUrl = `${API_BASE}${firstImage}`;
            } else {
                imageUrl = `${API_BASE}/${firstImage}`;
            }
        }
        
        console.log("Final image URL:", imageUrl);

        const createdDate = blog.created_at
            ? new Date(blog.created_at).toLocaleDateString("en-US", { year:"numeric", month:"long", day:"numeric" })
            : "Date Unknown";

        container.innerHTML = `
            <div class="relative">
                <img src="${imageUrl}" alt="${blog.title}" class="w-full h-[400px] object-cover" onerror="this.src='assets/images/placeholder.jpg'" />
                <div class="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                    <h1 class="text-4xl md:text-5xl font-bold text-white drop-shadow-lg text-center px-4">${blog.title}</h1>
                </div>
            </div>

            <article class="p-10 space-y-6">
                <p class="text-gray-500 text-sm">${createdDate}</p>
                <div class="prose max-w-none leading-relaxed text-lg">
                    ${blog.content || blog.description || "<p>No content available.</p>"}
                </div>
                <a href="blog.html" class="inline-block mt-8 text-blue-600 hover:text-blue-800 font-semibold">← Back to Blogs</a>
            </article>
        `;
    } catch (error) {
        console.error("Error parsing blog data:", error);
        container.innerHTML = `<div class="p-10 text-center text-red-500">Error loading blog content.</div>`;
    }
});