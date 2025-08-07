const puppeteer = require('puppeteer');
const fs = require('fs');
require('dotenv').config();

async function scrapeFacebookPage() {
  const url = process.env.FACEBOOK_PAGE_URL || 'https://www.facebook.com/profile.php?id=100084460323861';
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();

  await page.goto(url, { waitUntil: 'networkidle2' });
  await page.waitForSelector('[role="main"]');

  // 🔁 Scroll extendido
  let previousHeight;
  let scrollTries = 0;
  const maxTries = 20;

  while (scrollTries < maxTries) {
    previousHeight = await page.evaluate('document.body.scrollHeight');
    await page.evaluate('window.scrollTo(0, document.body.scrollHeight)');
    await new Promise(resolve => setTimeout(resolve, 2000));

    const newHeight = await page.evaluate('document.body.scrollHeight');
    if (newHeight === previousHeight) break;

    scrollTries++;
  }

  // 🧰 Guardar HTML para debug (opcional)
  const html = await page.content();
  fs.writeFileSync('paginaFacebook.html', html);

  // 🔍 Extraer posts
  const content = await page.evaluate(() => {
    const posts = Array.from(document.querySelectorAll('[role="article"], div[data-pagelet^="FeedUnit_"]'))
      .filter(post => post.innerText.trim().length > 0);

    return posts.map(post => {
      const text = post.innerText;

      const link = Array.from(post.querySelectorAll('a'))
        .map(a => a.href)
        .find(href => href.includes('facebook.com/share')) || '';

      const imagenes = Array.from(post.querySelectorAll('img'))
        .map(img => img.src)
        .filter(src => src && src.startsWith('http'));

      return {
        textoOriginal: text,
        imagenes,
        link
      };
    });
  });

  await browser.close();

  // 🧪 Log de cantidad de posts
  console.log(`✅ Posts encontrados: ${content.length}`);

  return content;
}

module.exports = scrapeFacebookPage;
