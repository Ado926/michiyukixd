import fetch from "node-fetch";
import yts from "yt-search";

const ytIdRegex = /(?:youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;

const toSansSerifPlain = (text = "") =>
  text.split("").map((char) => {
    const map = {
      a: "𝖺", b: "𝖻", c: "𝖼", d: "𝖽", e: "𝖾", f: "𝖿", g: "𝗀", h: "𝗁", i: "𝗂",
      j: "𝗃", k: "𝗄", l: "𝗅", m: "𝗆", n: "𝗇", o: "𝗈", p: "𝗉", q: "𝗊", r: "𝗋",
      s: "𝗌", t: "𝗍", u: "𝗎", v: "𝗏", w: "𝗐", x: "𝗑", y: "𝗒", z: "𝗓",
      A: "𝖠", B: "𝖡", C: "𝖢", D: "𝖣", E: "𝖤", F: "𝖥", G: "𝖦", H: "𝖧", I: "𝖨",
      J: "𝖩", K: "𝖪", L: "𝖫", M: "𝖬", N: "𝖭", O: "𝖮", P: "𝖯", Q: "𝖰", R: "𝖱",
      S: "𝖲", T: "𝖳", U: "𝖴", V: "𝖵", W: "𝖶", X: "𝖷", Y: "𝖸", Z: "𝖹",
      0: "𝟢", 1: "𝟣", 2: "𝟤", 3: "𝟥", 4: "𝟦", 5: "𝟧", 6: "𝟨", 7: "𝟩", 8: "𝟪", 9: "𝟫"
    };
    return map[char] || char;
  }).join("");

const handler = async (m, { conn }) => {
  if (!m.quoted || !m.quoted.text || !m.quoted.text.includes("乂  Y O U T U B E  -  P L A Y"))
    return m.reply(toSansSerifPlain("✦ Debes responder a un mensaje que contenga 乂  Y O U T U B E  -  P L A Y."));

  const match = m.quoted.text.match(ytIdRegex);
  if (!match) return m.reply(toSansSerifPlain("✦ No se detectó un enlace de YouTube."));

  conn.sendMessage(m.chat, { react: { text: "🚀", key: m.key } });

  const videoUrl = `https://youtu.be/${match[1]}`;
  const res = await yts(videoUrl);
  const video = res.videos[0];
  if (!video) return m.reply(toSansSerifPlain("✦ No se encontró el video."));

  try {
    const json = await fetch(`https://api.vreden.my.id/api/ytmp3?url=${encodeURIComponent(video.url)}`).then(r => r.json());
    if (!json.result?.download?.url) throw "audio no disponible";

    // Descargar directamente como buffer
    const audioBuffer = await fetch(json.result.download.url).then(res => res.buffer());

    await conn.sendMessage(m.chat, {
      audio: audioBuffer,
      fileName: `${video.title}.mp3`,
      mimetype: 'audio/mpeg',
      ptt: false
    }, { quoted: m });

    conn.sendMessage(m.chat, { react: { text: "✅", key: m.key } });

  } catch (e) {
    return m.reply(toSansSerifPlain("⚠︎ Error al descargar: ") + e);
  }
};

handler.customPrefix = /^(audio|Audio)$/i;
handler.command = new RegExp;
handler.help = ["audio"];
handler.tags = ["downloader"];

export default handler;