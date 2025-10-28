const form = document.getElementById("contact-form");
const responseEl = document.getElementById("response");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const data = {
    name: document.getElementById("name").value,
    email: document.getElementById("email").value,
    message: document.getElementById("message").value,
  };

  try {
    const res = await fetch("https://backend.fusionstructengineering.com/api/admin/contacts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      responseEl.textContent = "✅ Message sent successfully!";
      form.reset();
    } else {
      responseEl.textContent = "❌ Failed to send message.";
    }
  } catch {
    responseEl.textContent = "⚠️ Network error.";
  }
});
