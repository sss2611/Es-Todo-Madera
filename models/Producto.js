const mongoose = require('mongoose');

const productoSchema = new mongoose.Schema({
    titulo: String,
    descripcion: String,
    imagen: String,
    precio: Number,
    categoria: String,
    fuente: String,
    fechaScraping: Date
});

module.exports = mongoose.model('Producto', productoSchema);
