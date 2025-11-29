document.addEventListener('DOMContentLoaded', () => {
  async function cargarProductos() {
    try {
      const res = await fetch('/api/productos');
      const productos = await res.json();
      const grid = document.getElementById('products-grid');

      if (!grid) return;

      productos.forEach((p, index) => {
        const card = document.createElement('div');
        card.className = 'product-card';
        const numeroImagen = index + 6;
        card.innerHTML = `
          <div class="product-image-box">
                  <img src="/img/productos/${numeroImagen}.webp" alt="${p.nombre}" 
                          onerror="this.src='/img/placeholder.png'">
              </div>
              <p class="product-name">${p.nombre}</p>
              <div class="price-info">
                    <div class="online-price-label">PRECIO<br>ONLINE</div>
                    <p class="online-price">S/ ${p.precio}</p>
                  </div>
                  
                  <a href="./producto.html?id=${p._id}" class="btn-add-to-cart">
                      Ver Producto
                  </a>
              `;
        grid.appendChild(card);
      });
    } catch (err) {
      console.error('Error cargando productos:', err);
    }
  }

  async function cargarCategorias() {
    try {
      const res = await fetch('/api/productos');
      const productos = await res.json();

      const categorias = [...new Set(productos.map(p => p.categoria))];
      const grid = document.getElementById('circles-grid');

      if (!grid) return;

      categorias.forEach(cat => {
        const link = document.createElement('a');
        link.href = `/productos.html?categoria=${encodeURIComponent(cat)}`;
        link.className = 'category-circle';

        link.innerHTML = `
          <div class="circle-icon" 
               style="background-image: url('/img/${cat.toLowerCase()}.png');">
          </div>
          ${cat}
        `;

        grid.appendChild(link);
      });
    } catch (err) {
      console.error('Error cargando categorías:', err);
    }
  }

  // 🔑 Manejo de login/logout en index
  function manejarUsuario() {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');

    const guestActions = document.getElementById('guest-actions');
    const userInfo = document.getElementById('user-info');
    const usernameSpan = document.getElementById('username');
    const btnLogout = document.getElementById('btn-logout');

    if (token && username) {
        guestActions.style.display = 'none';
        userInfo.style.display = 'inline-block';
        usernameSpan.textContent = username;

        btnLogout.addEventListener('click', (e) => {
        e.preventDefault(); // evita navegación por defecto del <a>
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        userInfo.style.display = 'none';
        guestActions.style.display = 'inline-block';
        // opcional: refrescar página
        window.location.href = '/';
        });
    } else {
        guestActions.style.display = 'inline-block';
        userInfo.style.display = 'none';
    }
    }

  // Ejecutar funciones
  cargarCategorias();
  cargarProductos();
  manejarUsuario();
});