//Créditos del código DanielDiod 

import cheerio from 'cheerio';
import axios from 'axios';

let handler = async (m, { conn, args, command, usedPrefix }) => {
  if (!db.data.chats[m.chat].nsfw && m.isGroup) {
    return conn.reply(m.chat, `${emoji} ᥱᥣ ᥴ᥆ᥒ𝗍ᥱᥒіძ᥆ *ᥒs𝖿ᥕ* ᥱs𝗍ᥲ ძᥱsᥲᥴ𝗍і᥎ᥲძ᥆ ᥱᥒ ᥱs𝗍ᥱ grupo.\n> ᥙᥒ ᥲძmіᥒіs𝗍rᥲძ᥆r ⍴ᥙᥱძᥱ ᥲᥴ𝗍і᥎ᥲrᥣ᥆ ᥴ᥆ᥒ ᥱᥣ ᥴ᥆mᥲᥒძ᥆ » *#nsfw on*`, m);
  } 

  if (!args[0]) {
    return conn.reply(m.chat, `${emoji} іᥒgrᥱsᥲ ᥣ᥆ 𝗊ᥙᥱ ძᥱsᥱᥲs ᑲᥙsᥴᥲr.\nEjemplo: ${usedPrefix + command} con mi prima`, m);
  }

  try {
    let searchResults = await searchPornhub(args[0]);
    let teks = searchResults.result.map((v, i) => 
      `「 *P O R N H U B  - S E A R C H* 」
🎞️ *Título:* ${v.title}
🕒 *Duración:* ${v.duration}
👀 *Vistas:* ${v.views}
🔗 *Link:* ${v.url}
---------------------------------------------------\n`).join('\n\n');

    if (searchResults.result.length === 0) {
      teks = `${emoji2} ᥒ᥆ ᥱᥒᥴ᥆ᥒ𝗍rᥱ́ rᥱsᥙᥣ𝗍ᥲძ᥆s...`;
    }

    conn.reply(m.chat, teks, m);
  } catch (e) {
    return conn.reply(m.chat, `${msm} ᥆ᥴᥙrrі᥆ ᥙᥒ ᥱrr᥆r: ${e.message}`, m);
  }
};

handler.tags = ['+18']; 
handler.help = ['pornhubsearch']; 
handler.command = ['phsearch', 'pornhubsearch'];
export default handler;

async function searchPornhub(search) {
  try {
    const response = await axios.get(`https://www.pornhub.com/video/search?search=${search}`);
    const html = response.data;
    const $ = cheerio.load(html);
    const result = [];
    
    $('ul#videoSearchResult > li.pcVideoListItem').each(function(a, b) {
      const _title = $(b).find('a').attr('title');
      const _duration = $(b).find('var.duration').text().trim();
      const _views = $(b).find('var.views').text().trim();
      const _url = 'https://www.pornhub.com' + $(b).find('a').attr('href');
      const hasil = { title: _title, duration: _duration, views: _views, url: _url };
      result.push(hasil);
    });
    
    return { result };
  } catch (error) {
    console.error(`${msm} ᥆ᥴᥙrrі᥆ ᥙᥒ ᥱrr᥆r ᥲᥣ ᑲᥙsᥴᥲr:`, error);
    return { result: [] };
  }
}
