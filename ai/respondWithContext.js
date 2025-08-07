// ai/respondWithContext.js
const fs = require('fs');
const path = require('path');
const { OpenAI } = require('openai');
require('dotenv').config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function respondWithContext(userMessage) {
  try {
    const contextPath = path.join(__dirname, '../database/facebook_content.txt');
    if (!fs.existsSync(contextPath)) throw new Error('Archivo de contexto no encontrado');

    const context = fs.readFileSync(contextPath, 'utf8');
    if (!context.trim()) throw new Error('El archivo de contexto está vacío');

    const prompt = `Basado en el siguiente contenido de la página de Facebook, responde al usuario:\n\n${context}\n\nPregunta del usuario: ${userMessage}`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
    });

    return completion.choices[0].message.content;
  } catch (err) {
    console.error('❌ Error en respondWithContext:', err.message);
    throw err;
  }
}

module.exports = respondWithContext;
