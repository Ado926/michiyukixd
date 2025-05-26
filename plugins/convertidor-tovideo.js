import {webp2mp4} from '../lib/webp2mp4.js';
import {ffmpeg} from '../lib/converter.js'; 

const handler = async (m, {conn, usedPrefix, command}) => {
  if (!m.quoted) {
    return conn.reply(m.chat, `${emoji} rᥱs⍴᥆ᥒძᥲ ᥲ ᥙᥒ s𝗍іᥴkᥱr ⍴ᥲrᥲ ᥴ᥆ᥒ᥎ᥱr𝗍іr ᥱᥒ ᥎іძᥱ᥆.`, m);
  }
  
  const mime = m.quoted.mimetype || '';
  if (!/webp/.test(mime)) {
    return conn.reply(m.chat, `${emoji} rᥱs⍴᥆ᥒძᥲ ᥲ ᥙᥒ s𝗍іᥴkᥱr ⍴ᥲrᥲ ᥴ᥆ᥒ᥎ᥱr𝗍іr ᥱᥒ ᥎іძᥱ᥆.`, m);
  }
  
  const media = await m.quoted.download();
  let out = Buffer.alloc(0);
  
  conn.reply(m.chat, `${emoji2} ᥱs⍴ᥱrᥱ ᥙᥒ m᥆mᥱᥒ𝗍᥆...`, m);

  if (/webp/.test(mime)) {
    out = await webp2mp4(media);
  } else if (/audio/.test(mime)) {
    out = await ffmpeg(media, [
      '-filter_complex', 'color',
      '-pix_fmt', 'yuv420p',
      '-crf', '51',
      '-c:a', 'copy',
      '-shortest',
    ], 'mp3', 'mp4');
  }
  
  await conn.sendFile(m.chat, out, 'error.mp4', `${emoji} Aqui tienes tu *Vídeo* ฅ^•ﻌ•^ฅ.`, m, 0, {thumbnail: out});
};

handler.help = ['tovideo'];
handler.tags = ['transformador'];
handler.group = true;
handler.register = true;
handler.command = ['tovideo', 'tomp4', 'mp4', 'togif'];

export default handler;