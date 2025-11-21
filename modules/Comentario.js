const mongoose = require('mongoose');

const comentarioSchema = new mongoose.Schema({
  reseña_id: { type: String, ref: 'Reseña', required: true },
  usuario_id: { type: String, ref: 'Usuario', required: true },
  texto: { type: String, required: true },
  fecha_creacion: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Comentario', comentarioSchema);