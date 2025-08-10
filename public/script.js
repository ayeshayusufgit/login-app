const backendURL = "http://localhost:5000/api/auth"; // Update as needed

const form = document.getElementById("authForm");
const formTitle = document.getElementById("formTitle");
const toggleLink = document.getElementById("toggleLink");
const toggleText = document.getElementById("toggleText");
const submitBtn = document.getElementById("submitBtn");

const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const emailError = document.getElementById("emailError");
const passwordError = document.getElementById("passwordError");
const message = document.getElementById("message");

let isLogin = true;

// Validation helpers
function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function validatePassword(password) {
  // 6-20 chars, at least 1 letter and 1 number
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,20}$/;
  return passwordRegex.test(password);
}

function clearErrors() {
  emailError.textContent = "";
  passwordError.textContent = "";
  message.textContent = "";
  message.className = "";
}

// Toggle between Login and Register form
toggleLink.addEventListener("click", (e) => {
  e.preventDefault();
  isLogin = !isLogin;

  formTitle.textContent = isLogin ? "Login" : "Register";
  submitBtn.textContent = isLogin ? "Login" : "Register";
  toggleText.textContent = isLogin ? "Don't have an account?" : "Already have an account?";
  toggleLink.textContent = isLogin ? "Register here" : "Login here";

  clearErrors();
  emailInput.value = "";
  passwordInput.value = "";
  emailInput.focus();
});

// Real-time validation on inputs
emailInput.addEventListener("input", () => {
  if (!validateEmail(emailInput.value)) {
    emailError.textContent = "Please enter a valid email address.";
  } else {
    emailError.textContent = "";
  }
});

passwordInput.addEventListener("input", () => {
  if (!validatePassword(passwordInput.value)) {
    passwordError.textContent = "Password must be 6-20 chars, include letters and numbers.";
  } else {
    passwordError.textContent = "";
  }
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  clearErrors();

  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

  let valid = true;

  if (!validateEmail(email)) {
    emailError.textContent = "Please enter a valid email address.";
    valid = false;
  }

  if (!validatePassword(password)) {
    passwordError.textContent = "Password must be 6-20 chars, include letters and numbers.";
    valid = false;
  }

  if (!valid) return;

  try {
    const endpoint = isLogin ? "login" : "register";

    const res = await fetch(`${backendURL}/${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      message.textContent = data.message || "Something went wrong.";
      message.className = "error";
      return;
    }

    message.textContent = data.message || (isLogin ? "Login successful!" : "Registered successfully!");
    message.className = "success";

    if (isLogin) {
      // Optionally redirect or clear form on login success
      form.reset();
    } else {
      // Clear form after registration and switch to login
      form.reset();
      toggleLink.click();
    }
  } catch (error) {
    message.textContent = "Server error. Please try again.";
    message.className = "error";
    console.error("Error:", error);
  }
});