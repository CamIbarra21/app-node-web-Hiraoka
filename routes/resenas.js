const express = require('express');
const router = express.Router();
const Reseña = require('../modules/Reseña');

// Crear reseña
router.post('/', async (req, res) => {
  try {
    const reseña = new Reseña(req.body);
    await reseña.save();
    res.status(201).json(reseña);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Obtener todas las reseñas
router.get('/', async (req, res) => {
  try {
    const reseñas = await Reseña.find().populate('usuario_id').populate('producto_id');
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