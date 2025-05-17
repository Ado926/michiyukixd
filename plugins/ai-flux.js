/* 
- Flux Ai Imagen By Angel-OFC 
- https://whatsapp.com/channel/0029VaJxgcB0bIdvuOwKTM2Y
*/
import axios from "axios";

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) return conn.reply(m.chat, `${emoji} іᥒgrᥱsᥲ ᥣᥲ ძᥱsᥴrі⍴ᥴі᥆́ᥒ ⍴ᥲrᥲ gᥱᥒᥱrᥲr sᥙ іmᥲgᥱᥒ.`, m)
  await m.react('🕓')

  try {
    const result = await fluximg.create(text);
    if (result && result.imageLink) {
      await m.react('✅')
      await conn.sendMessage(
        m.chat,
        {
          image: { url: result.imageLink },
          caption: `*\`Resultados De:\`* ${text}`,
        },
        { quoted: m }
      );
    } else {
      throw new Error("ᥒ᥆ ⍴ᥙძᥱ ᥴrᥱᥲr sᥙ іmᥲgᥱᥒ. іᥒ𝗍ᥱᥒ𝗍ᥲᥣ᥆ mᥲ́s 𝗍ᥲrძᥱ.");
    }
  } catch (error) {
    console.error(error);
    conn.reply(
      m.chat,
      "sᥱ ⍴r᥆ძᥙȷ᥆ ᥙᥒ ᥱrr᥆r ᥲᥣ ᥴrᥱᥲr sᥙ іmᥲgᥱᥒ.",
      m
    );
  }
};

handler.help = ["flux *<texto>*"];
handler.tags = ["ai"];
handler.command = ["flux"];

export default handler;

const fluximg = {
  defaultRatio: "2:3", 

  create: async (query) => {
    const config = {
      headers: {
        accept: "*/*",
        authority: "1yjs1yldj7.execute-api.us-east-1.amazonaws.com",
        "user-agent": "Postify/1.0.0",
      },
    };

    try {
      const response = await axios.get(
        `https://1yjs1yldj7.execute-api.us-east-1.amazonaws.com/default/ai_image?prompt=${encodeURIComponent(
          query
        )}&aspect_ratio=${fluximg.defaultRatio}`,
        config
      );
      return {
        imageLink: response.data.image_link,
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
};