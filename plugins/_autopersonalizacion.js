import yts from 'yt-search';
import { download } from 'savetube'; // asegúrate que esta función está definida y funcionando

function barraCarga() {
  const frames = ['▱▱▱▱▱', '▰▱▱▱▱', '▰▰▱▱▱', '▰▰▰▱▱', '▰▰▰▰▱', '▰▰▰▰▰'];
  return frames.map((f, i) => `⌛ Cargando ${f} ${Math.round((i + 1) * 20)}%`).join('\n');
}

function formatDuration(seconds) {
  const min = Math.floor(seconds / 60);
  const sec = seconds % 60;
  return `${min}m ${sec}s`;
}

const handler = async (m, { conn, args, command }) => {
  if (!args[0]) return m.reply(`
*✦ Formato correcto:*
• .play <texto o enlace>
• .play2 <texto o enlace>
`);

  let query = args.join(' ');
  let url = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\//.test(query) ? query : null;

  try {
    await conn.sendMessage(m.chat, { react: { text: '🔎', key: m.key } });
    await m.reply(barraCarga());

    if (!url) {
      const search = await yts(query);
      if (!search.videos.length) return m.reply('⚠️ No encontré resultados.');
      url = search.videos[0].url;
    }

    const format = command === 'play' ? 'mp3' : '360';
    const result = await download(url, format);

    if (!result.status) return m.reply(`❌ Error: ${result.error}`);

    const { title, download: dlUrl, type, thumbnail, duration, quality } = result.result;
    const dur = formatDuration(duration);

    const caption = type === 'video'
      ? `
┌───「 *Michi Bot - Video* 」
▢ *Título:* ${title}
▢ *Tipo:* Video 🎬 (${quality}p)
▢ *Duración:* ${dur}
▢ *Enlace:* ${url}
└────────────────
      `.trim()
      : `
┌───「 *Michi Bot - Música* 」
▢ *Título:* ${title}
▢ *Tipo:* Audio 🎵
▢ *Duración:* ${dur}
▢ *Enlace:* ${url}
└────────────────
      `.trim();

    if (type === 'video') {
      await conn.sendMessage(m.chat, {
        video: { url: dlUrl },
        caption
      }, { quoted: m });
    } else {
      await conn.sendMessage(m.chat, {
        audio: { url: dlUrl },
        mimetype: 'audio/mpeg',
        ptt: true,
        fileName: `${title}.mp3`,
        contextInfo: {
          externalAdReply: {
            title,
            body: 'Michi Bot - Descarga Rápida',
            thumbnailUrl: thumbnail,
            mediaType: 2,
            mediaUrl: url,
            sourceUrl: url,
            renderLargerThumbnail: true
          }
        }
      }, { quoted: m });
    }

    await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } });

  } catch (e) {
    console.error(e);
    m.reply('❌ Ocurrió un error al procesar tu solicitud.');
  }
};

handler.help = ['play <texto o url>', 'play2 <texto o url>'];
handler.tags = ['downloader'];
handler.command = ['play', 'play2'];
handler.register = true;

export default handler;