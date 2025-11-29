const express = require('express');
const router = express.Router();
const Reseña = require('../modules/Reseña');
const Reaccion = require('../modules/Reaccion');

const authMiddleware = require('../middleware/auth');
// Crear reseña
router.post('/', authMiddleware, async (req, res) => { 
  try {
    const reseña = new Reseña({
        producto_id: req.body.producto_id,
        usuario_id: req.userId,
        calificacion: req.body.calificacion,
        titulo: req.body.titulo,
        texto: req.body.texto,
        imagenes: req.body.imagenes || []
    });
    await reseña.save();
    res.status(201).json(reseña);
  } catch (err) {
    console.error("Error de validación de reseña:", err.message); 
    res.status(400).json({ error: err.message });
  }
});


router.get('/', async (req, res) => {
  try {
    const filtro = {};

    const usuarioId = req.userId; 

    if (req.query.producto_id) {
      filtro.producto_id = req.query.producto_id;
    }

    let reseñas = await Reseña.find(filtro)
      .populate('usuario_id') 
      .populate('producto_id')
      .lean(); 

 
    if (usuarioId) {

        const reaccionesUsuario = await Reaccion.find({ 
            usuario_id: usuarioId, 
            elemento_tipo: 'reseña',
            elemento_id: { $in: reseñas.map(r => r._id) }
        }).lean();

        const userReactionsMap = {};
        reaccionesUsuario.forEach(r => {
            userReactionsMap[r.elemento_id.toString()] = { tipo: r.tipo, id: r._id.toString() };
        });

        reseñas = reseñas.map(reseña => {
            // Usamos .toString() para asegurar la coincidencia de IDs
            if (userReactionsMap[reseña._id.toString()]) { 
                reseña.reaccion_usuario = userReactionsMap[reseña._id.toString()];
            } else {
                reseña.reaccion_usuario = { tipo: null };
            }
            return reseña;
        });
    }

    res.json(reseñas);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Obtener reseña por ID
router.get('/:id', async (req, res) => {
  try {
    const reseña = await Reseña.findById(req.params.id);
    if (!reseña) return res.status(404).json({ error: 'Reseña no encontrada' });
    res.json(reseña);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Actualizar reseña
router.put('/:id', async (req, res) => {
  try {
    const reseña = await Reseña.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(reseña);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Eliminar reseña
router.delete('/:id', async (req, res) => {
  try {
    await Reseña.findByIdAndDelete(req.params.id);
    res.json({ message: 'Reseña eliminada' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;