import {toAudio} from '../lib/converter.js';

const handler = async (m, {conn, usedPrefix, command}) => {
  const q = m.quoted ? m.quoted : m;
  const mime = (q || q.msg).mimetype || q.mediaType || '';
  
  if (!/video|audio/.test(mime)) {
    return conn.reply(m.chat, `${emoji} ⍴᥆r 𝖿ᥲ᥎᥆r, rᥱs⍴᥆ᥒძᥲ ᥲᥣ ᥎іძᥱ᥆ ᥆ ᥒ᥆𝗍ᥲ ძᥱ ᥎᥆z 𝗊ᥙᥱ ძᥱsᥱᥱ ᥴ᥆ᥒ᥎ᥱr𝗍іr ᥲ ᥲᥙძі᥆/m⍴3.`, m);
  }
  
  const media = await q.download();
  if (!media) {
    return conn.reply(m.chat, `${msm} ᥆ᥴᥙrrі᥆ ᥙᥒ ᥱrr᥆r.`, m);
  }
  
  const audio = await toAudio(media, 'mp4');
  if (!audio.data) {
    return conn.reply(m.chat, `${msm} ᥆ᥴᥙrrі᥆ ᥙᥒ ᥱrr᥆r.`, m);
  }
  
  conn.sendMessage(m.chat, {audio: audio.data, mimetype: 'audio/mpeg'}, {quoted: m});
};

handler.help = ['tomp3', 'toaudio'];
handler.command = ['tomp3', 'toaudio'];
handler.group = true;
handler.register = true;

export default handler;