document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    // Elementos del DOM (Mantengo variables)
    const productDetailSection = document.querySelector('.product-detail-layout');
    const reviewListEl = document.getElementById('review-list');
    const reviewSummaryEl = document.getElementById('review-summary');
    const formNewReview = document.getElementById('form-new-review');
    const authWarningEl = document.getElementById('auth-warning');
    const reviewStatusEl = document.getElementById('review-status');
    const titleReviewsEl = document.querySelector('.section-title-reviews');

    // URLs de la API y Token (Mantengo variables)
    const API_RESEÑAS = '/api/resenas';
    const API_COMENTARIOS = '/api/comentarios';
    const API_REACCIONES = '/api/reacciones';

    if (!productId) {
        document.getElementById('product-title').textContent = "ERROR: ID de producto no encontrado.";
        return;
    }

    // --- FUNCIONES DE UTILIDAD (Mantengo las funciones de soporte) ---
    const formatPrice = (price) => `S/ ${parseFloat(price).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
    const fmtDate = (d) => { try { return new Date(d).toLocaleDateString('es-PE', { day: 'numeric', month: 'numeric', year: 'numeric' }); } catch { return ''; } };
    const esc = (s) => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
    const fetchJSON = async (url, options = {}) => { /* ... */
        const res = await fetch(url, options);
        if (!res.ok) {
             const errorData = await res.json().catch(() => ({ error: 'Error desconocido' }));
             throw new Error(errorData.error || `Error ${res.status} al obtener ${url}`);
        }
        return res.json();
    };
    
    function generateStars(rating) {
        let starsHTML = '';
        for (let i = 1; i <= 5; i++) {
            starsHTML += `<i class="${i <= Math.round(rating) ? 'fas' : 'far'} fa-star"></i>`;
        }
        return starsHTML;
    }

    function getAuthHeaders(includeContentType = true) {
        const headers = {};
        if (includeContentType) {
            headers['Content-Type'] = 'application/json';
        }
        const currentToken = localStorage.getItem("token"); 
        
        if (currentToken) {
            headers['Authorization'] = `Bearer ${currentToken}`;
        }
        return headers;
    }
    
    function setupQuantityControls(maxStock) { /* ... (Mantengo la función) ... */
        const qtyInput = document.getElementById('quantity');
        const minusBtn = document.getElementById('minus-qty');
        const plusBtn = document.getElementById('plus-qty');

        if (!qtyInput || !minusBtn || !plusBtn) return; 

        qtyInput.value = 1;
        qtyInput.max = maxStock;

        minusBtn.addEventListener('click', () => {
            let currentQty = parseInt(qtyInput.value);
            if (currentQty > 1) {
                qtyInput.value = currentQty - 1;
            }
        });

        plusBtn.addEventListener('click', () => {
            let currentQty = parseInt(qtyInput.value);
            if (currentQty < maxStock) {
                qtyInput.value = currentQty + 1;
            }
        });
    }

    // --- LÓGICA DE CARGA DE DATOS (Mantengo funciones de carga) ---

    async function cargarReacciones(elementoId, tipo) { /* ... */
        try {
            const qs = `?elemento_tipo=${tipo}&elemento_id=${encodeURIComponent(elementoId)}`;
            const data = await fetchJSON(`${API_REACCIONES}${qs}`);
            const likes = data.filter(r => r.tipo === 'like').length;
            const dislikes = data.filter(r => r.tipo === 'dislike').length;
            return { likes, dislikes };
        } catch {
            return { likes: 0, dislikes: 0 };
        }
    }

    async function cargarComentariosYReacciones(reseñaId) { /* ... */
        try {
            const qs = `?reseña_id=${encodeURIComponent(reseñaId)}`;
            const comentarios = await fetchJSON(`${API_COMENTARIOS}${qs}`);
            
            const withReactions = await Promise.all(comentarios.map(async c => {
                const rx = await cargarReacciones(c._id, 'comentario');
                return { ...c, _rx: rx };
            }));
            return withReactions;
        } catch {
            return [];
        }
    }


    // 💡 RENDERIZADO DE COMENTARIOS (Compacto)
    function renderComentarios(comentarios, reseñaId) {
        const currentReseñaId = comentarios[0]?.reseña_id || reseñaId;
        const comentariosHTML = comentarios.length
            ? comentarios.map(c => `
                <div class="comentario">
                    <div class="c-meta">${esc(c.usuario_id?.nombre_usuario || 'Usuario')}: ${fmtDate(c.fecha_creacion)}</div>
                    <div class="c-texto">${esc(c.texto)}</div>
                    <div class="c-reacciones">
                        <span class="comment-likes">👍 ${c._rx.likes}</span>
                        <span class="comment-dislikes">❌ ${c._rx.dislikes}</span>
                    </div>
                </div>
              `).join('')
            : `<div class="empty-comment">Sin comentarios.</div>`;

        const formHTML = localStorage.getItem("token") ? `
            <form class="form-comentario" data-reseña="${currentReseñaId}">
                <input type="text" name="texto" placeholder="Escribe un comentario..." required />
                <button type="submit" class="btn-comentar">Comentar</button>
            </form>
          ` : '';

        return `
            <div class="comentarios">
                <div class="comments-list-wrapper">
                    <div class="c-title">Comentarios (${comentarios.length})</div>
                    ${comentariosHTML}
                </div>
                ${formHTML}
            </div>
        `;
    }

    // 💡 RENDERIZADO DE RESEÑA PRINCIPAL (Minimalista)
    function renderReseñaCard(r, comentarios, reacciones) {
        const usuario = r.usuario_id?.nombre_usuario || 'Usuario Anónimo';
        const reaccionUsuario = r.reaccion_usuario || { tipo: null }; 

        const likeClass = reaccionUsuario.tipo === 'like' ? 'active-like' : '';
        const dislikeClass = reaccionUsuario.tipo === 'dislike' ? 'active-dislike' : '';

        const reaccionBtns = localStorage.getItem("token") ? `
            <div class="review-actions-buttons" data-reseña="${r._id}">
                <button class="btn-like ${likeClass}" data-tipo="like">
                    <i class="${likeClass ? 'fas' : 'far'} fa-thumbs-up"></i> Me gusta
                </button>
                <button class="btn-dislike ${dislikeClass}" data-tipo="dislike">
                    <i class="${dislikeClass ? 'fas' : 'far'} fa-thumbs-down"></i> No me gusta
                </button>
            </div>
        ` : '';
        
        const comentariosHTML = renderComentarios(comentarios, r._id);

        return `
            <div class="review-card reseña">
                <div class="review-score">
                    <div class="rating-stars">${generateStars(r.calificacion)}</div>
                    <span class="rating-score">${r.calificacion.toFixed(1)} / 5</span>
                </div>

                <div class="review-content-wrapper">
                    <div class="review-header">
                        <div class="review-title">${esc(r.titulo)}</div>
                        <p class="review-meta">Por: <strong>${esc(usuario)}</strong> | ${fmtDate(r.fecha_creacion)}</p>
                        <p class="review-text">${esc(r.texto)}</p>
                    </div>
                
                    <div class="review-footer-actions">
                        <div class="reacciones-count">
                            <span class="review-likes-count">👍 ${reacciones.likes}</span>
                            <span class="review-dislikes-count">👎 ${reacciones.dislikes}</span>
                        </div>
                        ${reaccionBtns}
                    </div>
                </div>
                
                ${comentariosHTML}
            </div>
        `;
    }

    async function cargarReseñasPorProducto(id) { /* ... (Lógica de carga sin cambios) ... */
        const token = localStorage.getItem("token");
        if (token) {
            formNewReview.style.display = 'block';
            authWarningEl.style.display = 'none';
        } else {
            formNewReview.style.display = 'none';
            authWarningEl.style.display = 'block';
        }

        try {
            const reseñas = await fetchJSON(`${API_RESEÑAS}?producto_id=${id}`, {
                headers: getAuthHeaders(false)
            }); 
            
            titleReviewsEl.textContent = `⭐ Opiniones de clientes y Reseñas (${reseñas.length})`;
            reviewListEl.innerHTML = '';

            if (reseñas.length === 0) {
                reviewSummaryEl.innerHTML = '<p>Aún no hay reseñas. ¡Sé el primero en dejar tu opinión!</p>';
                return;
            }

            let sumaCalificaciones = 0;
            
            const contenido = await Promise.all(reseñas.map(async r => {
                sumaCalificaciones += r.calificacion;
                const comentarios = await cargarComentariosYReacciones(r._id);
                const reacciones = await cargarReacciones(r._id, 'reseña');
                return renderReseñaCard(r, comentarios, reacciones);
            }));

            const promedio = sumaCalificaciones / reseñas.length;
            reviewSummaryEl.innerHTML = `
                <p><strong>Calificación promedio: ${promedio.toFixed(1)} / 5</strong></p>
                <p class="review-rating">${generateStars(promedio)} (${reseñas.length} opiniones)</p>
            `;
            reviewListEl.innerHTML = contenido.join('');

        } catch (err) {
            console.error('Error al cargar reseñas:', err);
            reviewSummaryEl.innerHTML = `<p style="color:red;">Error al cargar las reseñas: ${err.message}</p>`;
        }
    }


    async function cargarDetalleProducto(id) { /* ... (Lógica de carga de detalle) ... */
        try {
            const res = await fetch(`/api/productos/${id}`);
            if (!res.ok) throw new Error("Producto no encontrado o error del servidor.");
            const producto = await res.json();
            
            renderizarProducto(producto);
            cargarReseñasPorProducto(id);
            
        } catch (error) {
            console.error('Error al cargar detalle del producto:', error);
            document.getElementById('product-title').textContent = `Error: ${error.message}`;
        }
    }

    function renderizarProducto(p) { /* ... (Lógica de renderizado de producto) ... */
        const marca = p.marca || 'MARCA GENÉRICA';
        const nombre = p.nombre || 'Producto Desconocido';
        const categoria = p.categoria || 'Categoría';
        const modeloCode = `${marca.toUpperCase().slice(0, 3)}-${p._id.slice(-4)}`; 
        const stock = p.stock_web || 5; 

        document.getElementById('page-title').textContent = `${nombre} - Hiraoka`;
        document.getElementById('breadcrumb-product-name').textContent = nombre;
        document.getElementById('breadcrumb-category').textContent = categoria;

        document.getElementById('product-brand').textContent = marca;
        document.getElementById('product-title').textContent = nombre;
        document.getElementById('product-model').textContent = modeloCode; 
        document.getElementById('product-id').textContent = p._id; 

        document.getElementById('product-price').textContent = formatPrice(p.precio);
        document.getElementById('product-description').innerHTML = p.descripcion || 'No hay descripción detallada disponible para este producto.';
        
        const stockEl = document.getElementById('stock-info');
        if (stock > 0) {
            stockEl.innerHTML = `<i class="fas fa-box"></i> Stock Web: <strong>${stock}</strong> unidades`;
        } else {
            stockEl.innerHTML = `<i class="fas fa-times-circle"></i> Sin stock por el momento.`;
        }

        const defaultImageNumber = 6; 
        const mainImg = document.getElementById('main-product-image');
        mainImg.src = `./img/productos/${defaultImageNumber}.webp`; 
        mainImg.onerror = function() { this.src = './img/placeholder.png'; };
        
        setupQuantityControls(stock);
    }
    
    // --- EVENTOS DE ACCIÓN (Corregido para feedback visual) ---
    
    formNewReview.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        if (!localStorage.getItem("token")) {
            reviewStatusEl.textContent = 'Debes iniciar sesión para publicar una reseña.';
            reviewStatusEl.style.color = '#E30613';
            return;
        }

        reviewStatusEl.textContent = 'Publicando...';
        reviewStatusEl.style.color = '#1a73e8';

        const calificacion = document.getElementById('calificacion').value;
        const titulo = document.getElementById('titulo').value;
        const texto = document.getElementById('texto-resena').value;

        try {
            const res = await fetch(API_RESEÑAS, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify({
                    producto_id: productId,
                    calificacion,
                    titulo,
                    texto,
                })
            });

            const data = await res.json();
            if (res.ok) {
                reviewStatusEl.textContent = '¡Reseña publicada con éxito! 🎉';
                reviewStatusEl.style.color = '#28a745';
                formNewReview.reset();
                cargarReseñasPorProducto(productId);
            } else {
                reviewStatusEl.textContent = data.error || 'Error al publicar reseña.';
                reviewStatusEl.style.color = '#E30613';
            }
        } catch (err) {
            reviewStatusEl.textContent = `Error: ${err.message || 'Error de conexión.'}`;
            reviewStatusEl.style.color = '#E30613';
            console.error(err);
        }
    });

    document.querySelector('.product-page-container').addEventListener("submit", async (e) => {
        if (e.target.classList.contains("form-comentario")) {
            e.preventDefault();
            
            if (!localStorage.getItem("token")) return alert("Debes iniciar sesión para comentar.");
            
            const reseñaId = e.target.dataset.reseña;
            const texto = e.target.querySelector("input[name='texto']").value;
            
            try {
                const res = await fetch(API_COMENTARIOS, {
                    method: "POST",
                    headers: getAuthHeaders(),
                    body: JSON.stringify({ reseña_id: reseñaId, texto })
                });

                if (res.ok) {
                    e.target.reset();
                    cargarReseñasPorProducto(productId); 
                } else {
                    alert("Error al comentar. Token inválido o expirado.");
                }
            } catch (err) {
                alert("Error de red al comentar");
            }
        }
    });

    document.querySelector('.product-page-container').addEventListener("click", async (e) => {
        if (e.target.closest(".review-actions-buttons button")) {
            const btn = e.target.closest("button");
            const tipo = btn.dataset.tipo;
            const reseñaId = btn.closest(".review-actions-buttons").dataset.reseña;
            
            if (!localStorage.getItem("token")) return alert("Debes iniciar sesión para reaccionar.");

            const parentDiv = btn.closest(".review-actions-buttons");
            const originalHTML = parentDiv.innerHTML;
            parentDiv.innerHTML = '<span style="color: #1a73e8; font-size: 13px;">Procesando...</span>';

            try {
                const res = await fetch(API_REACCIONES, {
                    method: "POST",
                    headers: getAuthHeaders(), 
                    body: JSON.stringify({ elemento_id: reseñaId, elemento_tipo: "reseña", tipo })
                });

                if (res.ok) {
                    parentDiv.innerHTML = `<span style="color: #1a73e8; font-size: 13px; font-weight: 600;">¡Registrado!</span>`;
                    setTimeout(() => cargarReseñasPorProducto(productId), 300); 

                } else {
                    alert("Error al reaccionar. Token inválido o expirado.");
                    parentDiv.innerHTML = originalHTML; 
                }
            } catch {
                alert("Error de red al reaccionar");
                parentDiv.innerHTML = originalHTML;
            }
        }
    });

    // --- INICIO ---
    cargarDetalleProducto(productId);
});