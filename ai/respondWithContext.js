// ai/respondWithContext.js
const fs = require('fs');
const path = require('path');
const { OpenAI } = require('openai');
const Post = require('../database/Post');
require('dotenv').config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function detectarTipoProducto(userMessage) {
  const prompt = `Extraé el tipo de producto mencionado en esta consulta del usuario. Respondé solo con una palabra en minúsculas (ej: "zapatillas", "remeras", "pantalones").\n\nConsulta: "${userMessage}"`;

  const completion = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [{ role: 'user', content: prompt }],
  });

  return completion.choices[0].message.content.trim().toLowerCase();
}

async function getContextFromMongo(tipoProducto) {
  try {
    const posts = await Post.find({ tipo: tipoProducto, stock: { $gt: 0 } }).limit(10);
    if (!posts.length) throw new Error('No hay productos disponibles en MongoDB');

    return posts.map((p, i) =>
      `Producto ${i + 1}:\nNombre: ${p.nombreProducto}\nPrecio: ${p.precio}\nStock: ${p.stock}\nLink: ${p.link}\n`
    ).join('\n');
  } catch (err) {
    console.warn('⚠️ Fallback: MongoDB falló o no hay productos disponibles');
    return null;
  }
}

function getContextFromFile(tipoProducto) {
  const contextPath = path.join(__dirname, '../database/facebook_content.txt');
  if (!fs.existsSync(contextPath)) throw new Error('Archivo de contexto no encontrado');

  const raw = fs.readFileSync(contextPath, 'utf8');
  if (!raw.trim()) throw new Error('El archivo de contexto está vacío');

  const posts = JSON.parse(raw);
  const filtrados = posts.filter(p => p.tipo === tipoProducto && p.stock > 0);

  if (!filtrados.length) throw new Error('No hay productos disponibles en el archivo');

  return filtrados.map((p, i) =>
    `Producto ${i + 1}:\nNombre: ${p.nombreProducto}\nPrecio: ${p.precio}\nStock: ${p.stock}\nLink: ${p.link}\n`
  ).join('\n');
}

async function respondWithContext(userMessage) {
  try {
    const tipoProducto = await detectarTipoProducto(userMessage);
    console.log(`🔍 Tipo detectado: ${tipoProducto}`);

    let contexto = await getContextFromMongo(tipoProducto);
    if (!contexto) contexto = getContextFromFile(tipoProducto);

    const prompt = `Sos un asistente de ventas. Respondé esta consulta usando los productos disponibles del tipo "${tipoProducto}". Mostrá solo los que tienen stock disponible:\n\n${contexto}\n\nConsulta del usuario: "${userMessage}"`;

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
