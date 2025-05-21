import fetch from 'node-fetch';
import { fromBuffer } from 'file-type';

let handler = async (m, { conn, usedPrefix, command, text }) => {
  if (!text) return m.reply(`✨ Ingresa un texto para buscar en YouTube.\n> *Ejemplo:* ${usedPrefix + command} Shakira`);

  try {
    await m.react('🕓');

    // Buscar en YouTube
    const searchApi = `https://delirius-apiofc.vercel.app/search/ytsearch?q=${text}`;
    const searchResponse = await fetch(searchApi);
    const searchData = await searchResponse.json();

    if (!searchData?.data || searchData.data.length === 0) {
      return m.reply(`⚠️ No se encontraron resultados para "${text}".`);
    }

    const video = searchData.data[0]; // Primer resultado

    // Descargar desde API de Vreden
    const downloadApi = `https://api.vreden.my.id/api/ytmp3?url=${video.url}`;
    const downloadResponse = await fetch(downloadApi);
    const downloadData = await downloadResponse.json();

    if (!downloadData?.result?.download?.url) {
      return m.reply("❌ No se pudo obtener el audio del video.");
    }

    // Descargar audio en buffer
    const audioRes = await fetch(downloadData.result.download.url);
    const audioBuffer = await audioRes.buffer();
    const type = await fromBuffer(audioBuffer);

    // Enviar como nota de voz (PTT)
    await conn.sendMessage(m.chat, {
      audio: audioBuffer,
      mimetype: type?.mime || 'audio/mpeg',
      ptt: true,
      fileName: `${video.title}.mp3`
    }, { quoted: m });

    await m.react("✅");
  } catch (error) {
    console.error(error);
    m.reply(`❌ Error al procesar la solicitud:\n${error.message}`);
  }
};

handler.command = ['play', 'playaudio'];
handler.help = ['play <texto>', 'playaudio <texto>'];
handler.tags = ['media'];

export default handler;
