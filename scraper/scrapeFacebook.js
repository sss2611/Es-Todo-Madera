// scraper/scrapeFacebook.js
const puppeteer = require('puppeteer');
require('dotenv').config();

async function scrapeFacebookPage() {
  const url = process.env.FACEBOOK_PAGE_URL || 'https://www.facebook.com/profile.php?id=100084460323861';
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();

  await page.goto(url, { waitUntil: 'networkidle2' });
  await page.waitForSelector('[role="main"]');

  // Scroll infinito simulado
  let previousHeight = 0;
  let scrollAttempts = 0;
  const maxScrolls = 10; // Ajustable según profundidad deseada

  while (scrollAttempts < maxScrolls) {
    scrollAttempts++;
    const newHeight = await page.evaluate(() => {
      window.scrollBy(0, window.innerHeight);
      return document.body.scrollHeight;
    });

    if (newHeight === previousHeight) break;
    previousHeight = newHeight;
    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  // Extraer todos los posts visibles tras el scroll
  const content = await page.evaluate(() => {
  const posts = Array.from(document.querySelectorAll('[role="article"]'))
    .filter(post => post.innerText.trim().length > 0);

  return posts.map(post => {
    const text = post.innerText;

    const link = Array.from(post.querySelectorAll('a'))
      .map(a => a.href)
      .find(href => href.includes('facebook.com/share')) || '';

    const priceMatch = text.match(/\$\s?\d{2,3}(?:[.,]\d{3})?(?:[.,]\d{2})?/);
    const price = priceMatch ? priceMatch[0].replace(/\s/g, '') : null;

    const dateMatch = text.match(/\d{1,2}\s[h|d|min]/);
    const date = dateMatch ? dateMatch[0] : null;

    const likesMatch = text.match(/\d+\nMe gusta/);
    const likes = likesMatch ? likesMatch[0].split('\n')[0] : null;

    const descripcion = text
      .split('\n')
      .filter(line =>
        !line.includes('Me gusta') &&
        !line.includes('Comentar') &&
        !line.includes('Compartir') &&
        !line.includes('ha publicado') &&
        !line.match(/\d{1,2}\s[h|d|min]/)
      )
      .join(' ')
      .trim();

    const imagenes = Array.from(post.querySelectorAll('img'))
      .map(img => img.src)
      .filter(src => src && src.startsWith('http'));

    return {
      fecha: date,
      descripcion,
      precio: price,
      likes,
      link,
      imagenes,
      textoOriginal: text
    };
  });
});

  await browser.close();
  return content;
}

module.exports = scrapeFacebookPage;

