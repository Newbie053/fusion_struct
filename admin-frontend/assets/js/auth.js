// assets/js/auth.js

// Check if user is logged in or not
function checkAuth() {
  const token = getToken();
  const currentPage = window.location.pathname.split("/").pop();

  if (!token && currentPage !== "login.html") {
    window.location.href = "login.html";
    return false;
  }

  if (token && currentPage === "login.html") {
    window.location.href = "index.html";
    return false;
  }

  return true;
}

// Logout
function logout() {
  clearToken();
  window.location.href = "login.html";
}

// Open/Close modal
function openChangePasswordModal() {
  document.getElementById("changePasswordModal").classList.remove("hidden");
}

function closeChangePasswordModal() {
  document.getElementById("changePasswordModal").classList.add("hidden");
  document.getElementById("changePasswordStatus").textContent = "";
  document.getElementById("newPassword").value = "";
  document.getElementById("confirmPassword").value = "";
}

// Handle login
async function handleLogin(e) {
  e.preventDefault();

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!username || !password) {
    Swal.fire("Error", "Please enter username and password", "error");
    return;
  }

  try {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });

    const data = await res.json();

    if (res.ok) {
      setToken(data.token);
      Swal.fire({
        icon: "success",
        title: "Login Successful",
        showConfirmButton: false,
        timer: 1000
      }).then(() => {
        window.location.href = "index.html";
      });
    } else {
      Swal.fire("Login Failed", data.message || "Invalid credentials", "error");
    }
  } catch (err) {
    Swal.fire("Error", "Server not reachable", "error");
  }
}

// Submit new password
async function submitChangePassword() {
  const newPassword = document.getElementById("newPassword").value;
  const confirmPassword = document.getElementById("confirmPassword").value;
  const status = document.getElementById("changePasswordStatus");

  if (!newPassword || !confirmPassword) {
    status.textContent = "Please fill all fields";
    status.style.color = "red";
    return;
  }

  if (newPassword !== confirmPassword) {
    status.textContent = "Passwords do not match";
    status.style.color = "red";
    return;
  }

  try {
    const token = getToken(); // JWT stored in localStorage
    const res = await fetch(`${BASE_URL}/auth/change-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ newPassword, confirmPassword })
    });

    const data = await res.json();

    if (data.success) {
      status.textContent = data.message;
      status.style.color = "green";
      setTimeout(closeChangePasswordModal, 1500);
    } else {
      status.textContent = data.message || "Failed to update password";
      status.style.color = "red";
    }
  } catch (err) {
    console.error(err);
    status.textContent = "Error updating password";
    status.style.color = "red";
  }
}
