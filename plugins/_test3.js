import fetch from 'node-fetch';
import yt from 'yt-search';

const handler = async (m, { conn }) => {
  try {
    // Solo si el texto es "Video" o "video"
    if (!/^video$/i.test(m.text)) return;

    if (!m.quoted || !m.quoted.text) {
      return m.reply('✦ Responde a un mensaje que diga:\n➪ 𝖣𝖾𝗌𝖼𝖺𝗋𝗀𝖺𝗇𝖽𝗈 › título del video');
    }

    const texto = m.quoted.text;
    const match = texto.match(/➪\s*𝖣𝖾𝗌𝖼𝖺𝗋𝗀𝖺𝗇𝖽𝗈\s*›\s*(.*)/i);
    if (!match) return m.reply('✦ No se pudo extraer el título del video.');

    const title = match[1].trim();
    await conn.sendMessage(m.chat, { react: { text: "🎥", key: m.key } });

    const search = await yt.search(title);
    const video = search.videos[0];
    if (!video) throw '✦ No se encontró el video.';

    const api = `https://api.neoxr.eu/api/youtube?url=${encodeURIComponent(video.url)}&type=video&quality=360p&apikey=GataDios`;
    const res = await fetch(api);
    const json = await res.json();

    if (!json.result?.url) throw '✦ No se encontró la URL del video.';

    await conn.sendMessage(m.chat, {
      video: { url: json.result.url },
      mimetype: 'video/mp4',
      fileName: `${json.result.title}.mp4`,
      caption: `🎬 *${json.result.title}*`,
    }, { quoted: m });

    await conn.sendMessage(m.chat, { react: { text: "✅", key: m.key } });

  } catch (e) {
    console.error(e);
    m.reply(`✦ Error:\n${e.message || e}`);
  }
};

handler.customPrefix = /^video$/i;
handler.command = new RegExp; // sin prefijo
handler.register = true;
handler.fail = null;
handler.exp = 0;

export default handler;