// test-openai.js
const { OpenAI } = require('openai');
require('dotenv').config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

openai.models.list().then(models => {
  console.log('✅ Conexión exitosa con OpenAI');
}).catch(err => {
  console.error('❌ Error al conectar con OpenAI:', err);
});
