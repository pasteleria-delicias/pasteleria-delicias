console.log("Carpeta actual:", __dirname);
require("dotenv").config();

const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");
const mongoose = require("mongoose");

const dns = require('dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../../HTML')));

// Rutas
const usuariosRoutes = require("../routes/usuarios");
const productosRoutes = require("../routes/productos");
const ventasRoutes = require("../routes/ventas");

app.use(usuariosRoutes);
app.use(productosRoutes);
app.use(ventasRoutes);

const Producto = require("../models/Producto");

// PRODUCTOS INICIALES
const productosIniciales = [
  {
    nombre: "Pastel de Vainilla y Frambuesa",
    descripcion: "Bizcocho suave de vainilla, relleno de mermelada de frambuesa y crema de mantequilla.",
    precio: 16.90,
    cantidad: 10,
    imagenUrl: "https://picsum.photos/id/176/300/170"
  },
  {
    nombre: "Pastel Red Velvet",
    descripcion: "Clásico pastel terciopelo rojo con crema de queso y nueces pecanas.",
    precio: 19.50,
    cantidad: 7,
    imagenUrl: "https://picsum.photos/id/145/300/170"
  },
  {
    nombre: "Pastel de Zanahoria",
    descripcion: "Bizcocho de zanahoria, nueces y especias, cubierto con frosting de queso crema.",
    precio: 14.00,
    cantidad: 9,
    imagenUrl: "https://picsum.photos/id/135/300/170"
  },
  {
    nombre: "Pastel de Chocolate con Nutella",
    descripcion: "Bizcocho de chocolate intenso, relleno de Nutella y cubierto con ganache.",
    precio: 22.00,
    cantidad: 6,
    imagenUrl: "https://picsum.photos/id/106/300/170"
  },
  {
    nombre: "Flan Napolitano",
    descripcion: "Flan casero con caramelo, queso crema y un toque de vainilla.",
    precio: 5.50,
    cantidad: 15,
    imagenUrl: "https://picsum.photos/id/124/300/170"
  },
  {
    nombre: "Churros con Chocolate",
    descripcion: "6 churros crujientes con salsa de chocolate caliente para dip.",
    precio: 7.00,
    cantidad: 20,
    imagenUrl: "https://picsum.photos/id/100/300/170"
  }
];

// Conectar a MongoDB y precargar productos si no existen
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

// RUTAS DE PÁGINAS
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../../HTML/registro.html")); // MODIFICADO: ahora registro es la página principal
});
app.get("/index", (req, res) => {
  res.sendFile(path.join(__dirname, "../../HTML/index.html")); // página original con botones
});
app.get("/admin", (req, res) => {
  res.sendFile(path.join(__dirname, "../../HTML/admin-productos.html"));
});
app.get("/menu-publico", (req, res) => {
  res.sendFile(path.join(__dirname, "../../HTML/menu-publico.html"));
});
app.get("/reporte", (req, res) => {
  res.sendFile(path.join(__dirname, "../../HTML/reporte-productos.html"));
});
app.get("/cliente", (req, res) => {
  res.sendFile(path.join(__dirname, "../../HTML/cliente.html"));
});