const express = require('express');
const router = express.Router();
const Comentario = require('../modules/Comentario');

// Crear comentario
router.post('/', async (req, res) => {
  try {
    const comentario = new Comentario(req.body);
    await comentario.save();
    res.status(201).json(comentario);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Obtener todos los comentarios
router.get('/', async (req, res) => {
  try {
    const comentarios = await Comentario.find();
    res.json(comentarios);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Obtener comentario por ID
router.get('/:id', async (req, res) => {
  try {
    const comentario = await Comentario.findById(req.params.id);
    if (!comentario) return res.status(404).json({ error: 'Comentario no encontrado' });
    res.json(comentario);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Actualizar comentario
router.put('/:id', async (req, res) => {
  try {
    const comentario = await Comentario.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(comentario);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Eliminar comentario
router.delete('/:id', async (req, res) => {
  try {
    await Comentario.findByIdAndDelete(req.params.id);
    res.json({ message: 'Comentario eliminado' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;