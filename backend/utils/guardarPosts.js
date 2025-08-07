const fs = require('fs');
const path = require('path');
const Producto = require('../../models/Producto');
const { parsearPost } = require('./parseador');

async function guardarPosts(posts, nombreArchivo = 'facebook_datos_limpios') {
    const nuevos = [];
    const duplicados = [];

    for (const post of posts) {
        const existe = await Producto.findOne({ titulo: post.titulo });
        if (existe) {
            duplicados.push(post);
        } else {
            const nuevoProducto = new Producto(post);
            await nuevoProducto.save();
            nuevos.push(post);
        }
    }

    // Guardar en archivo JSON
    const ahora = new Date();
    const fecha = ahora.toISOString().split('T')[0];
    const hora = ahora.toTimeString().split(' ')[0].replace(/:/g, '-');
    const nombreFinal = `${nombreArchivo}-${fecha}-${hora}.json`;
    const ruta = path.join(__dirname, '../../logs', nombreFinal);

    try {
        fs.mkdirSync(path.dirname(ruta), { recursive: true });
        fs.writeFileSync(ruta, JSON.stringify(nuevos, null, 2), 'utf-8');
        console.log(`📝 Guardados ${nuevos.length} nuevos posts en ${ruta}`);
    } catch (err) {
        console.error('❌ Error al guardar JSON:', err.message);
    }

    return {
        insertados: nuevos.length,
        duplicados: duplicados.length,
        rutaArchivo: ruta
    };
}

module.exports = guardarPosts;
