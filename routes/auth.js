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
    const usuarioNuevo = await Usuario.findOne({ email: email });
    res.status(201).json({ message: 'Usuario creado', nombre: usuarioNuevo.nombre_usuario });
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
  console.log("Usuariooooooo ", usuario)
  if (!valido) return res.status(400).json({ error: 'Contraseña incorrecta' });

  const token = jwt.sign({ id: usuario._id }, 'secreto_super_seguro', { expiresIn: '1h' });
  res.json({
    token,
    usuario: {
      nombre_usuario: usuario.nombre_usuario,
      email: usuario.email
    }
  });
});


module.exports = router;