import yts from 'yt-search';
import axios from 'axios';

const handler = async (m, { conn, text, command }) => {
  try {
    if (!text) return m.reply(`*Ejemplo:* ${command} Rosa pastel`);

    const search = await yts(text);
    const video = search.videos[0];
    if (!video) return m.reply('⚠ No encontré resultados.');

    const { title, url, timestamp, ago, views, thumbnail } = video;

    const info = `「✦」Descargando: ${title}\n\n` +
                 `> ⏱ *Duración:* ${timestamp}\n` +
                 `> 📅 *Publicado:* ${ago}\n` +
                 `> 👁 *Vistas:* ${views.toLocaleString()}\n` +
                 `> 🔗 *Link:* ${url}`;

          await conn.sendMessage(m.chat, {
        image: { url: vid.thumbnail },
        caption: info,
        ...bcanal
      }, { quoted: m });
    }

    const api = `https://p.oceansaver.in/ajax/download.php?format=360&url=${encodeURIComponent(url)}&api=dfcb6d76f2f6a9894gjkege8a4ab232222`;
    const { data } = await axios.get(api);
    if (!data.success) throw '⛔ No se pudo obtener el video.';

    const { id } = data;

    const checkProgress = async () => {
      while (true) {
        const res = await axios.get(`https://p.oceansaver.in/ajax/progress.php?id=${id}`);
        if (res.data?.success && res.data.progress === 1000) {
          return res.data.download_url;
        }
        await new Promise(r => setTimeout(r, 3000));
      }
    };

    const downloadUrl = await checkProgress();

    await conn.sendMessage(m.chat, {
      video: { url: downloadUrl },
      mimetype: 'video/mp4',
      fileName: `${title}.mp4`,
      caption: `🌟 *Aquí tienes tu video* 🌟\n\n` +
               `🎬 *Título:* ${title}\n\n` +
               `⚔️ _Enviado por Michi Bot_ ⚔️`
    }, { quoted: m });

  } catch (err) {
    console.error(err);
    return m.reply('⚠ *Error al obtener o enviar el video.*');
  }
};

handler.command = ['play2', 'ytv', 'ytmp4'];
handler.tags = ['downloader'];
handler.help = ['play2 <texto>'];

export default handler;
