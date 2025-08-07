const cron = require('node-cron');
const ejecutarScraping = require('../../scraper/scrapeFacebook');

function iniciarScrapingJob() {
    cron.schedule('0 */6 * * *', async () => {
        console.log('🔄 Ejecutando scraping cada 6 horas...');
        await ejecutarScraping();
    });
}

module.exports = iniciarScrapingJob;
