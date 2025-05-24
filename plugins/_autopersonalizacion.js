// editado por
// https://github.com/Ado926

import fetch from "node-fetch";
import yts from "yt-search";
import axios from "axios";

const formatAudio = ["mp3", "m4a", "webm", "acc", "flac", "opus", "ogg", "wav"];
const formatVideo = ["360", "480", "720", "1080", "1440", "4k"];

const ddownr = {
  download: async (url, format) => {
    if (!formatAudio.includes(format) && !formatVideo.includes(format)) {
      throw new Error("⚠ Formato no soportado, elige uno de la lista disponible.");
    }

    const config = {
      method: "GET",
      url: `https://p.oceansaver.in/ajax/download.php?format=${format}&url=${encodeURIComponent(url)}&api=dfcb6d76f2f6a9894gjkege8a4ab232222`,
      headers: {
        "User-Agent": "Mozilla/5.0"
      }
    };

    try {
      const response = await axios.request(config);
      if (response.data?.success) {
        const { id, title, info } = response.data;
        const downloadUrl = await ddownr.cekProgress(id);
        return { id, title, image: info.image, downloadUrl };
      } else {
        throw new Error("⛔ No se pudo obtener los detalles del video.");
      }
    } catch (error) {
      console.error("❌ Error:", error);
      throw error;
    }
  },

  cekProgress: async (id) => {
    const config = {
      method: "GET",
      url: `https://p.oceansaver.in/ajax/progress.php?id=${id}`,
      headers: {
        "User-Agent": "Mozilla/5.0"
      }
    };

    try {
      while (true) {
        const response = await axios.request(config);
        if (response.data?.success && response.data.progress === 1000) {
          return response.data.download_url;
        }
        await new Promise(resolve => setTimeout(resolve, 5000));
      }
    } catch (error) {
      console.error("❌ Error:", error);
      throw error;
    }
  }
};

const handler = async (m, { conn, text, usedPrefix, command }) => {
  try {
    if (!text.trim()) {
      return conn.reply(m.chat, `*${usedPrefix}${command} <nombre del video>*`, m);
    }

    const search = await yts(text);
    if (!search.all.length) {
      return m.reply("⚠ No se encontraron resultados para tu búsqueda.");
    }

    const videoInfo = search.all[0];
    const { title, thumbnail, timestamp, views, ago, url } = videoInfo;
    const vistas = formatViews(views);
    const thumbData = await conn.getFile(thumbnail);
    const thumb = thumbData?.data || null;

    const infoMessage = `「✦」Descargando *<${title}>*

> ☔ Canal *»* *${videoInfo.author.name || 'Desconocido'}*
> ☔ Duración *»* *${timestamp}*
> ☔ Vistas *»* *${vistas}*
> ☔ Publicado *»* *${ago}*
> ☔ Link *»* ${url}`;

    // Mostrar el mensaje de info de inmediato
    if (thumb) {
      conn.sendMessage(m.chat, { image: thumb, caption: infoMessage }, { quoted: m });
    } else {
      conn.reply(m.chat, infoMessage, m);
    }

    // Enviar audio rápidamente (no usar await bloqueante)
    if (["play", "yta", "ytmp3"].includes(command)) {
      ddownr.download(url, "mp3").then(api => {
        conn.sendMessage(m.chat, {
          audio: { url: api.downloadUrl },
          mimetype: "audio/mpeg",
          ptt: true
        }, { quoted: m });
      }).catch(err => {
        console.error("❌ Error al descargar audio:", err);
        conn.reply(m.chat, "⛔ No se pudo descargar el audio.", m);
      });

    } else if (["play2", "ytv", "ytmp4"].includes(command)) {
      const sources = [
        `https://api.siputzx.my.id/api/d/ytmp4?url=${url}`,
        `https://api.zenkey.my.id/api/download/ytmp4?apikey=zenkey&url=${url}`,
        `https://axeel.my.id/api/download/video?url=${encodeURIComponent(url)}`,
        `https://delirius-apiofc.vercel.app/download/ytmp4?url=${url}`
      ];

      let success = false;
      for (let source of sources) {
        try {
          const res = await fetch(source);
          const json = await res.json();
          const downloadUrl = json.data?.dl || json.result?.download?.url || json.downloads?.url || json.data?.download?.url;

          if (downloadUrl) {
            success = true;
            await conn.sendMessage(m.chat, {
              video: { url: downloadUrl },
              fileName: `${title}.mp4`,
              mimetype: "video/mp4",
              caption: "⚔ Aquí tienes tu video descargado por *Kirito-Bot MD* ⚔",
              thumbnail: thumb
            }, { quoted: m });
            break;
          }
        } catch (e) {
          console.error(`⚠ Error con la fuente ${source}:`, e.message);
        }
      }

      if (!success) {
        return m.reply("⛔ *Error:* No se encontró un enlace de descarga válido.");
      }
    } else {
      throw "❌ Comando no reconocido.";
    }
  } catch (error) {
    return m.reply(`⚠ Ocurrió un error: ${error.message}`);
  }
};

handler.command = handler.help = ["play"];
handler.tags = ["downloader"];
// handler.coin = 5;

export default handler;

function formatViews(views) {
  if (typeof views !== "number") return "Desconocido";
  return views >= 1000
    ? (views / 1000).toFixed(1) + "K (" + views.toLocaleString() + ")"
    : views.toString();
}
