const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const usuarioSchema = new mongoose.Schema({
  nombre_usuario: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  hash_password: { type: String, required: true },
  fecha_registro: { type: Date, default: Date.now },
  lista_deseos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Producto', default: [] }]
}, { timestamps: true });

// Antes de guardar, encriptar contraseña
usuarioSchema.pre('save', async function(next) {
  if (!this.isModified('hash_password')) return next();
  this.hash_password = await bcrypt.hash(this.hash_password, 10);
  next();
});

// Método para comparar contraseñas
usuarioSchema.methods.comparePassword = function(password) {
  return bcrypt.compare(password, this.hash_password);
};

module.exports = mongoose.model('Usuario', usuarioSchema);