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
        console.error('Error al generar la imagen:', error);
        await conn.reply(m.chat, `${msm} No se pudo generar la imagen, intenta nuevamente mas tarde.`, m);
    }
};

handler.command = ['dalle'];
handler.help = ['dalle'];
handler.tags = ['tools'];

export default handler;