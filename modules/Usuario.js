const mongoose = require('mongoose');

const usuarioSchema = new mongoose.Schema({
  nombre_usuario: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  hash_password: { type: String, required: true },
  fecha_registro: { type: Date, default: Date.now },
  lista_deseos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Producto' }]
}, { timestamps: true });

module.exports = mongoose.model('Usuario', usuarioSchema);