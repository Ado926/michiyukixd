import fetch from "node-fetch";

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

const ytLinkRegex = /https?:\/\/(?:www\.)?youtu(?:be\.com|\.be)\/[^\s]+/;

const handler = async (m, { conn }) => {
  if (!m.quoted || !m.quoted.text || !m.quoted.text.includes("乂  Y O U T U B E  -  P L A Y"))
    return m.reply(toSansSerifPlain("✦ Debes responder a un mensaje que contenga '乂  Y O U T U B E  -  P L A Y'."));

  const linkMatch = m.quoted.text.match(ytLinkRegex);
  if (!linkMatch) return m.reply(toSansSerifPlain("✦ No se encontró un enlace de YouTube en el mensaje citado."));

  const videoUrl = linkMatch[0];
  conn.sendMessage(m.chat, { react: { text: "🚀", key: m.key } });

  try {
    const apiUrl = `https://api.neoxr.eu/api/youtube?url=${encodeURIComponent(videoUrl)}&type=video&quality=360p&apikey=GataDios`;
    const res = await fetch(apiUrl);
    const json = await res.json();

    if (!json || !json.url) throw "video no disponible";

    const videoBuffer = await fetch(json.url).then(r => r.buffer());

    await conn.sendMessage(m.chat, {
      video: videoBuffer,
      fileName: `video.mp4`,
      mimetype: 'video/mp4',
      caption: `乂  Y O U T U B E  -  V I D E O\n\nTítulo: ${json.title || "Desconocido"}`,
    }, { quoted: m });

    conn.sendMessage(m.chat, { react: { text: "✅", key: m.key } });

  } catch (e) {
    return m.reply(toSansSerifPlain("⚠︎ Error al descargar: ") + e);
  }
};

handler.customPrefix = /^(video|Video|mp4|Mp4)$/i;
handler.command = new RegExp;
handler.help = ["video"];
handler.tags = ["downloader"];

export default handler;