import fs from 'fs/promises';
import path from 'path';

const PERSONALIZACION_PATH = path.resolve('./personalizacion.json');

// Leer la personalización del archivo
async function leerPersonalizacion() {
  try {
    const data = await fs.readFile(PERSONALIZACION_PATH, 'utf-8');
    return JSON.parse(data);
  } catch {
    return {};
  }
}

// Guardar la personalización en el archivo
async function guardarPersonalizacion(data) {
  await fs.writeFile(PERSONALIZACION_PATH, JSON.stringify(data, null, 2));
}

// Aquí puedes poner validación si deseas limitar qué números pueden usarlo
function esSubBot(numero) {
  // Puedes dejarlo así para permitir que cada quien tenga su personalización
  return true;
}

// Handler principal del comando
let handler = async (m, { conn }) => {
  const sender = m.sender.split('@')[0];

  if (!esSubBot(sender)) {
    return m.reply('Este comando es solo para sub-bots.');
  }

  // Validar si el mensaje citado contiene una imagen
  if (!m.quoted || !/image/.test(m.quoted.mimetype || '')) {
    return m.reply('Responde a una imagen con este comando para establecer el banner.');
  }

  try {
    const buffer = await m.quoted.download();
    const base64img = buffer.toString('base64');

    const personalizacion = await leerPersonalizacion();
    personalizacion[sender] = personalizacion[sender] || {};
    personalizacion[sender].banner = base64img;

    await guardarPersonalizacion(personalizacion);
    m.reply('¡Banner actualizado correctamente para tu sub-bot!');
  } catch (e) {
    console.error(e);
    m.reply('Hubo un error al actualizar tu banner.');
  }
};

// Definición del comando
handler.command = ['setbanner'];
handler.help = ['setbanner (responde a una imagen)'];
handler.tags = ['subbot'];
export default handler;