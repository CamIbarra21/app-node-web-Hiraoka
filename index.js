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

// Modelos
const Comentario = mongoose.model('Comentario', new mongoose.Schema({
  _id: String,
  reseña_id: String,
  usuario_id: String,
  texto: String,
  fecha_creacion: Date
}));

const Producto = mongoose.model('Producto', new mongoose.Schema({
  _id: Number,
  nombre: String,
  categoria: String,
  precio: Number,
  descripcion: String
}));

const Reaccion = mongoose.model('Reaccion', new mongoose.Schema({
  _id: String,
  reseña_id: String,
  usuario_id: String,
  tipo: String,
  fecha_creacion: Date
}));

const Reseña = mongoose.model('Reseña', new mongoose.Schema({
  _id: String,
  producto_id: Number,
  usuario_id: String,
  calificacion: Number,
  titulo: String,
  texto: String,
  imagenes: [String],
  fecha_creacion: Date
}));

const Usuario = mongoose.model('Usuario', new mongoose.Schema({
  _id: String,
  nombre: String,
  correo: String,
  fecha_registro: Date
}));

// Rutas API
app.get('/api/reseñas', async (req, res) => res.json(await Reseña.find()));
app.get('/api/comentarios', async (req, res) => res.json(await Comentario.find()));
app.get('/api/productos', async (req, res) => res.json(await Producto.find()));
app.get('/api/reacciones', async (req, res) => res.json(await Reaccion.find()));
app.get('/api/usuarios', async (req, res) => res.json(await Usuario.find()));

// Ruta principal: landing page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(3000, () => {
  console.log('Servidor corriendo en http://localhost:3000');
});