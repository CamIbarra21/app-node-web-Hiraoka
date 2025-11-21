const mongoose = require('mongoose');

const reaccionSchema = new mongoose.Schema({
  usuario_id: { type: String, ref: 'Usuario', required: true },
  elemento_id: { type: String, required: true }, // Puede ser ID de comentario o reseña
  elemento_tipo: { type: String, enum: ['comentario', 'reseña'], required: true },
  tipo: { type: String, enum: ['like', 'dislike'], required: true }
}, { timestamps: true });

module.exports = mongoose.model('Reaccion', reaccionSchema);