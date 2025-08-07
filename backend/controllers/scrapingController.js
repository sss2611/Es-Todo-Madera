const scrapeFacebookPage = require('../../scraper/scrapeFacebook');
const { parsearPost } = require('../utils/parseador');
const guardarPosts = require('../utils/guardarPosts');

async function ejecutarScraping(req, res) {
    try {
        console.log('🔍 Iniciando scraping...');
        const rawPosts = await scrapeFacebookPage();
        console.log(`📦 Posts obtenidos: ${rawPosts.length}`);

        const postsParseados = rawPosts.map(parsearPost).filter(Boolean);
        console.log(`🧼 Posts parseados: ${postsParseados.length}`);

        const resultado = await guardarPosts(postsParseados);
        console.log(`✅ Guardados: ${resultado.insertados}, Duplicados: ${resultado.duplicados}`);

        res.json({
            mensaje: 'Scraping y guardado exitoso',
            totalScrapeados: rawPosts.length,
            parseados: postsParseados.length,
            guardados: resultado.insertados,
            duplicados: resultado.duplicados
        });
    } catch (err) {
        console.error('❌ Error en scrapingController:', err);
        res.status(500).json({ error: 'Scraping falló' });
    }
}


module.exports = { ejecutarScraping };
