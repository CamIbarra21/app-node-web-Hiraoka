const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Conexión a MongoDB
mongoose.connect('mongodb://mongo:27017/DB_Caso_Hiraoka')
  .then(() => console.log('Conectado a MongoDB'))
  .catch(err => console.error('Error al conectar a MongoDB', err));

// Importar rutas
const usuarioRoutes = require('./routes/usuarios');
const productoRoutes = require('./routes/productos');
const resenaRoutes = require('./routes/resenas');
const comentarioRoutes = require('./routes/comentarios');
const reaccionRoutes = require('./routes/reacciones');

// Usar rutas API
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/productos', productoRoutes);
app.use('/api/resenas', resenaRoutes);
app.use('/api/comentarios', comentarioRoutes);
app.use('/api/reacciones', reaccionRoutes);

// Ruta principal: landing page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Iniciar servidor
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});