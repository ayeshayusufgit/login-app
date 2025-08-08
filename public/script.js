let isLogin = true; // toggle state

const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const message = document.getElementById("message");
const emailCounter = document.getElementById("emailCounter");
const submitBtn = document.getElementById("submitBtn");
const toggleForm = document.getElementById("toggleForm");
const toggleText = document.getElementById("toggleText");
const formTitle = document.getElementById("form-title");

// Live email character counter
emailInput.addEventListener("input", () => {
    const maxLength = 50;
    const remaining = maxLength - emailInput.value.length;
    emailCounter.textContent = `${remaining} characters left`;
});

// Toggle between login/register
toggleForm.addEventListener("click", (e) => {
    e.preventDefault();
    isLogin = !isLogin;
    formTitle.textContent = isLogin ? "Login" : "Register";
    submitBtn.textContent = isLogin ? "Login" : "Register";
    toggleText.textContent = isLogin
        ? "Don't have an account?"
        : "Already have an account?";
    toggleForm.textContent = isLogin ? "Register here" : "Login here";
    message.textContent = "";
});

// Handle submit
submitBtn.addEventListener("click", async () => {
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    // Clear previous message
    message.textContent = "";
    message.className = "";

    // Frontend validation
    if (email.length > 50) {
        message.textContent = "Email cannot exceed 50 characters.";
        message.className = "error";
        return;
    }
    if (password.length < 8 || password.length > 20) {
        message.textContent = "Password must be between 8 and 20 characters.";
        message.className = "error";
        return;
    }

    // Example API call (replace with your backend endpoint)
    try {
        const endpoint = isLogin ? "/login" : "/register";
        const res = await fetch(endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });

        const data = await res.json();

        if (res.ok) {
            message.textContent = data.message || (isLogin ? "Login successful" : "Registration successful");
            message.className = "success";
        } else {
            message.textContent = data.message || "Something went wrong";
            message.className = "error";
        }
    } catch (error) {
        message.textContent = "Server error. Please try again.";
        message.className = "error";
    }
});