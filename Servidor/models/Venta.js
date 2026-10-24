const mongoose = require('mongoose');

const ventaSchema = new mongoose.Schema({
  usuario: { type: String, required: true },
  correo: { type: String, required: true },
  productos: [{
    id: String,
    nombre: String,
    precio: Number,
    cantidad: Number
  }],
  total: { type: Number, required: true },
  fecha: { type: Date, default: Date.now },
  estado: { type: String, default: 'Completado' }
});

module.exports = mongoose.model('Venta', ventaSchema);