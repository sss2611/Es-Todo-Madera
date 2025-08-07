// scraper/scrapeFacebook.js
const puppeteer = require('puppeteer');
require('dotenv').config();

async function scrapeFacebookPage() {
  const url = process.env.FACEBOOK_PAGE_URL || 'https://www.facebook.com/estodomadera';
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();

  await page.goto(url, { waitUntil: 'networkidle2' });

  // Esperar que cargue contenido visible
  await page.waitForSelector('[role="main"]');

  // Extraer texto visible (simplificado)
  const content = await page.evaluate(() => {
    const posts = Array.from(document.querySelectorAll('[role="article"]'));
    return posts.map(post => post.innerText).join('\n\n');
  });

  await browser.close();
  return content;
}

module.exports = scrapeFacebookPage;
