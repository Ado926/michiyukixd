import fetch from "node-fetch";
import axios from 'axios';

let handler = async (m, { conn, text, usedPrefix, command, args }) => {
  try {
    if (!text) return conn.reply(m.chat, `❀ Ejemplo de uso: ${usedPrefix + command} https://youtube.com/watch?v=Hx920thF8X4`, m);

    if (!/^(?:https?:\/\/)?(?:www\.|m\.|music\.)?youtu\.?be(?:\.com)?\/?.*(?:watch|embed)?(?:.*v=|v\/|\/)([\w\-_]+)\&?/.test(args[0])) {
      return m.reply(`⚠️ Enlace inválido. Asegúrate de usar un link de YouTube válido.`);
    }

    m.react('🕛');

    let json = await ytdl(args[0]);

    if (json.seconds > 3300) return m.reply('❌ El video es demasiado largo (más de 55 minutos). No se descargará para evitar errores.');

    let size = await getSize(json.url);
    if (!size) return m.reply('❌ No se pudo obtener el tamaño del archivo.');

    const cap = `Aqui tienes :D\n> Titulo: ${json.title}`;

    await conn.sendMessage(m.chat, {
      video: { url: json.url },
      caption: cap,
      mimetype: 'video/mp4',
      contextInfo: {
        externalAdReply: {
          title: "🐤",
          body: "✐ 𝖯𝗈𝗐𝖾𝗋𝖾𝖽 𝖡𝗒 𝖶𝗂𝗋𝗄 💛",
          mediaUrl: "https://chat.whatsapp.com/KqkJwla1aq1LgaPiuFFtEY",
          mediaType: 1,
          showAdAttribution: true,
          renderLargerThumbnail: true
        }
      }
    }, { quoted: m });

    m.react('✅');
  } catch (e) {
    m.reply(`❌ Ocurrió un error:\n${e}`);
  }
};

handler.help = ['ytmp4'];
handler.command = ['ytv2', 'ytmp4', 'ytv'];
handler.tags = ['dl'];
handler.diamond = true;

export default handler;

async function ytdl(url) {
  const headers = {
    "accept": "*/*",
    "accept-language": "es-ES,es;q=0.9",
    "sec-ch-ua": '"Not A(Brand";v="8", "Chromium";v="132"',
    "sec-ch-ua-mobile": "?1",
    "sec-ch-ua-platform": '"Android"',
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "cross-site",
    "Referer": "https://id.ytmp3.mobi/",
    "Referrer-Policy": "strict-origin-when-cross-origin"
  };

  const initial = await fetch(`https://d.ymcdn.org/api/v1/init?p=y&23=1llum1n471&_=${Math.random()}`, { headers });
  const init = await initial.json();
  const id = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/))([^&?/]+)/)?.[1];
  const convertURL = `${init.convertURL}&v=${id}&f=mp4&_=${Math.random()}`;

  const converts = await fetch(convertURL, { headers });
  const convert = await converts.json();

  let info = {};
  for (let i = 0; i < 3; i++) {
    const progressResponse = await fetch(convert.progressURL, { headers });
    info = await progressResponse.json();
    if (info.progress === 3) break;
  }

  return {
    url: convert.downloadURL,
    title: info.title,
    seconds: info.duration || 0
  };
}

async function getSize(url) {
  try {
    const response = await axios.head(url);
    const contentLength = response.headers['content-length'];
    return contentLength ? parseInt(contentLength, 10) : null;
  } catch {
    return null;
  }
}