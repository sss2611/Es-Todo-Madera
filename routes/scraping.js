const express = require('express');
const router = express.Router();
const { ejecutarScraping } = require('../backend/controllers/scrapingController');

// Ruta para disparar scraping manual
router.get('/facebook', ejecutarScraping);

module.exports = router;