import fetch from "node-fetch";
import yts from "yt-search";
import axios from "axios";
const youtubeRegexID = /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([a-zA-Z0-9_-]{11})/;

const handler = async (m, { conn, text, usedPrefix, command }) => {
  try {
    if (!text.trim()) {
      return conn.reply(m.chat, `❀ Por favor, ingresa el nombre de la música a descargar.`, m);
    }

    let videoIdToFind = text.match(youtubeRegexID) || null;
    let ytplay2 = await yts(videoIdToFind === null ? text : 'https://youtu.be/' + videoIdToFind[1]);

    if (videoIdToFind) {
      const videoId = videoIdToFind[1];
      ytplay2 = ytplay2.all.find(item => item.videoId === videoId) || ytplay2.videos.find(item => item.videoId === videoId);
    }

    ytplay2 = ytplay2.all?.[0] || ytplay2.videos?.[0] || ytplay2;
    if (!ytplay2 || ytplay2.length === 0) {
      return m.reply('✧ No se encontraron resultados para tu búsqueda.');
    }

    let { title, thumbnail, timestamp, views, ago, url, author } = ytplay2;
    title = title || 'Desconocido';
    thumbnail = thumbnail || '';
    timestamp = timestamp || 'Desconocido';
    views = views || 'Desconocido';
    ago = ago || 'Desconocido';
    url = url || '';
    author = author || { name: 'Desconocido' };

    const vistas = formatViews(views);
    const canal = author.name;

    const infoMessage = `⬤ Descargando: *${title}*

     *↻ ◁ II ▷ ↺*

*〘•〙* Canal: *${canal}*
*〘•〙* Vistas: *${vistas}*
*〘•〙* Duración: *${timestamp}*
*〘•〙* Publicado: *${ago}*
*〘•〙* Link: ${url}`;

    const thumb = (await conn.getFile(thumbnail)).data;

    const JT = {
      contextInfo: {
        externalAdReply: {
          title: '☁️ 𓃠 𝗠𝗶𝗰𝗵𝗶・𝗔𝗜・𝗕𝗼𝘁 ✩',
          body: '𝗦𝘂 𝗽𝗲𝗱𝗶𝗱𝗼 𝘀𝗲𝗿𝗮́ 𝗲𝗻𝘃𝗶𝗮𝗱𝗼 𝗲𝗻 𝗯𝗿𝗲𝘃𝗲..',
          mediaType: 1,
          previewType: 0,
          mediaUrl: url,
          sourceUrl: url,
          thumbnail: thumb,
          renderLargerThumbnail: true,
        },
        forwardingScore: 999,
        isForwarded: true,
        mentionedJid: [],
        forwardingScore: 999,
        externalAdReply: {
          title: "vivos vivientes",
          body: "Canal oficial",
          thumbnail: thumb,
          sourceUrl: url,
          mediaType: 1,
          renderLargerThumbnail: true
        },
        messageForwardedFrom: "120363402846939411@newsletter"
      }
    };

    await conn.reply(m.chat, infoMessage, m, JT);

    if (['play', 'yta', 'ytmp3', 'playaudio'].includes(command)) {
      try {
        const api = await (await fetch(`https://api.vreden.my.id/api/ytmp3?url=${url}`)).json();
        const result = api.result.download.url;
        if (!result) throw new Error('⚠ El enlace de audio no se generó correctamente.');
        await conn.sendMessage(
          m.chat,
          { audio: { url: result }, fileName: `${api.result.title}.mp3`, mimetype: 'audio/mpeg', ptt: true },
          { quoted: m }
        );
      } catch (e) {
        return conn.reply(m.chat, '⚠︎ No se pudo enviar el audio. Puede que sea muy pesado o hubo un error.', m);
      }
    } else if (['play2', 'ytv', 'ytmp4', 'mp4'].includes(command)) {
      try {
        const response = await fetch(`https://api.neoxr.eu/api/youtube?url=${url}&type=video&quality=480p&apikey=GataDios`);
        const json = await response.json();
        await conn.sendFile(m.chat, json.data.url, json.title + '.mp4', title, m);
      } catch (e) {
        return conn.reply(m.chat, '⚠︎ No se pudo enviar el video. Puede que sea muy pesado o hubo un error.', m);
      }
    } else {
      return conn.reply(m.chat, '✧︎ Comando no reconocido.', m);
    }
  } catch (error) {
    return m.reply(`⚠︎ Ocurrió un error: ${error}`);
  }
};

handler.command = handler.help = ['play', 'yta', 'ytmp3', 'play2', 'ytv', 'ytmp4', 'playaudio', 'mp4'];
handler.tags = ['descargas'];
handler.group = true;

export default handler;

function formatViews(views) {
  if (views === undefined) return "No disponible";
  if (views >= 1_000_000_000) return `${(views / 1_000_000_000).toFixed(1)}B (${views.toLocaleString()})`;
  if (views >= 1_000_000) return `${(views / 1_000_000).toFixed(1)}M (${views.toLocaleString()})`;
  if (views >= 1_000) return `${(views / 1_000).toFixed(1)}k (${views.toLocaleString()})`;
  return views.toString();
}
