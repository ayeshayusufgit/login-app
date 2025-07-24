document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("auth-form");
  const heading = document.getElementById("form-heading");
  const toggleText = document.getElementById("toggle-text");
  const submitBtn = document.getElementById("submit-btn");
  const confirmPasswordInput = document.getElementById("confirm-password");
  const messageDiv = document.getElementById("message");

  let isLogin = true;

  function updateForm() {
    heading.innerText = isLogin ? "Login" : "Register";
    submitBtn.innerText = isLogin ? "Login" : "Register";
    confirmPasswordInput.style.display = isLogin ? "none" : "block";

    toggleText.innerHTML = isLogin
      ? `Don't have an account? <a href="#" id="toggle-link">Register</a>`
      : `Already have an account? <a href="#" id="toggle-link">Login</a>`;

    // Reattach toggle listener
    document.getElementById("toggle-link").addEventListener("click", (e) => {
      e.preventDefault();
      isLogin = !isLogin;
      updateForm();
      clearMessage();
      form.reset();
    });
  }

  updateForm(); // Initial setup

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    clearMessage();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const confirmPassword = document.getElementById("confirm-password").value.trim();

    if (!email || !password || (!isLogin && !confirmPassword)) {
      showMessage("Please fill in all fields", "error");
      return;
    }

    if (!isLogin && password !== confirmPassword) {
      showMessage("Passwords do not match", "error");
      return;
    }

    try {
      const res = await fetch(`/api/auth/${isLogin ? "login" : "register"}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Request failed");

      showMessage(data.message || "Success", "success");
      form.reset();
    } catch (err) {
      showMessage(err.message, "error");
    }
  });

  function showMessage(msg, type) {
    messageDiv.innerText = msg;
    messageDiv.className = type;
  }

  function clearMessage() {
    messageDiv.innerText = "";
    messageDiv.className = "";
  }
});