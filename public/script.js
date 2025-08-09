const form = document.getElementById('authForm');
const toggleLink = document.getElementById('toggleLink');
const formTitle = document.getElementById('formTitle');
const toggleText = document.getElementById('toggleText');
const message = document.getElementById('message');

let isLogin = true;

toggleLink.addEventListener('click', (e) => {
  e.preventDefault();
  isLogin = !isLogin;
  formTitle.textContent = isLogin ? 'Login' : 'Register';
  toggleText.textContent = isLogin ? "Don't have an account?" : "Already have an account?";
  toggleLink.textContent = isLogin ? 'Register here' : 'Login here';
  message.textContent = '';
  message.className = '';
});

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  message.textContent = '';
  message.className = '';

  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();

  // Basic email format check
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    message.textContent = 'Invalid email format';
    message.className = 'error';
    return;
  }
  if (password.length < 6 || password.length > 20) {
    message.textContent = 'Password must be 6-20 characters';
    message.className = 'error';
    return;
  }

  const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';

  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();

    if (res.ok) {
      message.textContent = data.message;
      message.className = 'success';
      if (isLogin) {
        // optionally redirect on login success after delay
        setTimeout(() => {
          window.location.href = '/welcome.html'; // create welcome.html if you want
        }, 1500);
      }
    } else {
      message.textContent = data.message;
      message.className = 'error';
    }
  } catch (err) {
    message.textContent = 'Server error. Please try again later.';
    message.className = 'error';
  }
});