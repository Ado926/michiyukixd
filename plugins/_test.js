import fetch from 'node-fetch';

let handler = async (m, { conn, usedPrefix, command, text }) => {
  if (!text) return m.reply(`✨ Ingresa el nombre de una canción.\n\n*Ejemplo:* ${usedPrefix + command} Shakira - Acróstico`);

  try {
    await m.react('☔');

    // Buscar video en YouTube
    const searchApi = `https://delirius-apiofc.vercel.app/search/ytsearch?q=${encodeURIComponent(text)}`;
    const res = await fetch(searchApi);
    const json = await res.json();

    if (!json?.data || !json.data.length) {
      return m.reply(`❌ No se encontraron resultados para "${text}".`);
    }

    const video = json.data[0]; // Primer resultado
    const ytUrl = video.url;

    // Descargar audio usando Vreden API
    const vreden = await fetch(`https://api.vreden.my.id/api/ytmp3?url=${ytUrl}`);
    const data = await vreden.json();

    if (!data?.result?.download?.url) {
      return m.reply("🍁 No se pudo obtener el audio.");
    }

    const audioBuffer = await (await fetch(data.result.download.url)).buffer();

    await conn.sendMessage(m.chat, {
      audio: audioBuffer,
      mimetype: 'audio/mpeg',
      ptt: false,
      fileName: `${video.title}.mp3`
    }, { quoted: m });

    await m.react('✅');
  } catch (err) {
    console.error(err);
    m.reply(`❌ Error al procesar la solicitud:\n${err.message}`);
  }
};

handler.command = ['play'];
handler.help = ['play <canción>', 'playaudio <canción>'];
handler.tags = ['descargas'];

export default handler;
