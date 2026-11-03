console.log("Carpeta actual:", __dirname);
require("dotenv").config();

const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");
const mongoose = require("mongoose");
const dns = require('dns');

// Evitar problemas de conexión con MongoDB
dns.setServers(['8.8.8.8', '1.1.1.1']);

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../../HTML')));

// ==========================================
// 🛡️ CANDADO DE SEGURIDAD MAESTRO (AUTENTICACIÓN BÁSICA)
// ==========================================
const basicAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const auth = Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');
    const user = auth[0];
    const pass = auth[1];
    
    // AQUÍ ESTÁN TUS CREDENCIALES SECRETAS
    if (user === 'mary' && pass === 'pasteleria123') {
      next();
    } else {
      res.status(401).send('⛔ Acceso denegado. Credenciales incorrectas.');
    }
  } else {
    res.set('WWW-Authenticate', 'Basic');
    res.status(401).send('⛔ Necesitas iniciar sesión para ver esta página.');
  }
};

// ==========================================
// RUTAS DE LA API (Backend)
// ==========================================
const usuariosRoutes = require("../routes/usuarios");
const productosRoutes = require("../routes/productos");
const ventasRoutes = require("../routes/ventas");

app.use(usuariosRoutes);
app.use(productosRoutes);
app.use(ventasRoutes);

const Producto = require("../models/Producto");

// ==========================================
// PRODUCTOS INICIALES
// ==========================================
const productosIniciales = [
  { nombre: "Pastel de Vainilla y Frambuesa", descripcion: "Bizcocho suave de vainilla, relleno de frambuesa y crema de mantequilla.", precio: 16.90, cantidad: 10, imagenUrl: "https://picsum.photos/id/176/300/170" },
  { nombre: "Pastel Red Velvet", descripcion: "Terciopelo rojo con crema de queso y nueces pecanas.", precio: 19.50, cantidad: 7, imagenUrl: "https://picsum.photos/id/145/300/170" },
  { nombre: "Pastel de Zanahoria", descripcion: "Bizcocho de zanahoria, nueces y frosting de queso crema.", precio: 14.00, cantidad: 9, imagenUrl: "https://picsum.photos/id/135/300/170" },
  { nombre: "Pastel de Chocolate con Nutella", descripcion: "Bizcocho de chocolate intenso, relleno de Nutella y ganache.", precio: 22.00, cantidad: 6, imagenUrl: "https://picsum.photos/id/106/300/170" },
  { nombre: "Flan Napolitano", descripcion: "Flan casero con caramelo, queso crema y vainilla.", precio: 5.50, cantidad: 15, imagenUrl: "https://picsum.photos/id/124/300/170" },
  { nombre: "Churros con Chocolate", descripcion: "6 churros crujientes con salsa de chocolate caliente para dip.", precio: 7.00, cantidad: 20, imagenUrl: "https://picsum.photos/id/100/300/170" }
];

// ==========================================
// CONEXIÓN A MONGODB Y ARRANQUE
// ==========================================
mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("✅ Conectado a MongoDB");
    const count = await Producto.countDocuments();
    if (count === 0) {
      await Producto.insertMany(productosIniciales);
      console.log(`✅ Se insertaron ${productosIniciales.length} productos.`);
    } else {
      console.log(`ℹ️ Ya existen ${count} productos. No se duplicaron.`);
    }
    
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error("❌ Error conectando a MongoDB:", err.message);
    process.exit(1);
  });

// ==========================================
// RUTAS DE LAS PÁGINAS (Frontend)
// ==========================================
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../../HTML/index.html"));
});

app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "../../HTML/login.html"));
});

app.get("/registro", (req, res) => {
  res.sendFile(path.join(__dirname, "../../HTML/registro.html"));
});

app.get("/menu-publico", (req, res) => {
  res.sendFile(path.join(__dirname, "../../HTML/menu-publico.html"));
});

app.get("/cliente", (req, res) => {
  res.sendFile(path.join(__dirname, "../../HTML/cliente.html"));
});

app.get("/pago", (req, res) => {
  res.sendFile(path.join(__dirname, "../../HTML/pago.html"));
});

app.get("/detalle-producto", (req, res) => {
  res.sendFile(path.join(__dirname, "../../HTML/detalle-producto.html"));
});

app.get("/registro-admin", (req, res) => {
  res.sendFile(path.join(__dirname, "../../HTML/registro-admin.html"));
});

// ==========================================
// 🛡️ RUTAS PROTEGIDAS (Aquí actúa el Candado)
// ==========================================
app.get("/admin", basicAuth, (req, res) => {
  res.sendFile(path.join(__dirname, "../../HTML/admin-productos.html"));
});

app.get("/reporte", basicAuth, (req, res) => {
  res.sendFile(path.join(__dirname, "../../HTML/reporte-productos.html"));
});

app.get("/reporte-ventas", basicAuth, (req, res) => {
  res.sendFile(path.join(__dirname, "../../HTML/reporte-ventas.html"));
});