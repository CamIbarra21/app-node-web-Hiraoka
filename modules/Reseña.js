const mongoose = require('mongoose');

const reseñaSchema = new mongoose.Schema({
  producto_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Producto', required: true },
  usuario_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
  calificacion: { type: Number, required: true, min: 0, max: 5 },
  titulo: { type: String, required: true },
  texto: { type: String, required: true },
  imagenes: [{ type: String }],
  fecha_creacion: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Reseña', reseñaSchema);