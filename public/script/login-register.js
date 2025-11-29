document.addEventListener("DOMContentLoaded", () => {
  const formLogin = document.getElementById("form-login");
  const formRegister = document.getElementById("form-register");

  // REGISTRO
  if (formRegister) {
    formRegister.addEventListener("submit", async (e) => {
      e.preventDefault();

      const nombre = document.getElementById("nombre").value.trim();
      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value;

      try {
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nombre, email, password })
        });

        const data = await res.json();

        if (res.ok) {
          console.log("Nombre: ", data.nombre);
          alert(data.message || "Cuenta creada 🎉");
          // Redirige al login después de registrarse
          window.location.href = "../login.html";
        } else {
          alert(data.error || "Error en registro");
        }
      } catch (err) {
        console.error(err);
        alert("Error de conexión con el servidor");
      }
    });
  }

  // LOGIN
  if (formLogin) {
    formLogin.addEventListener("submit", async (e) => {
      e.preventDefault();

      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value;

      try {
        const res = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password })
        });

        const data = await res.json();

        if (res.ok && data.token) {
          localStorage.setItem("token", data.token);
          console.log("Usuario: ", data.usuario);
          console.log("Resultado: ", data.usuario?.nombre_usuario);
          localStorage.setItem("username", data.usuario?.nombre_usuario || email);
          alert("Login exitoso ✅");
          window.location.href = "/";
        } else {
          alert(data.error || "Error al iniciar sesión");
        }
      } catch (err) {
        console.error(err);
        alert("Error de conexión con el servidor");
      }
    });
  }
});