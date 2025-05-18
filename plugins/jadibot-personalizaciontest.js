import fs from 'fs/promises';
import path from 'path';

const PERSONALIZACION_PATH = path.resolve('./personalizacion.json');

async function leerPersonalizacion() {
  try {
    const data = await fs.readFile(PERSONALIZACION_PATH, 'utf-8');
    return JSON.parse(data);
  } catch {
    return {};
  }
}

async function guardarPersonalizacion(data) {
  await fs.writeFile(PERSONALIZACION_PATH, JSON.stringify(data, null, 2));
}

function esSubBot(numero) {
  return true; // Todos pueden ser sub-bots
}

let handler = async (m, { conn }) => {
  const sender = m.sender.split('@')[0];
  if (!esSubBot(sender)) {
    return m.reply('Este comando es solo para sub-bots.');
  }
  if (!m.quoted || !m.quoted.image) {
    return m.reply('Responde a una imagen con este comando para establecer el banner.');
  }
  const buffer = await m.quoted.download();
  const base64img = buffer.toString('base64');
  const personalizacion = await leerPersonalizacion();
  personalizacion[sender] = personalizacion[sender] || {};
  personalizacion[sender].banner = base64img;
  await guardarPersonalizacion(personalizacion);
  m.reply('Banner actualizado para tu sub-bot.');
};

handler.command = ['setbanner'];
handler.help = ['setbanner (responde a una imagen)'];
handler.tags = ['subbot'];
export default handler;