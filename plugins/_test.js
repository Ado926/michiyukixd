import fetch from 'node-fetch';

let handler = async (m, { conn, usedPrefix, command, text }) => {
  if (!text) return m.reply(`✨ Ingresa un texto para buscar en YouTube.\n> *Ejemplo:* ${usedPrefix + command} Shakira`);

  try {
    await m.react('🕓'); // Reacción mientras procesa

    // Buscar en YouTube
    const searchApi = `https://delirius-apiofc.vercel.app/search/ytsearch?q=${text}`;
    const searchResponse = await fetch(searchApi);
    const searchData = await searchResponse.json();

    if (!searchData?.data || searchData.data.length === 0) {
      return m.reply(`⚠️ No se encontraron resultados para "${text}".`);
    }

    const video = searchData.data[0]; // Primer resultado

    // Descargar el audio
    const downloadApi = `https://api.vreden.my.id/api/ytmp3?url=${video.url}`;
    const downloadResponse = await fetch(downloadApi);
    const downloadData = await downloadResponse.json();

    if (!downloadData?.result?.download?.url) {
      return m.reply("❌ No se pudo obtener el audio del video.");
    }

    // Enviar audio como PTT
    await conn.sendMessage(m.chat, {
      audio: { url: downloadData.result.download.url },
      mimetype: 'audio/mpeg',
      ptt: true, // modo nota de voz
      fileName: `${video.title}.mp3`
    }, { quoted: m });

    await m.react("✅"); // Reacción al finalizar
  } catch (error) {
    console.error(error);
    m.reply(`❌ Error al procesar la solicitud:\n${error.message}`);
  }
};

handler.command = ['play', 'playaudio'];
handler.help = ['play <texto>', 'playaudio <texto>'];
handler.tags = ['media'];

export default handler;
