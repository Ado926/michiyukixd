import fetch from "node-fetch"
import yts from 'yt-search'
import axios from "axios"

const youtubeRegexID = /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([a-zA-Z0-9_-]{11})/

const handler = async (m, { conn, text, usedPrefix, command }) => {
  try {
    if (!text.trim()) {
      return conn.reply(m.chat, '❀ Por favor, ingresa el nombre de la música a descargar.')
    }

    let videoIdToFind = text.match(youtubeRegexID) || null
    let ytplay2 = await yts(videoIdToFind === null ? text : 'https://youtu.be/' + videoIdToFind[1])

    if (videoIdToFind) {
      const videoId = videoIdToFind[1]
      ytplay2 = ytplay2.all.find(item => item.videoId === videoId) || ytplay2.videos.find(item => item.videoId === videoId)
    }

    ytplay2 = ytplay2.all?.[0] || ytplay2.videos?.[0] || ytplay2
    if (!ytplay2 || ytplay2.length === 0) {
      return m.reply('✧ No se encontraron resultados para tu búsqueda.')
    }

    let { title, thumbnail, timestamp, views, ago, url, author } = ytplay2
    const vistas = formatViews(views)
    const canal = author?.name || 'Desconocido'
    const thumb = (await conn.getFile(thumbnail))?.data

    if (['play', 'yta', 'ytmp3', 'playaudio'].includes(command)) {
      try {
        const api = await (await fetch(`https://api.vreden.my.id/api/ytmp3?url=${url}`)).json()
        const audioURL = api.result.download.url
        const calidad = api.result.quality || 'Desconocida'
        const peso = api.result.size || 'Desconocido'

        const infoMessage = `「✦」Descargando *<${title}>*

> ✐ Canal » *${canal}*
> ⴵ Duración » *${timestamp}*
> ✰ Calidad: *${calidad}*
> ❒ Tamaño » *${peso}*
> 🜸 Link » ${url}`

        await conn.sendMessage(m.chat, { image: thumb, caption: infoMessage }, { quoted: m })

        await conn.sendMessage(m.chat, {
          audio: { url: audioURL },
          fileName: `${title}.mp3`,
          mimetype: 'audio/mpeg',
          ptt: true
        }, { quoted: m })

      } catch (e) {
        return conn.reply(m.chat, '⚠︎ No se pudo enviar el audio. Intenta nuevamente más tarde.', m)
      }

    } else if (['play2', 'ytv', 'ytmp4', 'mp4'].includes(command)) {
      try {
        const response = await fetch(`https://api.neoxr.eu/api/youtube?url=${url}&type=video&quality=480p&apikey=GataDios`)
        const json = await response.json()
        const videoURL = json.data.url
        const calidad = json.data.quality || '480p'
        const peso = json.data.size || 'Desconocido'

        const infoMessage = `「✦」Descargando *<${title}>*

> ✐ Canal » *${canal}*
> ⴵ Duración » *${timestamp}*
> ✰ Calidad: *${calidad}*
> ❒ Tamaño » *${peso}*
> 🜸 Link » ${url}`

        await conn.sendMessage(m.chat, { image: thumb, caption: infoMessage }, { quoted: m })

        await conn.sendFile(m.chat, videoURL, `${title}.mp4`, title, m)
      } catch (e) {
        return conn.reply(m.chat, '⚠︎ No se pudo enviar el video. Intenta nuevamente más tarde.', m)
      }

    } else {
      return conn.reply(m.chat, '✧︎ Comando no reconocido.', m)
    }

  } catch (error) {
    return m.reply(`⚠︎ Ocurrió un error: ${error}`)
  }
}

handler.command = handler.help = ['play', 'yta', 'ytmp3', 'play2', 'ytv', 'ytmp4', 'playaudio', 'mp4']
handler.tags = ['descargas']
handler.group = true

export default handler

function formatViews(views) {
  if (!views) return "No disponible"
  if (views >= 1_000_000_000) return `${(views / 1_000_000_000).toFixed(1)}B (${views.toLocaleString()})`
  if (views >= 1_000_000) return `${(views / 1_000_000).toFixed(1)}M (${views.toLocaleString()})`
  if (views >= 1_000) return `${(views / 1_000).toFixed(1)}k (${views.toLocaleString()})`
  return views.toString()
}
