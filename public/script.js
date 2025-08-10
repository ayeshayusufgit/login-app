let isLogin = false;

document.getElementById("toggle-btn").addEventListener("click", () => {
  isLogin = !isLogin;
  document.getElementById("form-title").textContent = isLogin ? "Login" : "Register";
  document.getElementById("submit-btn").textContent = isLogin ? "Login" : "Register";
  document.getElementById("toggle-text").textContent = isLogin
    ? "Don't have an account?"
    : "Already have an account?";
  document.getElementById("toggle-btn").textContent = isLogin ? "Register" : "Login";
  document.getElementById("message").textContent = "";
});

document.getElementById("auth-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const messageEl = document.getElementById("message");

  try {
    const res = await fetch(`/api/auth/${isLogin ? 'login' : 'register'}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (res.ok) {
      messageEl.textContent = data.message;
      messageEl.className = "success";
    } else {
      messageEl.textContent = data.error || "Something went wrong";
      messageEl.className = "error";
    }
  } catch (err) {
    console.error(err);
    messageEl.textContent = "Server error";
    messageEl.className = "error";
  }
});
