import yt from 'yt-search';
import fetch from 'node-fetch';

const handler = async (m, { conn }) => {
  if (!m.quoted || !m.quoted.text) {
    return m.reply("✦ Responde al mensaje que diga:\n➪ 𝖣𝖾𝗌𝖼𝖺𝗋𝗀𝖺𝗇𝖽𝗈 › título del video");
  }

  // Extraer el título del mensaje citado
  const match = m.quoted.text.match(/➪\s*𝖣𝖾𝗌𝖼𝖺𝗋𝗀𝖺𝗇𝖽𝗈\s*›\s*(.+)/i);
  if (!match) return m.reply("✦ No se pudo detectar el título del video.");
  const query = match[1].trim();

  await conn.sendMessage(m.chat, { react: { text: "🔎", key: m.key } });
  await m.reply(`⏳ Buscando en YouTube: *${query}*`);

  try {
    // Buscar con yt-search
    const result = await yt.search(query);
    if (!result.videos.length) throw 'No se encontró ningún video';

    const video = result.videos[0];
    const videoUrl = video.url;

    // Descargar video con Neoxr API
    const api = `https://api.neoxr.eu/api/youtube?url=${encodeURIComponent(videoUrl)}&type=video&quality=360p&apikey=GataDios`;
    const res = await fetch(api).then(res => res.json());

    if (!res.result?.url) throw 'No se pudo obtener el link de descarga';

    await conn.sendMessage(m.chat, {
      video: { url: res.result.url },
      mimetype: 'video/mp4',
      fileName: `${res.result.title}.mp4`,
      caption: `🎬 *${res.result.title}*`,
    }, { quoted: m });

    await conn.sendMessage(m.chat, { react: { text: "✅", key: m.key } });

  } catch (e) {
    console.error(e);
    m.reply(`❌ Ocurrió un error:\n${e.message || e}`);
  }
};

handler.customPrefix = /^\.?mp4$/i;
handler.command = new RegExp;
handler.help = ["mp4"];
handler.tags = ["descargas"];

export default handler;