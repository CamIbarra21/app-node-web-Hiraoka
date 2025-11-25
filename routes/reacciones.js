const express = require('express');
const router = express.Router();
const Reaccion = require('../modules/Reaccion');
const authMiddleware = require('../middleware/auth');

// Crear reacción
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { elemento_id, elemento_tipo, tipo } = req.body;

    // Evitar duplicados: un usuario solo puede reaccionar una vez por elemento
    const existente = await Reaccion.findOne({ usuario_id: req.userId, elemento_id, elemento_tipo });
    if (existente) {
      // Si ya existe, actualizamos el tipo (like/dislike)
      existente.tipo = tipo;
      await existente.save();
      return res.json(existente);
    }

    const reaccion = new Reaccion({
      usuario_id: req.userId,
      elemento_id,
      elemento_tipo,
      tipo
    });

    await reaccion.save();
    res.status(201).json(reaccion);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Obtener todas las reacciones
router.get('/', async (req, res) => {
  try {
    const filtro = {};
    if (req.query.elemento_id) filtro.elemento_id = req.query.elemento_id;
    if (req.query.elemento_tipo) filtro.elemento_tipo = req.query.elemento_tipo;

    const reacciones = await Reaccion.find(filtro).populate('usuario_id');
    res.json(reacciones);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Obtener reacción por ID
router.get('/:id', async (req, res) => {
  try {
    const reaccion = await Reaccion.findById(req.params.id);
    if (!reaccion) return res.status(404).json({ error: 'Reacción no encontrada' });
    res.json(reaccion);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Actualizar reacción
router.put('/:id', async (req, res) => {
  try {
    const reaccion = await Reaccion.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(reaccion);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Eliminar reacción
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const reaccion = await Reaccion.findById(req.params.id);
    if (!reaccion) return res.status(404).json({ error: 'Reacción no encontrada' });

    if (String(reaccion.usuario_id) !== req.userId) {
      return res.status(403).json({ error: 'No autorizado' });
    }

    await reaccion.deleteOne();
    res.json({ message: 'Reacción eliminada' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;