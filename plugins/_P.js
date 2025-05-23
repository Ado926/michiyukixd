import fetch from 'node-fetch';
import yts from 'yt-search';

const handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) return conn.reply(m.chat, `❗ Ingresa el nombre o link del video`, m);

  try {
    const search = await yts(text);
    const video = search.videos[0];
    if (!video) return conn.reply(m.chat, `⚠ No se encontró el video.`, m);

    const { title, url, timestamp, views, ago, thumbnail } = video;

    const caption = `
🌸 *Título:* ${title}
🕓 *Duración:* ${timestamp}
👁 *Vistas:* ${views}
⏳ *Publicado:* ${ago}
🔗 *Enlace:* ${url}
`;

    const thumb = await (await fetch(thumbnail)).buffer();

    await conn.sendMessage(m.chat, {
      image: thumb,
      caption,
    }, { quoted: m });

    await conn.sendMessage(m.chat, {
      text: "⏳ *Descargando video...*",
    }, { quoted: m });

    // === YTDLP (video) ===
    try {
      const ytdlpRes = await fetch(`https://aemt.me/ytdlp?url=${url}`);
      const ytdlpJson = await ytdlpRes.json();

      if (ytdlpJson?.result?.video) {
        return await conn.sendMessage(m.chat, {
          video: { url: ytdlpJson.result.video },
          mimetype: 'video/mp4',
          fileName: `${title}.mp4`,
          caption: `🎬 *${title}*`,
        }, { quoted: m });
      }
    } catch (e) {
      console.error("❌ Error con ytdlp:", e.message);
    }

    // === SaveTube (video backup) ===
    try {
      const savetubeRes = await fetch(`https://weeb-api.vercel.app/api/youtube?url=${url}`);
      const data = await savetubeRes.json();

      const videoUrl = data?.result?.video?.url || data?.result?.sd?.url;
      if (videoUrl) {
        return await conn.sendMessage(m.chat, {
          video: { url: videoUrl },
          mimetype: 'video/mp4',
          fileName: `${title}.mp4`,
          caption: `🎬 *${title}*`,
        }, { quoted: m });
      }
    } catch (e) {
      console.error("❌ Error con SaveTube:", e.message);
    }

    return conn.reply(m.chat, '❌ No se pudo descargar el video.', m);

  } catch (err) {
    console.error(err);
    conn.reply(m.chat, '❌ Hubo un error inesperado.', m);
  }
};

handler.command = ['play2', 'ytv'];
handler.help = ['play2 <texto o link>'];
handler.tags = ['downloader'];

export default handler;