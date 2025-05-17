import yts from 'yt-search';
import fetch from 'node-fetch';

const ytIdRegex = /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/))([a-zA-Z0-9_-]{11})/;

const handler = async (m, { conn, text, command }) => {
  const lower = m.text?.toLowerCase();
  const isAudio = lower === 'audio';
  const isVideo = lower === 'video';

  // Cuando se usa .play
  if (command === 'play') {
    if (!text) return m.reply('✦ Ingresa el nombre o link del video.');

    const res = await yts(text);
    const video = res?.all?.[0];
    if (!video) return m.reply('✦ No se encontró el video.');

    const info = `
*《 DESCARGANDO 》*
*• Título:* ${video.title}
*• Canal:* ${video.author.name}
*• Duración:* ${video.timestamp}
*• Vistas:* ${video.views.toLocaleString()}
*• Publicado:* ${video.ago}
*• Enlace:* ${video.url}

✦ Responde este mensaje con *audio* para obtener el mp3  
✦ O responde con *video* para obtener el mp4
`.trim();

    return await conn.sendMessage(m.chat, {
      image: { url: video.thumbnail },
      caption: info
    }, { quoted: m });
  }

  // Cuando alguien responde con "audio" o "video"
  if ((isAudio || isVideo) && m.quoted) {
    const quotedText = m.quoted?.text || m.quoted?.caption || '';
    const match = ytIdRegex.exec(quotedText);
    if (!match) return;

    const videoUrl = `https://www.youtube.com/watch?v=${match[1]}`;
    m.reply(`⏳ Descargando ${isAudio ? 'audio' : 'video'}...`);

    try {
      if (isAudio) {
        // API de Vreden
        const res = await fetch(`https://api.vredenx.com/api/dl/ytmp3?url=${videoUrl}`);
        const json = await res.json();
        if (!json?.url) throw 'No se pudo descargar el audio con Vreden.';

        return await conn.sendMessage(m.chat, {
          audio: { url: json.url },
          mimetype: 'audio/mpeg',
          ptt: true,
          fileName: '.ytmp3'
        }, { quoted: m });
      } else {
        // API genérica para video
        const res = await fetch(`https://api.neoxr.eu/api/youtube?url=${videoUrl}&type=video&quality=360p&apikey=GataDios`);
        const json = await res.json();
        if (!json?.data?.url) throw 'No se pudo descargar el video.';

        return await conn.sendMessage(m.chat, {
          video: { url: json.data.url },
          caption: '.ytmp4'
        }, { quoted: m });
      }
    } catch (e) {
      m.reply('❌ Error: ' + e);
    }
  }
};

handler.command = ['playt'];
export default handler;