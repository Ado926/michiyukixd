import fetch from 'node-fetch';

let handler = async (m, { conn, usedPrefix, command, text }) => {
  if (!text) return m.reply(`✨ Ingresa un texto para buscar en YouTube.\n> *Ejemplo:* ${usedPrefix + command} Shakira`);

  try {
    // 1. Buscar video
    const searchApi = `https://delirius-apiofc.vercel.app/search/ytsearch?q=${encodeURIComponent(text)}`;
    const searchResponse = await fetch(searchApi);
    const searchData = await searchResponse.json();

    if (!searchData?.data || searchData.data.length === 0) {
      return m.reply(`⚠️ No se encontraron resultados para "${text}".`);
    }

    const video = searchData.data[0]; // Primer resultado
    const videoUrl = video.url;
    const videoTitle = video.title;

    // 2. Descargar audio
    const downloadApi = `https://api.vreden.my.id/api/ytmp3?url=${encodeURIComponent(videoUrl)}`;
    const downloadResponse = await fetch(downloadApi);
    const contentType = downloadResponse.headers.get('content-type');

    if (!contentType?.includes('application/json')) {
      throw new Error('La respuesta no es JSON. La API puede estar fallando.');
    }

    const downloadData = await downloadResponse.json();
    const audio = downloadData?.result?.download;

    if (!audio?.url) {
      return m.reply("❌ No se pudo obtener el audio del video.");
    }

    // 3. Enviar mensaje decorado
    const infoMessage = `「✦」Descargando *<${videoTitle}>*

> ✐ Canal » *${video.author.name}*
> ⴵ Duración » *${video.duration}*
> ✰ Calidad: *${audio.quality || 'Desconocida'}*
> ❒ Tamaño » *${audio.size || 'Desconocido'}*
> 🜸 Link » ${videoUrl}`;

    await conn.sendMessage(m.chat, {
      image: { url: video.image },
      caption: infoMessage
    }, { quoted: m });

    // 4. Enviar el audio como nota de voz
    await conn.sendMessage(m.chat, {
      audio: { url: audio.url },
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
