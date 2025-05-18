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
  // Define aquí la lógica para identificar sub-bots si quieres
  return true; // Para que funcione para todos como mencionaste
}

// Handler para setBanner
let setBanner = async (m, { conn }) => {
  const sender = m.sender.split('@')[0];
  if (!esSubBot(sender)) {
    return conn.sendMessage(m.chat, { text: 'Este comando es solo para sub-bots.' }, { quoted: m });
  }
  if (!m.quoted || !m.quoted.image) {
    return conn.sendMessage(m.chat, { text: 'Responde a una imagen con este comando para establecer el banner.' }, { quoted: m });
  }
  const buffer = await m.quoted.download();
  const base64img = buffer.toString('base64');
  const personalizacion = await leerPersonalizacion();
  personalizacion[sender] = personalizacion[sender] || {};
  personalizacion[sender].banner = base64img;
  await guardarPersonalizacion(personalizacion);
  await conn.sendMessage(m.chat, { text: 'Banner actualizado para tu sub-bot.' }, { quoted: m });
};
setBanner.help = ['setbanner'];
setBanner.tags = ['personalizacion'];
setBanner.command = ['setbanner'];

// Handler para setName
let setName = async (m, { conn, args }) => {
  const sender = m.sender.split('@')[0];
  if (!esSubBot(sender)) {
    return conn.sendMessage(m.chat, { text: 'Este comando es solo para sub-bots.' }, { quoted: m });
  }
  if (!args.length) {
    return conn.sendMessage(m.chat, { text: 'Usa: .setName <nuevo nombre>' }, { quoted: m });
  }
  const nuevoNombre = args.join(' ');
  const personalizacion = await leerPersonalizacion();
  personalizacion[sender] = personalizacion[sender] || {};
  personalizacion[sender].name = nuevoNombre;
  await guardarPersonalizacion(personalizacion);
  await conn.sendMessage(m.chat, { text: `Nombre cambiado a "${nuevoNombre}" para tu sub-bot.` }, { quoted: m });
};
setName.help = ['setname'];
setName.tags = ['personalizacion'];
setName.command = ['setname'];

// Handler para setMoneda
let setMoneda = async (m, { conn, args }) => {
  const sender = m.sender.split('@')[0];
  if (!esSubBot(sender)) {
    return conn.sendMessage(m.chat, { text: 'Este comando es solo para sub-bots.' }, { quoted: m });
  }
  if (!args.length) {
    return conn.sendMessage(m.chat, { text: 'Usa: .setMoneda <nombre moneda>' }, { quoted: m });
  }
  const monedaNueva = args.join(' ');
  const personalizacion = await leerPersonalizacion();
  personalizacion[sender] = personalizacion[sender] || {};
  personalizacion[sender].moneda = monedaNueva;
  await guardarPersonalizacion(personalizacion);
  await conn.sendMessage(m.chat, { text: `Moneda cambiada a "${monedaNueva}" para tu sub-bot.` }, { quoted: m });
};
setMoneda.help = ['setmoneda'];
setMoneda.tags = ['personalizacion'];
setMoneda.command = ['setmoneda'];

export { setBanner, setName, setMoneda };