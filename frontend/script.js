const API = "http://localhost:5000/api";

async function register() {
  const email = document.getElementById("regEmail").value;
  const password = document.getElementById("regPass").value;
  const res = await fetch(`${API}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });
  const data = await res.json();
  document.getElementById("regMsg").innerText = data.message || data.error;
  console.log(data);
}

async function login() {
  const email = document.getElementById("logEmail").value;
  const password = document.getElementById("logPass").value;
  const res = await fetch(`${API}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });
  const data = await res.json();
  document.getElementById("logMsg").innerText = data.message || data.error;
  console.log(data);
}