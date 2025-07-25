const form = document.getElementById("auth-form");
const toggleLink = document.getElementById("toggle-link");
const toggleText = document.getElementById("toggle-text");
const formTitle = document.getElementById("form-title");
const confirmPasswordInput = document.getElementById("confirm-password");
const submitBtn = document.getElementById("submit-btn");
const messageBox = document.getElementById("message");

let isLogin = true;

function showMessage(type, text) {
  messageBox.className = `message ${type}`;
  messageBox.textContent = text;
  messageBox.style.display = "block";
}

function clearMessage() {
  messageBox.textContent = "";
  messageBox.style.display = "none";
}

function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function updateToggleText() {
  toggleText.innerHTML = isLogin
    ? `Don't have an account? <a href="#" id="toggle-link">Register</a>`
    : `Already have an account? <a href="#" id="toggle-link">Login</a>`;
  document.getElementById("toggle-link").addEventListener("click", toggleForm);
}

function toggleForm(e) {
  e.preventDefault();
  isLogin = !isLogin;

  formTitle.textContent = isLogin ? "Login" : "Register";
  submitBtn.textContent = isLogin ? "Login" : "Register";
  confirmPasswordInput.style.display = isLogin ? "none" : "block";

  clearMessage();
  updateToggleText();
}

toggleLink.addEventListener("click", toggleForm);

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  clearMessage();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const confirmPassword = document.getElementById("confirm-password").value.trim();

  if (!validateEmail(email)) {
    showMessage("error", "Please enter a valid email address.");
    return;
  }

  if (!password || (!isLogin && password !== confirmPassword)) {
    showMessage("error", isLogin ? "Password is required." : "Passwords do not match.");
    return;
  }

  try {
    const endpoint = isLogin ? "/api/auth/login" : "/api/auth/register";
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.message || "Something went wrong.");

    showMessage("success", data.message || (isLogin ? "Login successful!" : "Registered successfully!"));
  } catch (err) {
    showMessage("error", err.message);
  }
});