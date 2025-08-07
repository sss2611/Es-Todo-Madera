// backend/server.js
const express = require('express');
const respondWithContext = require('../ai/respondWithContext');
require('dotenv').config();
const conectarDB = require('../database/connect'); 
const iniciarScrapingJob = require('./jobs/scrapingJob');
const scrapeFacebookPage = require('../scraper/scrapeFacebook');
const guardarPosts = require('./utils/guardarPosts');
const { ejecutarScraping } = require('./controllers/scrapingController');
const scrapingRoutes = require('../routes/scraping');

const app = express();
app.use(express.json());
app.use('/scrapear', scrapingRoutes);

app.get('/', (req, res) => {
    res.send('🧠 El bot de Es Todo Madera está funcionando.');
});

app.get('/scrapear-facebook', ejecutarScraping);

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

app.get('/actualizar-productos', async (req, res) => {
    try {
        const posts = await scrapeFacebookPage();
        await guardarPosts(posts);
        res.json({ status: 'Productos actualizados', cantidad: posts.length });
    } catch (err) {
        console.error('❌ Error al actualizar productos:', err);
        res.status(500).json({ error: 'Error en el scraping o guardado' });
    }
});

const PORT = process.env.PORT || 3001;

// 🧠 Nuevo bloque que espera la conexión antes de levantar el servidor
const startServer = async () => {
    try {
        await conectarDB(); // 👈 Esperamos conexión a MongoDB
        app.listen(PORT, () => {
            console.log(`🚀 Backend escuchando en http://localhost:${PORT}`);
        });
        iniciarScrapingJob(); // 👈 Iniciamos el job solo si la DB está lista
    } catch (err) {
        console.error('❌ Error al iniciar el servidor:', err.message);
        process.exit(1);
    }
};

startServer();
