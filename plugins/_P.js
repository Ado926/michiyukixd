import fetch from "node-fetch";
import yts from "yt-search";
import axios from "axios";

const handler = async (m, { conn, text, command }) => {
  try {
    if (!text.trim()) return conn.reply(m.chat, "✳️ Ingresa el nombre de la canción o video.", m);

    const search = await yts(text);
    if (!search.all.length) return m.reply("❌ No se encontraron resultados.");

    const videoInfo = search.all[0];
    const { title, thumbnail, timestamp, views, ago, url } = videoInfo;
    const durFormatted = timestamp || "Desconocido";
    const vistas = views?.toLocaleString() || "Desconocido";

    const thumb = (await conn.getFile(thumbnail))?.data;

    const infoMessage = `
🌴 *Michi Bot* ☔ 𝗬𝗼𝘂𝗧𝘂𝗯𝗲:

» 🎧 *Título:* ${title}
» 🎞 *Duración:* ${durFormatted}
» 👁 *Vistas:* ${vistas}
» 🔗 *Link:* ${url}
`.trim();

    const fkontak = {
      key: { fromMe: false, participant: "0@s.whatsapp.net" },
      message: {
        contactMessage: {
          displayName: "Michi Bot",
          vcard: "BEGIN:VCARD\nVERSION:3.0\nFN:Michi Bot\nORG:Michi;\nTEL;type=CELL;type=VOICE;waid=1:1\nEND:VCARD"
        }
      }
    };

    await conn.sendMessage(m.chat, { text: infoMessage }, { quoted: fkontak });

    // APIs rápidas para video (play2, ytv, ytmp4)
    if (["play2", "ytv", "ytmp4"].includes(command)) {
      const sources = [
        `https://api.siputzx.my.id/api/d/ytmp4?url=${url}`,
        `https://api.zenkey.my.id/api/download/ytmp4?apikey=zenkey&url=${url}`,
        `https://axeel.my.id/api/download/video?url=${encodeURIComponent(url)}`,
        `https://delirius-apiofc.vercel.app/download/ytmp4?url=${url}`
      ];

      let sent = false;
      for (let source of sources) {
        try {
          const res = await fetch(source);
          const json = await res.json();

          const downloadUrl = json?.data?.dl || json?.result?.download?.url || json?.downloads?.url || json?.data?.download?.url;
          if (downloadUrl) {
            await conn.sendMessage(m.chat, {
              video: { url: downloadUrl },
              caption: "*🎥 Enviado por Michi Bot ☔*",
              mimetype: "video/mp4"
            }, { quoted: fkontak });
            sent = true;
            break;
          }
        } catch (e) {
          console.log(`⚠️ Fuente falló: ${source} -> ${e.message}`);
        }
      }

      if (!sent) return m.reply("⛔ No se pudo obtener el video. Intenta con otro.");
    }

  } catch (e) {
    console.error(e);
    return m.reply("❗ Error: " + e.message);
  }
};

handler.command = handler.help = ["play2"];
handler.tags = ["downloader"];
handler.coin = 0;

export default handler;