// Mostrar/ocultar formularios
document.getElementById("btn-show-register").addEventListener("click", () => {
  document.getElementById("register-form").style.display = "block";
  document.getElementById("auth-buttons").style.display = "none";
});

document.getElementById("btn-show-login").addEventListener("click", () => {
  document.getElementById("login-form").style.display = "block";
  document.getElementById("auth-buttons").style.display = "none";
});

document.getElementById("btn-cancel-register").addEventListener("click", () => {
  document.getElementById("register-form").style.display = "none";
  document.getElementById("auth-buttons").style.display = "block";
});

document.getElementById("btn-cancel-login").addEventListener("click", () => {
  document.getElementById("login-form").style.display = "none";
  document.getElementById("auth-buttons").style.display = "block";
});

// Registro
document.getElementById("form-register").addEventListener("submit", async (e) => {
  e.preventDefault();
  const nombre = document.getElementById("reg-nombre").value;
  const email = document.getElementById("reg-email").value;
  const password = document.getElementById("reg-password").value;

  const res = await fetch("/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nombre, email, password })
  });

  const data = await res.json();
  alert(data.message || "Cuenta creada");
  document.getElementById("register-form").style.display = "none";
  document.getElementById("auth-buttons").style.display = "block";
});

// Login
document.getElementById("form-login").addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;

  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });

  const data = await res.json();

  if (data.token) {
    localStorage.setItem("token", data.token);
    localStorage.setItem("username", data.usuario?.nombre || email);
    mostrarUsuario(data.usuario?.nombre || email);
  } else {
    alert(data.error || "Error al iniciar sesión");
  }
});

// Logout
document.getElementById("btn-logout").addEventListener("click", () => {
  localStorage.removeItem("token");
  localStorage.removeItem("username");
  document.getElementById("auth-buttons").style.display = "block";
  document.getElementById("user-info").style.display = "none";
});

// Mostrar usuario si ya está logueado
document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username");
  if (token && username) {
    mostrarUsuario(username);
  }
});

function mostrarUsuario(nombre) {
  document.getElementById("auth-buttons").style.display = "none";
  document.getElementById("login-form").style.display = "none";
  document.getElementById("register-form").style.display = "none";
  document.getElementById("user-info").style.display = "block";
  document.getElementById("username").textContent = nombre;
}