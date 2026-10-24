const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
  nombre: { type: String, required: true, unique: true },
  descripcion: { type: String, default: '' }
});

module.exports = mongoose.model('Role', roleSchema);