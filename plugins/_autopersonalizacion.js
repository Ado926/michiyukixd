import fetch from 'node-fetch';

let handler = async (m, { conn, usedPrefix, command, text }) => {
  if (!text) return m.reply(`✨ Ingresa un texto para buscar en YouTube.\n> *Ejemplo:* ${usedPrefix + command} Shakira`);

  try {
    const searchApi = `https://delirius-apiofc.vercel.app/search/ytsearch?q=${text}`;
    const searchResponse = await fetch(searchApi);
    const searchData = await searchResponse.json();

    if (!searchData?.data || searchData.data.length === 0) {
      return m.reply(`⚠️ No se encontraron resultados para "${text}".`);
    }

    const video = searchData.data[0]; // Primer resultado
    const videoTitle = video.title;
    const videoUrl = video.url;

    const downloadApi = `https://api.vreden.my.id/api/ytmp3?url=${videoUrl}`;
    const downloadResponse = await fetch(downloadApi);
    const downloadData = await downloadResponse.json();

    if (!downloadData?.result?.download?.url) {
      return m.reply("❌ No se pudo obtener el audio del video.");
    }

    const audioUrl = downloadData.result.download.url;
    const calidad = downloadData.result.quality || 'Desconocida';
    const peso = downloadData.result.size || 'Desconocido';

    const infoMessage = `「✦」Descargando *<${videoTitle}>*

> ✐ Canal » *${video.author.name}*
> ⴵ Duración » *${video.duration}*
> ✰ Calidad: *${calidad}*
> ❒ Tamaño » *${peso}*
> 🜸 Link » ${videoUrl}`;

    await conn.sendMessage(m.chat, {
      image: { url: video.image },
      caption: infoMessage
    }, { quoted: m });

    await conn.sendMessage(m.chat, {
      audio: { url: audioUrl },
      mimetype: 'audio/mpeg',
      fileName: `${videoTitle}.mp3`,
      ptt: true
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
