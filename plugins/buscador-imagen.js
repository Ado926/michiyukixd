/*
• @David-Chian
- https://github.com/David-Chian
*/

import { googleImage } from '@bochilteam/scraper';
import baileys from '@whiskeysockets/baileys';

async function sendAlbumMessage(jid, medias, options = {}) {
    if (typeof jid !== "string") throw new TypeError(`jid must be string, received: ${jid}`);
    if (medias.length < 2) throw new RangeError("Se necesitan al menos 2 imágenes para un álbum");

    const caption = options.text || options.caption || "";
    const delay = !isNaN(options.delay) ? options.delay : 500;
    delete options.text;
    delete options.caption;
    delete options.delay;

    const album = baileys.generateWAMessageFromContent(
        jid,
        { messageContextInfo: {}, albumMessage: { expectedImageCount: medias.length } },
        {}
    );

    await conn.relayMessage(album.key.remoteJid, album.message, { messageId: album.key.id });

    for (let i = 0; i < medias.length; i++) {
        const { type, data } = medias[i];
        const img = await baileys.generateWAMessage(
            album.key.remoteJid,
            { [type]: data, ...(i === 0 ? { caption } : {}) },
            { upload: conn.waUploadToServer }
        );
        img.message.messageContextInfo = {
            messageAssociation: { associationType: 1, parentMessageKey: album.key },
        };
        await conn.relayMessage(img.key.remoteJid, img.message, { messageId: img.key.id });
        await baileys.delay(delay);
    }
    return album;
}

const handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) return conn.reply(m.chat, `*🍀 іᥒgrᥱsᥲ ᥱᥣ 𝗍ᥱ᥊𝗍᥆ ⍴ᥲrᥲ ᑲᥙsᥴᥲr sᥙ іmᥲgᥱᥒ.`, m);

    await m.react('🕒');
    conn.reply(m.chat, '✧ *ძᥱsᥴᥲrgᥲᥒძ᥆ sᥙ іmᥲgᥱᥒ...*', m, {
contextInfo: { externalAdReply :{ mediaUrl: null, mediaType: 1, showAdAttribution: true,
title: packname,
body: dev,
previewType: 0, thumbnail: icono,
sourceUrl: redes }}})

    try {
        const res = await googleImage(text);
        const images = [];

        for (let i = 0; i < 10; i++) {
            const image = await res.getRandom();
            if (image) images.push({ type: "image", data: { url: image } });
        }

        if (images.length < 2) return conn.reply(m.chat, '✧ ᥒ᥆sᥱ ᥱᥒᥴ᥆ᥒ𝗍r᥆ sᥙ𝖿іᥴіᥱᥒ𝗍ᥱs іmᥲ́gᥱᥒᥱs.', m);

        const caption = `🌹 *rᥱsᥙᥣ𝗍ᥲძ᥆s ძᥱ ᑲᥙ́s𝗊ᥙᥱძᥲ ⍴ᥲrᥲ:* ${text}`;
        await sendAlbumMessage(m.chat, images, { caption, quoted: m });

        await m.react('✅');
    } catch (error) {
        await m.react('❌');
        conn.reply(m.chat, 'ᥱrr᥆r ᥲᥣ ᥆ᑲ𝗍ᥱᥒᥱr ᥣᥲs іmᥲ́gᥱᥒᥱs.', m);
    }
};

handler.help = ['imagen <query>'];
handler.tags = ['buscador', 'tools', 'descargas'];
handler.command = ['imagen', 'image', 'img'];
handler.register = true;

export default handler;
