import fetch from 'node-fetch';

const ytLinkRegex = /https?:\/\/(?:www\.)?youtu(?:be\.com|\.be)\/[^\s]+/;

async function tryDownloadVideo(url) {
  const apiUrl = `https://api.neoxr.eu/api/youtube?url=${encodeURIComponent(url)}&type=video&quality=360p&apikey=GataDios`;
  const res = await fetch(apiUrl);
  const json = await res.json();

  console.log('Respuesta API Neoxr:', JSON.stringify(json, null, 2));

  if (json.status === 'success' && json.result?.url) {
    return {
      videoUrl: json.result.url,
      title: json.result.title || 'Video'
    };
  } else {
    throw new Error('No se encontró URL de video en la respuesta.');
  }
}

const handler = async (m, { conn }) => {
  if (!m.quoted || !m.quoted.text || !m.quoted.text.includes('乂  Y O U T U B E  -  P L A Y'))
    return m.reply('✦ Debes responder a un mensaje que contenga "乂  Y O U T U B E  -  P L A Y".');

  const linkMatch = m.quoted.text.match(ytLinkRegex);
  if (!linkMatch) return m.reply('✦ No se encontró un enlace de YouTube en el mensaje citado.');

  const videoPageUrl = linkMatch[0];

  conn.sendMessage(m.chat, { react: { text: '🚀', key: m.key } });

  try {
    const { videoUrl, title } = await tryDownloadVideo(videoPageUrl);

    const videoBuffer = await fetch(videoUrl).then(r => r.buffer());

    await conn.sendMessage(m.chat, {
      video: videoBuffer,
      fileName: 'video.mp4',
      mimetype: 'video/mp4',
      caption: `乂  Y O U T U B E  -  V I D E O\n\nTítulo: ${title}`
    }, { quoted: m });

    conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } });

  } catch (e) {
    m.reply('⚠︎ Error al descargar: ' + e.message);
  }
};

handler.customPrefix = /^(video|Video|mp4|Mp4)$/i;
handler.command = new RegExp();
handler.help = ['video'];
handler.tags = ['downloader'];

export default handler;