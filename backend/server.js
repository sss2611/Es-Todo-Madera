// backend/server.js
const express = require('express');
const respondWithContext = require('../ai/respondWithContext');
require('dotenv').config();

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
    res.send('🧠 El bot de Es Todo Madera está funcionando.');
});

app.post('/api/message', async (req, res) => {
    const userMessage = req.body.message;
    if (!userMessage) return res.status(400).json({ error: 'Mensaje vacío' });

    try {
        const response = await respondWithContext(userMessage);
        res.json({ reply: response });
    } catch (err) {
        console.error('❌ Error al generar respuesta:', err);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`🚀 Backend escuchando en http://localhost:${PORT}`);
});
