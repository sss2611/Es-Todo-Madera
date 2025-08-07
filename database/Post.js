const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    nombreProducto: String,
    precio: String,
    link: String,
    imagenes: [String],
    textoOriginal: String
}, { timestamps: true });

module.exports = mongoose.model('Post', PostSchema);
