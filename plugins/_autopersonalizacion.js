import yts from 'yt-search'
import axios from 'axios'
import fetch from 'node-fetch'

const ddownr = {
  download: async (url, format = "mp3") => {
    const config = {
      method: "GET",
      url: `https://p.oceansaver.in/ajax/download.php?format=${format}&url=${encodeURIComponent(url)}&api=dfcb6d76f2f6a9894gjkege8a4ab232222`,
      headers: {
        "User-Agent": "Mozilla/5.0"
      }
    }
    const res = await axios.request(config)
    if (!res.data?.success) throw new Error("⛔ No se pudo obtener los detalles del video.")
    const downloadUrl = await ddownr.cekProgress(res.data.id)
    return { title: res.data.title, image: res.data.info.image, url: downloadUrl }
  },

  cekProgress: async (id) => {
    const config = {
      method: "GET",
      url: `https://p.oceansaver.in/ajax/progress.php?id=${id}`,
      headers: { "User-Agent": "Mozilla/5.0" }
    }
    while (true) {
      const res = await axios.request(config)
      if (res.data?.success && res.data.progress === 1000) {
        return res.data.download_url
      }
      await new Promise(r => setTimeout(r, 1500)) // Espera menos para más velocidad
    }
  }
}

const handler = async (m, { conn, text, command }) => {
  if (!text) return m.reply(`*Ejemplo:* .${command} calm down rihanna`)
  
  const search = await yts(text)
  const vid = search.videos[0]
  if (!vid) return m.reply("❌ No encontré resultados.")

  const { title, url, timestamp, views, ago, author, thumbnail } = vid

  const info = `「✦」Descargando *<${title}>*

> ☔ Canal *»* *${author.name}*
> ☔ Duración *»* *${timestamp}*
> ☔ Vistas *»* *${views.toLocaleString()}*
> ☔ Link *»* ${url}`

  await conn.sendMessage(m.chat, { image: { url: thumbnail }, caption: info }, { quoted: m })

  try {
    const data = await ddownr.download(url, "mp3")
    const audio = await (await fetch(data.url)).buffer()

    await conn.sendMessage(m.chat, {
      audio,
      mimetype: 'audio/mpeg',
      ptt: true
    }, { quoted: m })

  } catch (err) {
    console.error(err)
    m.reply("❌ No se pudo enviar el audio rápido.")
  }
}

handler.command = ['play', 'ytmp3']
handler.tags = ['downloader']
export default handler
