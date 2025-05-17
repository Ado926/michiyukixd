import fetch from "node-fetch";
import yts from "yt-search";

const ytIdRegex = /(?:youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;

const toSansSerifPlain = (text = "") =>
  text
    .split("")
    .map((char) => {
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

const formatViews = (views) => {
  if (!views) return "Desconocido";
  if (views >= 1_000_000_000) return `${(views / 1_000_000_000).toFixed(1)}B`;
  if (views >= 1_000_000) return `${(views / 1_000_000).toFixed(1)}M`;
  if (views >= 1_000) return `${(views / 1_000).toFixed(1)}k`;
  return views.toString();
};

const handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) return m.reply(`${toSansSerifPlain("✦ Ingresa el nombre o link de un video.")}`);

  let video;
  const ytId = ytIdRegex.exec(text);

  if (ytId) {
    const url = `https://youtu.be/${ytId[1]}`;
    const res = await yts({ videoId: ytId[1] });
    video = res.video || (await yts(url)).all[0];
  } else {
    const res = await yts(text);
    video = res.all[0];
  }

  if (!video) return m.reply(`${toSansSerifPlain("✦ No se encontró el video.")}`);

  const { title, timestamp, views, url, thumbnail, author } = video;

  const msg = `
╭┈ ❖ ⋆⋅☆⋅⋆ ❖ ┈╮
┃✦ Título: ${toSansSerifPlain(title)}
┃✦ Canal: ${toSansSerifPlain(author.name)}
┃✦ Duración: ${toSansSerifPlain(timestamp)}
┃✦ Vistas: ${toSansSerifPlain(formatViews(views))}
┃✦ Enlace: ${url}
╰┈ ❖ ⋆⋅☆⋅⋆ ❖ ┈╯
`;

  await conn.sendMessage(m.chat, {
    image: { url: thumbnail },
    caption: msg
  }, { quoted: m });

  try {
    if (['play', 'yta', 'ytmp3', 'playaudio'].includes(command)) {
      const api = await fetch(`https://api.vreden.my.id/api/ytmp3?url=${url}`);
      const json = await api.json();
      if (!json.result?.download?.url) throw 'Audio no disponible';

      const file = await conn.getFile(json.result.download.url);
      await conn.sendMessage(m.chat, {
        audio: file.data,
        fileName: `${toSansSerifPlain(title)}.mp3`,
        mimetype: 'audio/mpeg',
        ptt: false
      }, { quoted: m });
    }

    if (['play2', 'ytv', 'ytmp4', 'mp4'].includes(command)) {
      const api = await fetch(`https://api.neoxr.eu/api/youtube?url=${url}&type=video&quality=360p&apikey=GataDios`);
      const json = await api.json();
      if (!json.data?.url) throw 'Video no disponible';

      const file = await conn.getFile(json.data.url);
      await conn.sendMessage(m.chat, {
        video: file.data,
        fileName: `${toSansSerifPlain(title)}.mp4`,
        caption: toSansSerifPlain(title)
      }, { quoted: m });
    }
  } catch (e) {
    return m.reply(`${toSansSerifPlain("⚠︎ Error al descargar:")} ${e}`);
  }
};

handler.command = [
  "play", "play2", "ytmp3", "ytmp4", "yta", "ytv", "mp4", "playaudio"
];
handler.help = handler.command;
handler.tags = ["downloader"];

export default handler;
