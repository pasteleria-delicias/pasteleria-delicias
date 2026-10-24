const express = require('express');
const router = express.Router();
const Venta = require('../models/Venta');

router.post('/ventas', async (req, res) => {
  try {
    const { usuario, correo, productos, total } = req.body;
    const nuevaVenta = new Venta({ usuario, correo, productos, total });
    await nuevaVenta.save();
    res.status(201).json({ mensaje: 'Venta registrada' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/ventas/:correo', async (req, res) => {
  try {
    const ventas = await Venta.find({ correo: req.params.correo }).sort({ fecha: -1 });
    res.json(ventas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;