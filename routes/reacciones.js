const express = require('express');
const router = express.Router();
const Reaccion = require('../modules/Reaccion');

// Crear reacción
router.post('/', async (req, res) => {
  try {
    const reaccion = new Reaccion(req.body);
    await reaccion.save();
    res.status(201).json(reaccion);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Obtener todas las reacciones
router.get('/', async (req, res) => {
  try {
    const reacciones = await Reaccion.find();
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
router.delete('/:id', async (req, res) => {
  try {
    await Reaccion.findByIdAndDelete(req.params.id);
    res.json({ message: 'Reacción eliminada' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;