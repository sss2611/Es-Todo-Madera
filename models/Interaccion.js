const mongoose = require('mongoose');

const InteraccionSchema = new mongoose.Schema({
    mensajeUsuario: String,
    respuestaIA: String,
    canal: String,
    timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Interaccion', InteraccionSchema);
