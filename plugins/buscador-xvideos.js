import fetch from 'node-fetch';
import axios from 'axios';
import cheerio from 'cheerio';

const handler = async (m, { conn, args, command, usedPrefix }) => {
    if (!db.data.chats[m.chat].nsfw && m.isGroup) {
        return conn.reply(m.chat, `${emoji} ᥱᥣ ᥴ᥆ᥒ𝗍ᥱᥒіძ᥆ *ᥒs𝖿ᥕ* ᥱs𝗍ᥲ ძᥱsᥲᥴ𝗍і᥎ᥲძ᥆ ᥱᥒ ᥱs𝗍ᥱ grup᥆.\n> ᥙᥒ ᥲძmіᥒіs𝗍rᥲძ᥆r puedᥱ ᥲᥴ𝗍і᥎ᥲrᥣ᥆ ᥴ᥆ᥒ ᥱᥣ ᥴ᥆mᥲᥒძ᥆ » *#nsfw on*`, m);
    }
    if (!args[0]) {
        return conn.reply(m.chat, `${emoji} іᥒgrᥱsᥲ ᥣ᥆ 𝗊ᥙᥱ 𝗊ᥙіᥱrᥱs ᑲᥙsᥴᥲr.\nEjemplo: ${usedPrefix + command} zorritas.`, m);
    }

    try {
        const results = await xvideosSearch(args.join(' '));
        if (results.length === 0) {
            return conn.reply(m.chat, `${emoji2} ᥒ᥆sᥱ ᥱᥒᥴ᥆ᥒ𝗍rᥲr᥆ᥒ rᥱsᥙᥣ𝗍ᥲძ᥆s ⍴ᥲrᥲ: *${args.join(' ')}*`, m);
        }

        let responseMessage = `${emoji} *Resultados de búsqueda para:* *${args.join(' ')}*\n\n`;
        results.forEach((video, index) => {
            responseMessage += `☁️ *Título:* ${video.title}\n`;
            responseMessage += `🕒 *Duración:* ${video.duration}\n`;
            responseMessage += `🎞️ *Calidad:* ${video.quality || 'No disponible'}\n`;
            responseMessage += `🔗 *Enlace:* ${video.url}\n\n`;
        });

        conn.reply(m.chat, responseMessage, m);
    } catch (e) {
        console.error(e);
        return conn.reply(m.chat, `${msm} ᥆ᥴᥙrrі᥆ ᥙᥒ ᥱrr᥆r ᥲᥣ ᑲᥙsᥴᥲr ᥎іძᥱ᥆s`, m);
    }
};

handler.command = ['xvideossearch', 'xvsearch'];
handler.register = true;
handler.group = false;

export default handler;

async function xvideosSearch(query) {
    return new Promise(async (resolve, reject) => {
        try {
            const url = `https://www.xvideos.com/?k=${encodeURIComponent(query)}`;
            const response = await axios.get(url);
            const $ = cheerio.load(response.data);

            const results = [];
            $("div.mozaique > div").each((index, element) => {
                const title = $(element).find("p.title a").attr("title");
                const videoUrl = "https://www.xvideos.com" + $(element).find("p.title a").attr("href");
                const duration = $(element).find("span.duration").text().trim();
                const quality = $(element).find("span.video-hd-mark").text().trim();

                results.push({ title, url: videoUrl, duration, quality });
            });

            resolve(results);
        } catch (error) {
            reject(error);
        }
    });
}
