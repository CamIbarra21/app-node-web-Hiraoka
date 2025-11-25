const express = require('express');
const jwt = require('jsonwebtoken');
const Usuario = require('../modules/Usuario');

const router = express.Router();

// Registro
router.post('/register', async (req, res) => {
  try {
    const { nombre, email, password } = req.body;
    const usuario = new Usuario({
      nombre_usuario: nombre,
      email,
      hash_password: password
    });
    await usuario.save();
    res.status(201).json({ message: 'Usuario creado' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const usuario = await Usuario.findOne({ email });
  if (!usuario) return res.status(400).json({ error: 'Usuario no encontrado' });

  const valido = await usuario.comparePassword(password);
  if (!valido) return res.status(400).json({ error: 'Contraseña incorrecta' });

  const token = jwt.sign({ id: usuario._id }, 'secreto_super_seguro', { expiresIn: '1h' });
  res.json({ token });
});

module.exports = router;