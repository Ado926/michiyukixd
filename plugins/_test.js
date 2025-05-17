import fetch from "node-fetch";
import yts from "yt-search";

const ytIdRegex = /(?:youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;

const handler = async (m, { conn, text }) => {
  const isAudio = text?.toLowerCase() === 'audio';
  const isVideo = text?.toLowerCase() === 'video';

  if (isAudio || isVideo) {
    console.log("Se detectó respuesta con audio o video");

    if (!m.quoted) return m.reply("⚠️ Por favor, responde a un mensaje que contenga la info del video.");

    const quotedText = m.quoted?.text || m.quoted?.caption || '';
    console.log("Texto citado:", quotedText);

    const match = ytIdRegex.exec(quotedText);
    console.log("Regex match:", match);

    if (!match) return m.reply("⚠️ No encontré un enlace de YouTube en el mensaje al que respondiste.");

    const videoUrl = `https://www.youtube.com/watch?v=${match[1]}`;
    console.log("URL del video detectada:", videoUrl);

    m.reply(`⏳ Descargando ${isAudio ? 'audio' : 'video'}...`);

    try {
      if (isAudio) {
        const res = await fetch(`https://api.vreden.my.id/api/ytmp3?url=${videoUrl}`);
        const json = await res.json();
        console.log("Respuesta API audio:", json);

        if (!json?.result?.download?.url) throw 'No se pudo obtener el link de descarga de audio.';

        await conn.sendMessage(m.chat, {
          audio: { url: json.result.download.url },
          mimetype: 'audio/mpeg',
          ptt: true,
          fileName: `${json.result.title || 'audio'}.mp3`
        }, { quoted: m });

      } else {
        const res = await fetch(`https://api.neoxr.eu/api/youtube?url=${videoUrl}&type=video&quality=360p&apikey=GataDios`);
        const json = await res.json();
        console.log("Respuesta API video:", json);

        if (!json?.data?.url) throw 'No se pudo obtener el link de descarga de video.';

        await conn.sendMessage(m.chat, {
          video: { url: json.data.url },
          caption: json.data.title || '.ytmp4',
          fileName: `${json.data.title || 'video'}.mp4`
        }, { quoted: m });
      }
    } catch (e) {
      console.error("Error descargando:", e);
      return m.reply("❌ Error al descargar: " + e);
    }
    return; // para evitar seguir con la búsqueda
  }

  if (!text) return m.reply("✦ Ingresa el nombre o link de un video.");

  // Busqueda y envío info
  const res = await yts(text);
  const video = res.all[0];
  if (!video) return m.reply("✦ No se encontró el video.");

  const { title, timestamp, views, url, thumbnail, author, ago } = video;

  const msg = `
➪ Descargando › *${title}*

> ✰ Canal › *${author.name}*
> ✰ Duración › *${timestamp}*
> ✰ Vistas › *${views}*
> ✰ Publicado › *${ago}*
> ✰ Enlace › *${url}*

Responde con "audio" para obtener solo el audio, o "video" para obtener el video completo.
  `.trim();

  await conn.sendMessage(m.chat, {
    image: { url: thumbnail },
    caption: msg
  }, { quoted: m });
};

handler.command = ["playt"];
handler.help = handler.command;
handler.tags = ["downloader"];

export default handler;