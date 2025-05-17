import fetch from "node-fetch";
import yts from "yt-search";

const ytIdRegex = /(?:youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;

const handler = async (m, { conn, text }) => {
  const command = m.text?.toLowerCase();

  // Caso respuesta a mensaje con "audio" o "video"
  if ((command === "audio" || command === "video") && m.quoted) {
    const quotedText = m.quoted.text || m.quoted.caption || "";
    const match = ytIdRegex.exec(quotedText);
    if (!match) return m.reply("No encontré el enlace de YouTube en el mensaje citado.");

    const videoUrl = `https://www.youtube.com/watch?v=${match[1]}`;

    m.reply(`Descargando ${command}... espera un momento.`);

    try {
      if (command === "audio") {
        const res = await fetch(`https://api.vreden.my.id/api/ytmp3?url=${videoUrl}`);
        const json = await res.json();

        if (!json?.result?.download?.url) return m.reply("Error obteniendo el audio.");

        await conn.sendMessage(m.chat, {
          audio: { url: json.result.download.url },
          mimetype: "audio/mpeg",
          ptt: false,
          fileName: `${json.result.title}.mp3`
        }, { quoted: m });
      } else {
        // Video con otra API que funcione
        const res = await fetch(`https://api.neoxr.eu/api/youtube?url=${videoUrl}&type=video&quality=360p&apikey=GataDios`);
        const json = await res.json();

        if (!json?.data?.url) return m.reply("Error obteniendo el video.");

        await conn.sendMessage(m.chat, {
          video: { url: json.data.url },
          caption: json.data.title,
          fileName: `${json.data.title}.mp4`
        }, { quoted: m });
      }
    } catch (e) {
      console.error(e);
      return m.reply("Ocurrió un error al descargar.");
    }
    return;
  }

  // Caso búsqueda inicial con .playt
  if (!text) return m.reply("Ingresa el nombre o link del video.");

  const res = await yts(text);
  const video = res.all.find(v => v.seconds && v.seconds > 0);

  if (!video) return m.reply("No encontré ningún video.");

  const { title, timestamp, views, url, thumbnail, author, ago } = video;

  const message = `
Título: ${title}
Canal: ${author.name}
Duración: ${timestamp}
Vistas: ${views}
Publicado: ${ago}
Enlace: ${url}

Responde con "audio" para obtener el audio o "video" para obtener el video completo.
  `.trim();

  await conn.sendMessage(m.chat, {
    image: { url: thumbnail },
    caption: message
  }, { quoted: m });
};

handler.command = ["playt"];
handler.help = handler.command;
handler.tags = ["downloader"];

export default handler;