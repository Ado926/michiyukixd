import Starlights from '@StarlightsTeam/Scraper';
import ytdl from 'ytdl-core';

let limitMB = 500; // Límite para usuarios normales

let handler = async (m, { conn, text, isPrems, isOwner, usedPrefix, command }) => {
  if (!text) return m.reply(`✨ Usa el comando así:\n${usedPrefix + command} <nombre o enlace del video>`);

  let user = global.db.data.users[m.sender];
  if (isOwner || isPrems) limitMB = 999;

  await m.react('🕓');

  try {
    // Buscar el video por nombre con Starlights
    let searchResult = await Starlights.ytsearch(text);
    if (!searchResult || !searchResult[0]) throw new Error('No se encontraron resultados.');

    let videoId = searchResult[0].id;

    // Descargar video mp4 con Starlights
    let { title, size, quality, thumbnail, dl_url } = await Starlights.ytmp4(videoId);

    if (parseFloat(size) >= limitMB) {
      await m.reply(`El archivo pesa más de ${limitMB} MB, descarga cancelada.`);
      return m.react('✖️');
    }

    // Enviar video como archivo normal o documento según configuración del usuario
    await conn.sendFile(m.chat, dl_url, `${title}.mp4`, `*» Título:* ${title}\n*» Calidad:* ${quality}`, m, false, { asDocument: user.useDocument });
    await m.react('✅');

  } catch (e) {
    // En caso de error, intentar con ytdl-core
    try {
      // Revisar si el texto es URL o buscar información con ytdl
      let videoUrl = text.match(/^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/) ? text : null;

      if (!videoUrl) {
        // Buscar con ytdl no es directo, mejor mensaje de error
        throw new Error('No se pudo descargar el video.');
      }

      let info = await ytdl.getInfo(videoUrl);
      let format = ytdl.chooseFormat(info.formats, { quality: '18' }); // mp4 360p

      let sizeBytes = format.contentLength || '0';
      let sizeMB = parseInt(sizeBytes) / 1048576;
      if (sizeMB >= limitMB) {
        await m.reply(`El video pesa más de ${limitMB} MB. Descarga cancelada.`);
        return m.react('✖️');
      }

      await conn.sendFile(m.chat, format.url, `${info.videoDetails.title}.mp4`, `*» Título:* ${info.videoDetails.title}\n*» Calidad:* 360p`, m, false, { asDocument: user.useDocument });
      await m.react('✅');

    } catch (err) {
      console.error(err);
      await m.react('✖️');
      await m.reply('❌ Falló la descarga con todas las fuentes.');
    }
  }
};

handler.help = ['play2 <nombre o enlace>'];
handler.tags = ['downloader'];
handler.command = /^play2$/i;

export default handler;
