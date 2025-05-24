import fetch from "node-fetch"
import yts from 'yt-search'
import axios from "axios"

const youtubeRegexID = /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([a-zA-Z0-9_-]{11})/

const handler = async (m, { conn, text, usedPrefix, command }) => {
  try {
    if (!text.trim()) {
      return conn.reply(m.chat, '❀ Por favor, ingresa el nombre de la música a descargar.', m)
    }

    let videoIdToFind = text.match(youtubeRegexID) || null
    let ytplay2 = await yts(videoIdToFind === null ? text : 'https://youtu.be/' + videoIdToFind[1])

    if (videoIdToFind) {
      const videoId = videoIdToFind[1]
      ytplay2 = ytplay2.all.find(item => item.videoId === videoId) || ytplay2.videos.find(item => item.videoId === videoId)
    }

    ytplay2 = ytplay2.all?.[0] || ytplay2.videos?.[0] || ytplay2
    if (!ytplay2 || ytplay2.length == 0) {
      return m.reply('✧ No se encontraron resultados para tu búsqueda.')
    }

    let { title, thumbnail, timestamp, views, ago, url, author } = ytplay2
    title = title || 'No encontrado'
    thumbnail = thumbnail || ''
    timestamp = timestamp || 'Desconocido'
    views = views || 0
    ago = ago || 'Desconocido'
    url = url || ''
    author = author || { name: 'Desconocido' }

    const vistas = formatViews(views)
    const canal = author.name ? author.name : 'Desconocido'

    const infoMessage = `「✦」Descargando *<${title}>*

> ✐ Canal » *${canal}*
> ⴵ Duración » *${timestamp}*
> ✰ Vistas » *${vistas}*
> ❒ Publicado » *${ago}*
> 🜸 Link » ${url}`

    await conn.sendMessage(m.chat, {
      image: { url: thumbnail },
      caption: infoMessage,
    }, { quoted: m })

    if (['play', 'yta', 'ytmp3', 'playaudio'].includes(command)) {
      try {
        const res = await fetch(`https://api.vreden.my.id/api/ytmp3?url=${url}`)
        const api = await res.json()

        if (!api.status || !api.result || (!api.result.url && !api.result.download?.url)) {
          throw new Error('⚠ La API no devolvió un enlace válido.')
        }

        const audioUrl = api.result.url || api.result.download.url

        await conn.sendMessage(m.chat, {
          audio: { url: audioUrl },
          fileName: `${title}.mp3`,
          mimetype: 'audio/mpeg',
          ptt: true
        }, { quoted: m })

      } catch (e) {
        console.error(e)
        return conn.reply(m.chat, '⚠︎ No se pudo enviar el audio. Puede ser por tamaño o error en la URL.', m)
      }

    } else if (['play2', 'ytv', 'ytmp4', 'mp4'].includes(command)) {
      try {
        const response = await fetch(`https://api.neoxr.eu/api/youtube?url=${url}&type=video&quality=480p&apikey=GataDios`)
        const json = await response.json()

        if (!json.status || !json.data?.url) {
          throw new Error('⚠ La API de video no devolvió una URL válida.')
        }

        await conn.sendFile(m.chat, json.data.url, `${json.title}.mp4`, title, m)
      } catch (e) {
        console.error(e)
        return conn.reply(m.chat, '⚠︎ No se pudo enviar el video. Puede ser por tamaño o error en la generación de la URL.', m)
      }
    } else {
      return conn.reply(m.chat, '✧︎ Comando no reconocido.', m)
    }

  } catch (error) {
    console.error(error)
    return m.reply(`⚠︎ Ocurrió un error: ${error.message || error}`, m)
  }
}

handler.command = handler.help = ['play', 'yta', 'ytmp3', 'play2', 'ytv', 'ytmp4', 'playaudio', 'mp4']
handler.tags = ['descargas']
handler.group = true

export default handler

function formatViews(views) {
  if (views === undefined || views === null) return "No disponible"
  if (typeof views === "string") return views
  if (views >= 1_000_000_000) return `${(views / 1_000_000_000).toFixed(1)}B (${views.toLocaleString()})`
  if (views >= 1_000_000) return `${(views / 1_000_000).toFixed(1)}M (${views.toLocaleString()})`
  if (views >= 1_000) return `${(views / 1_000).toFixed(1)}k (${views.toLocaleString()})`
  return views.toString()
}
