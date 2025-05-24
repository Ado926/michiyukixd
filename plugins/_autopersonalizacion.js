import fetch from 'node-fetch'
import yts from 'yt-search'

const handler = async (m, { conn, text, usedPrefix, command }) => {
  try {
    if (!text.trim()) {
      return conn.reply(m.chat, '❀ Por favor, ingresa el nombre o enlace del video de YouTube.')
    }

    const ytRegex = /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([a-zA-Z0-9_-]{11})/
    const videoIdMatch = text.match(ytRegex)
    const searchTerm = videoIdMatch ? 'https://youtu.be/' + videoIdMatch[1] : text

    let res = await yts(searchTerm)
    let video = videoIdMatch
      ? res.all.find(v => v.videoId === videoIdMatch[1]) || res.videos[0]
      : res.videos[0]

    if (!video) return m.reply('✧ No se encontraron resultados para tu búsqueda.')

    const { title, timestamp, ago, views, author, url, thumbnail } = video

    const infoMessage = `「✦」Descargando *<${title}>*
> ✐ Canal » *${author?.name || 'Desconocido'}*
> ⴵ Duración » *${timestamp || 'Desconocida'}*
> ✰ Vistas » *${formatViews(views)}*
> ❒ Publicado » *${ago}*
> 🜸 Link » ${url}`

    await conn.sendMessage(m.chat, {
      image: { url: thumbnail },
      caption: infoMessage,
    }, { quoted: m })

    // Llamar a Fast-API pública de conversión
    const apiUrl = `https://api.vevioz.com/api/button/mp3/${video.videoId}`
    const page = await fetch(apiUrl).then(res => res.text())
    const match = page.match(/href="(https:\/\/[^"]+\.mp3[^"]*)"/)

    if (!match || !match[1]) throw new Error('No se pudo obtener el enlace MP3.')

    const downloadLink = match[1]

    await conn.sendMessage(m.chat, {
      audio: { url: downloadLink },
      fileName: `${title}.mp3`,
      mimetype: 'audio/mpeg',
      ptt: true
    }, { quoted: m })

  } catch (e) {
    return m.reply(`⚠︎ Error: ${e.message}`)
  }
}

handler.command = handler.help = ['play', 'yta', 'ytmp3', 'playaudio']
handler.tags = ['descargas']
handler.group = true

export default handler

function formatViews(views) {
  if (!views) return "No disponible"
  if (views >= 1e9) return (views / 1e9).toFixed(1) + "B"
  if (views >= 1e6) return (views / 1e6).toFixed(1) + "M"
  if (views >= 1e3) return (views / 1e3).toFixed(1) + "k"
  return views.toString()
}
