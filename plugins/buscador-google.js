import fetch from 'node-fetch';

let handler = async (m, { text }) => {
  if (!text) {
    m.reply(`${emoji} ⍴r᥆⍴᥆rᥴі᥆ᥒᥲ ᥱᥣ 𝗍ᥱrmіᥒ᥆ ძᥱ ᑲᥙ́s𝗊ᥙᥱძᥲ 𝗊ᥙᥱ ძᥱsᥱᥲs rᥱᥲᥣіzᥲr ᥲ *g᥆᥆gᥣᥱ*.`);
    return;
  }

  const apiUrl = `https://delirius-apiofc.vercel.app/search/googlesearch?query=${encodeURIComponent(text)}`;

  try {
    const response = await fetch(apiUrl);
    const result = await response.json();

    if (!result.status) {
      m.reply('ᥱrr᥆r ᥲᥣ rᥱᥲᥣіzᥲr 𝗍ᥙ ᑲᥙ́s𝗊ᥙᥱძᥲ.');
      return;
    }

    let replyMessage = `${emoji2} Resultados de la búsqueda:\n\n`;
    result.data.slice(0, 1).forEach((item, index) => {
      replyMessage += `☁️ *${index + 1}. ${item.title}*\n`;
      replyMessage += `📰 *${item.description}*\n`;
      replyMessage += `🔗 URL: ${item.url}`;
    });

m.react('✅')

    m.reply(replyMessage);
  } catch (error) {
    console.error(`${msm} ᥱrr᥆r ᥲᥣ rᥱᥲᥣіzᥲr ᥣᥲ s᥆ᥣіᥴі𝗍ᥙძ ᥲ ᥣᥲ ᥲ⍴і:`, error);
    m.reply(`${msm} ᥆ᥴᥙrrі᥆ ᥙᥒ ᥱrr᥆r ᥲᥣ іᥒ𝗍ᥱᥒ𝗍ᥲr mᥲᥒძᥲr 𝗍ᥙs ძᥲ𝗍᥆s.`);
  }
};

handler.command = ['google'];

export default handler;