const fs = require('fs');
const path = require('path');
const scrapeFacebookPage = require('./scrapeFacebook');
const Post = require('../database/Post');
const conectarDB = require('../database/connect');

async function guardarEnArchivo(posts) {
  const filePath = path.join(__dirname, '../database/facebook_content.txt');
  fs.writeFileSync(filePath, JSON.stringify(posts, null, 2), 'utf8');
  console.log('✅ Contenido guardado en database/facebook_content.txt');
}

async function guardarEnMongo(posts) {
  let nuevos = 0;
  for (const post of posts) {
    const existe = await Post.findOne({ link: post.link });
    if (!existe) {
      await Post.create(post);
      nuevos++;
    }
  }
  console.log(`✅ Guardados ${nuevos} posts nuevos en MongoDB`);
}

async function ejecutarScraping() {
  await conectarDB(); // conectar antes de todo
  const posts = await scrapeFacebookPage();
  await guardarEnArchivo(posts);
  await guardarEnMongo(posts);
}

ejecutarScraping();