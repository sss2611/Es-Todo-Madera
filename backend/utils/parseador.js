function parsearPost(post) {
  const { textoOriginal, imagenes, link } = post;

  const precioMatch = textoOriginal.match(/\$\s?([\d\.]+)/);
  const precio = precioMatch ? parseInt(precioMatch[1].replace(/\./g, '')) : null;

  const tituloMatch = textoOriginal.match(/Rack.*?(?=\$|Somos|Fabricante|$)/i);
  const titulo = tituloMatch ? tituloMatch[0].trim() : null;

  const medidasMatch = textoOriginal.match(/(\d+\s?cm.*?)(?=\n|$)/i);
  const medidas = medidasMatch ? medidasMatch[1].trim() : null;

  const colorMatch = textoOriginal.match(/(Negro|Blanco|Madera|Gris|Natural)/i);
  const color = colorMatch ? colorMatch[1] : null;

  return {
    titulo,
    precio,
    medidas,
    color,
    imagenPrincipal: imagenes[0] || null,
    imagenes,
    link,
    textoOriginal,
    fuente: "Facebook",
    fechaScraping: new Date()
  };
}

module.exports = { parsearPost };
