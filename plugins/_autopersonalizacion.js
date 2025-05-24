import fetch from "node-fetch"
import yts from 'yt-search'

const youtubeRegexID = /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([a-zA-Z0-9_-]{11})/

const handler = async (m, { conn, text, command }) => {
  try {
    if (!text.trim()) return conn.reply(m.chat, '❀ Por favor, ingresa el nombre de la música o el enlace.')

    let videoIdMatch = text.match(youtubeRegexID)
    let search = await yts(videoIdMatch ? 'https://youtu.be/' + videoIdMatch[1] : text)
    let video = search.videos?.[0]

    if (!video) return m.reply('✧ No se encontraron resultados.')

    const { title, thumbnail, timestamp, views, url, author } = video
    const canal = author?.name || 'Desconocido'
    const vistas = formatViews(views)

    let calidad = 'Desconocida'
    let peso = 'Desconocido'

    if (['play', 'yta', 'ytmp3', 'playaudio'].includes(command)) {
      const res = await fetch(`https://api.vreden.my.id/api/ytmp3?url=${url}`)
      const json = await res.json()

      const audioURL = json.result?.download?.url
      calidad = json.result?.quality || calidad
      peso = json.result?.size || peso

      const infoMessage = `「✦」Descargando *<${title}>*

> ✐ Canal » *${canal}*
> ⴵ Duración » *${timestamp}*
> ✰ Calidad: *${calidad}*
> ❒ Tamaño » *${peso}*
> 🜸 Link » ${url}`

      await conn.sendMessage(m.chat, {
        image: { url: thumbnail },
        caption: infoMessage
      }, { quoted: m })

      await conn.sendMessage(m.chat, {
        audio: { url: audioURL },
        fileName: `${title}.mp3`,
        mimetype: 'audio/mpeg',
        ptt: true
      }, { quoted: m })

    } else if (['play2', 'ytv', 'ytmp4', 'mp4'].includes(command)) {
      const res = await fetch(`https://api.neoxr.eu/api/youtube?url=${url}&type=video&quality=480p&apikey=GataDios`)
      const json = await res.json()

      const videoURL = json.data?.url
      calidad = json.data?.quality || calidad
      peso = json.data?.size || peso

      const infoMessage = `「✦」Descargando *<${title}>*

> ✐ Canal » *${canal}*
> ⴵ Duración » *${timestamp}*
> ✰ Calidad: *${calidad}*
> ❒ Tamaño » *${peso}*
> 🜸 Link » ${url}`

      await conn.sendMessage(m.chat, {
        image: { url: thumbnail },
        caption: infoMessage
      }, { quoted: m })

      await conn.sendFile(m.chat, videoURL, `${title}.mp4`, title, m)
    }

  } catch (err) {
    console.error(err)
    return m.reply('⚠︎ Ocurrió un error al procesar tu solicitud.')
  }
}

handler.command = ['play', 'yta', 'ytmp3', 'play2', 'ytv', 'ytmp4', 'playaudio', 'mp4']
handler.tags = ['descargas']
handler.group = true
handler.help = handler.command

export default handler

function formatViews(views) {
  if (!views) return "No disponible"
  if (views >= 1_000_000_000) return `${(views / 1_000_000_000).toFixed(1)}B (${views.toLocaleString()})`
  if (views >= 1_000_000) return `${(views / 1_000_000).toFixed(1)}M (${views.toLocaleString()})`
  if (views >= 1_000) return `${(views / 1_000).toFixed(1)}k (${views.toLocaleString()})`
  return views.toString()
}
