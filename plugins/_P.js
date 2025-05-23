import fetch from "node-fetch";
import yts from "yt-search";
import axios from "axios";

const formatAudio = ["mp3", "m4a", "webm", "acc", "flac", "opus", "ogg", "wav"];
const formatVideo = ["360", "480", "720", "1080", "1440", "4k"];

const ddownr = {
  download: async (url, format) => {
    if (!formatAudio.includes(format) && !formatVideo.includes(format)) {
      throw new Error("⚠ Formato no soportado, elige uno válido.");
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
        await new Promise(resolve => setTimeout(resolve, 3000));
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
      return conn.reply(m.chat, "Ingresa el nombre de la canción o video a buscar.", m);
    }

    const search = await yts(text);
    if (!search.all.length) {
      return m.reply("⚠ No se encontraron resultados.");
    }

    const videoInfo = search.all[0];
    const { title, thumbnail, timestamp, views, ago, url } = videoInfo;
    const durFormatted = timestamp || "Desconocido";
    const type = ["play", "yta", "ytmp3"].includes(command) ? "audio" : "video";
    const quality = "360";
    const vistas = formatViews(views);
    const thumb = (await conn.getFile(thumbnail))?.data;

    const infoMessage = `
🌴 *Michi Bot ☔ YouTube Downloader*

» 🍁 *Título:* ${title}
» 🌸 *Tipo:* ${type === 'audio' ? 'Audio (.mp3)' : `Video (${quality}p)`}  
» 🕓 *Duración:* ${durFormatted}
» 🔗 *Link:* ${url}
`;

    const JT = {
      contextInfo: {
        externalAdReply: {
          title: "Michi Ai Bot ☔",
          body: "Descargando contenido multimedia...",
          mediaType: 1,
          previewType: 0,
          mediaUrl: url,
          sourceUrl: url,
          thumbnail: thumb,
          renderLargerThumbnail: true
        }
      }
    };

    const fkontak = {
      key: { fromMe: false, participant: "0@s.whatsapp.net" },
      message: {
        contactMessage: {
          displayName: "Michi-Bot",
          vcard: "BEGIN:VCARD\nVERSION:3.0\nFN:Michi\nORG:MichiBot;\nTEL;type=CELL;type=VOICE;waid=1:1\nEND:VCARD"
        }
      }
    };

    await conn.reply(m.chat, infoMessage, fkontak, JT);

    if (["play", "yta", "ytmp3"].includes(command)) {
      const api = await ddownr.download(url, "mp3");
      await conn.sendMessage(m.chat, {
        audio: { url: api.downloadUrl },
        mimetype: "audio/mpeg",
        ptt: false
      }, { quoted: fkontak });
    }

    if (["play2", "ytv", "ytmp4"].includes(command)) {
      await conn.sendMessage(m.chat, { text: "🌸 *Descargando video, espera un momento...*" }, { quoted: fkontak });

      const sources = [
        `https://api.zenkey.my.id/api/download/ytmp4?apikey=zenkey&url=${url}`,
        `https://api.siputzx.my.id/api/d/ytmp4?url=${url}`,
        `https://axeel.my.id/api/download/video?url=${encodeURIComponent(url)}`,
        `https://delirius-apiofc.vercel.app/download/ytmp4?url=${url}`
      ];

      let success = false;
      for (let source of sources) {
        try {
          const res = await fetch(source);
          const json = await res.json();
          const downloadUrl = json?.result?.download?.url ||
                              json?.result?.url ||
                              json?.downloads?.url ||
                              json?.data?.dl ||
                              json?.data?.download?.url;

          if (downloadUrl) {
            success = true;
            await conn.sendMessage(m.chat, {
              video: { url: downloadUrl },
              fileName: `${title}.mp4`,
              mimetype: "video/mp4",
              caption: "*Enviado por Michi Ai ☔*",
              thumbnail: thumb
            }, { quoted: fkontak });
            break;
          }
        } catch (e) {
          console.error(`⚠ Error con fuente ${source}:`, e.message);
        }
      }

      if (!success) {
        return m.reply("⛔ *Error:* No se pudo obtener el video de ninguna fuente.");
      }
    }
  } catch (error) {
    console.error("❌ Error general:", error);
    return m.reply(`⚠ *Error inesperado:* ${error.message}`);
  }
};

handler.command = ["play2"];
handler.tags = ["downloader"];
handler.help = ["play2"];
handler.coin = 0;

export default handler;

function formatViews(views) {
  if (typeof views !== "number") return "Desconocido";
  return views >= 1000
    ? (views / 1000).toFixed(1) + "k (" + views.toLocaleString() + ")"
    : views.toString();
}