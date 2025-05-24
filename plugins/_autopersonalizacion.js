import fetch from 'node-fetch'
import yts from 'yt-search'

const handler = async (m, { conn, text, command }) => {
  if (!text) return m.reply(`*Ejemplo:* .${command} alone marshmello`)

  // Buscar video en YouTube
  let res = await yts(text)
  let vid = res.videos[0]
  if (!vid) return m.reply("❌ No se encontró el video.")

  let { title, url, timestamp, views, ago, author, thumbnail } = vid
  const info = `「✦」Descargando *<${title}>*

> ☔ Canal *»* *${author.name}*
> ☔ Duración *»* *${timestamp}*
> ☔ Vistas *»* *${views.toLocaleString()}*
> ☔ Publicado *»* *${ago}*
> ☔ Link *»* ${url}`

  // Mostrar mensaje decorado antes de descargar
  await conn.sendMessage(m.chat, { image: { url: thumbnail }, caption: info }, { quoted: m })

  // Descargar desde API ULTRARRÁPIDA (zenkey)
  try {
    let api = `https://api.zenkey.my.id/api/download/ytmp3?apikey=zenkey&url=${encodeURIComponent(url)}`
    let r = await fetch(api)
    let json = await r.json()

    if (!json.result?.url) throw new Error("No se pudo obtener el audio.")

    return conn.sendMessage(m.chat, {
      audio: { url: json.result.url },
      mimetype: 'audio/mpeg',
      ptt: true
    }, { quoted: m })

  } catch (e) {
    console.error("[ERROR]", e)
    return m.reply("⛔ Ocurrió un error descargando el audio.")
  }
}

handler.command = ['play', 'yta', 'ytmp3']
handler.tags = ['downloader']
export default handler
