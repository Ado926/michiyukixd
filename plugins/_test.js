import fetch from 'node-fetch';
import { fromBuffer } from 'file-type';

let handler = async (m, { conn, usedPrefix, command, text }) => {
  if (!text) return m.reply(`✨ Ingresa el nombre de una canción.\n\n*Ejemplo:* ${usedPrefix + command} Shakira - Acróstico`);

  try {
    await m.react('🕓');

    // Buscar en YouTube (usando delirius)
    const searchApi = `https://delirius-apiofc.vercel.app/search/ytsearch?q=${encodeURIComponent(text)}`;
    const searchResponse = await fetch(searchApi);
    const searchData = await searchResponse.json();

    if (!searchData?.data || searchData.data.length === 0) {
      return m.reply(`❌ No se encontraron resultados para: "${text}".`);
    }

    const video = searchData.data[0]; // Primer resultado
    const ytUrl = video.url;

    // Descargar desde la API de Vreden
    const apiUrl = `https://api.vreden.my.id/api/ytmp3?url=${ytUrl}`;
    const apiRes = await fetch(apiUrl);
    const json = await apiRes.json();

    if (!json?.result?.download?.url) {
      return m.reply("❌ No se pudo obtener el audio.");
    }

    // Descargar el archivo de audio en buffer
    const audioBuffer = await (await fetch(json.result.download.url)).buffer();
    const fileType = await fromBuffer(audioBuffer);

    // Enviar como nota de voz (PTT)
    await conn.sendMessage(m.chat, {
      audio: audioBuffer,
      mimetype: fileType?.mime || 'audio/mpeg',
      ptt: true,
      fileName: `${video.title}.mp3`
    }, { quoted: m });

    await m.react('✅');

  } catch (e) {
    console.error(e);
    m.reply(`❌ Error al procesar tu solicitud:\n${e.message}`);
  }
};

handler.command = ['play', 'playaudio'];
handler.help = ['play <canción>', 'playaudio <canción>'];
handler.tags = ['descargas'];

export default handler;
