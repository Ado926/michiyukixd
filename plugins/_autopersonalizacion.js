import yts from 'yt-search'
import fetch from 'node-fetch'

const handler = async (m, { conn, text, command }) => {
  if (!text) return m.reply(`*Ejemplo:* .${command} calm down rihanna`)

  let res = await yts(text)
  let vid = res.videos[0]
  if (!vid) return m.reply("❌ No se encontró ningún video.")

  let { title, url, timestamp, views, ago, author, thumbnail } = vid
  const info = `「✦」Descargando *<${title}>*

> ☔ Canal *»* *${author.name}*
> ☔ Duración *»* *${timestamp}*
> ☔ Vistas *»* *${views.toLocaleString()}*
> ☔ Publicado *»* *${ago}*
> ☔ Link *»* ${url}`

  await conn.sendMessage(m.chat, { image: { url: thumbnail }, caption: info }, { quoted: m })

  // Lista de fuentes rápidas
  const sources = [
    `https://api.neoxr.eu.org/api/yta?url=${url}&apikey=neoxr`,
    `https://server3.lxndr.me/api/yta?url=${url}`,
    `https://api.lolhuman.xyz/api/ytmusic?apikey=GataDios&query=${encodeURIComponent(text)}`
  ]

  let success = false
  for (let api of sources) {
    try {
      const r = await fetch(api)
      const json = await r.json()

      let dlUrl = json.result?.url || json.result?.link || json.result?.audio?.url || json.link
      if (dlUrl) {
        success = true
        await conn.sendMessage(m.chat, {
          audio: { url: dlUrl },
          mimetype: 'audio/mpeg',
          ptt: true
        }, { quoted: m })
        break
      }
    } catch (e) {
      console.error(`⚠️ Error con la fuente ${api}: ${e.message}`)
    }
  }

  if (!success) {
    return m.reply("⛔ No se pudo descargar el audio. Intenta con otro nombre o más tarde.")
  }
}

handler.command = ['play', 'yta', 'ytmp3']
handler.tags = ['downloader']
export default handler
