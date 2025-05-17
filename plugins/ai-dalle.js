// - OfcKing >> https://github.com/OfcKing

import axios from 'axios';

const handler = async (m, { conn, args }) => {
    if (!args[0]) {
        await conn.reply(m.chat, `${emoji} ⍴᥆r 𝖿ᥲ᥎᥆r, ძіmᥱ ᥣᥲ ძᥱsᥴrі⍴ᥴі᥆́ᥒ ძᥱ ᥣᥲ іmᥲgᥱᥒ 𝗊ᥙᥱ 𝗊ᥙіᥱrᥱs 𝗊ᥙᥱ gᥱᥒᥱrᥱ.`, m);
        return;
    }

    const prompt = args.join(' ');
    const apiUrl = `https://eliasar-yt-api.vercel.app/api/ai/text2img?prompt=${prompt}`;

    try {
        conn.reply(m.chat, `${emoji2} Espere un momento...`, m)

        const response = await axios.get(apiUrl, { responseType: 'arraybuffer' });

        await conn.sendMessage(m.chat, { image: Buffer.from(response.data) }, { quoted: m });
    } catch (error) {
        console.error('ᥱrr᥆r ᥲᥣ gᥱᥒᥱrᥲr ᥣᥲ іmᥲgᥱᥒ:', error);
        await conn.reply(m.chat, `${msm} ᥒ᥆ ⍴ᥙძᥱ gᥱᥒᥱrᥲr ᥣᥲ іmᥲgᥱᥒ іᥒ𝗍ᥱᥒ𝗍ᥱᥣ᥆ mᥲ́s 𝗍ᥲrძᥱ.`, m);
    }
};

handler.command = ['dalle'];
handler.help = ['dalle'];
handler.tags = ['tools'];

export default handler;