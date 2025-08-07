const fs = require('fs');
const path = require('path');
const scrapeFacebookPage = require('./scrapeFacebook');

async function saveContent() {
  const content = await scrapeFacebookPage();
  const filePath = path.join(__dirname, '../database/facebook_content.txt');
  // fs.writeFileSync(filePath, content, 'utf8');
  fs.writeFileSync(filePath, JSON.stringify(content, null, 2), 'utf8');

  console.log('✅ Contenido guardado en database/facebook_content.txt');
}

saveContent();
