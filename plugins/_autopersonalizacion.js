import yts from 'yt-search'
import axios from 'axios'
import fetch from 'node-fetch'

const handler = async (m, { conn, text, command }) => {
  if (!text) return m.reply(`*Ejemplo:* .${command} calm down rihanna`)

  const res = await yts(text)
  const vid = res.videos[0]
  if (!vid) return m.reply("❌ No se encontró ningún resultado.")

  const { title, url, timestamp, views, ago, author, thumbnail } = vid

  const info = `「✦」Descargando *<${title}>*

> ☔ Canal *»* *${author.name}*
> ☔ Duración *»* *${timestamp}*
> ☔ Vistas *»* *${views.toLocaleString()}*
> ☔ Publicado *»* *${ago}*
> ☔ Link *»* ${url}`

  // Miniatura + texto
  await conn.sendMessage(m.chat, { image: { url: thumbnail }, caption: info }, { quoted: m })

  // Usamos API confiable que devuelve audio .mp3 directo
  const api = `https://api.neoxr.eu.org/api/yta?url=${url}&apikey=neoxr`
  try {
    const { data } = await axios.get(api)
    const downloadUrl = data.result?.url

    // Descarga como buffer para máxima velocidad
    const audioBuffer = await (await fetch(downloadUrl)).buffer()

    await conn.sendMessage(m.chat, {
      audio: audioBuffer,
      mimetype: 'audio/mpeg',
      ptt: true
    }, { quoted: m })

  } catch (e) {
    console.error(e)
    return m.reply("❌ No se pudo enviar el audio rápido. Intenta con otro video.")
  }
}

handler.command = ['play', 'yta', 'ytmp3']
handler.tags = ['downloader']
export default handler
