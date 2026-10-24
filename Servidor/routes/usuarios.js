const express = require('express');
const router = express.Router();
const Usuario = require('../models/Usuario');
const Role = require('../models/Role');

// Ruta para obtener todos los roles
router.get('/roles', async (req, res) => {
  try {
    const roles = await Role.find();
    console.log('Roles encontrados:', roles);
    res.json(roles);
  } catch (error) {
    console.error('Error al obtener roles:', error);
    res.status(500).json({ error: error.message });
  }
});

// Ruta para registrar un nuevo usuario
router.post('/registro', async (req, res) => {
  try {
    const { nombre, correo, password, rolId } = req.body;
    console.log('Datos recibidos:', { nombre, correo, rolId });

    const existe = await Usuario.findOne({ correo });
    if (existe) {
      return res.status(400).send('❌ El correo ya está registrado');
    }

    const nuevoUsuario = new Usuario({ nombre, correo, password, rol: rolId });
    await nuevoUsuario.save();
    console.log('✅ Usuario guardado:', nombre);
    
    res.status(201).send('✅ Registro exitoso');
  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).send('❌ Error: ' + error.message);
  }
});

// Ruta para iniciar sesión
router.post('/login', async (req, res) => {
  try {
    const { correo, password } = req.body;
    console.log('Intento de login:', correo);

    const usuario = await Usuario.findOne({ correo }).populate('rol');
    if (!usuario) {
      return res.status(401).send('❌ Correo o contraseña incorrectos');
    }

    const passwordCorrecto = await usuario.compararPassword(password);
    if (!passwordCorrecto) {
      return res.status(401).send('❌ Correo o contraseña incorrectos');
    }

    res.status(200).json({ 
      mensaje: '✅ Bienvenido ' + usuario.nombre,
      rol: usuario.rol.nombre,
      nombre: usuario.nombre
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).send('❌ Error: ' + error.message);
  }
});

module.exports = router;