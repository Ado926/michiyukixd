import fetch from "node-fetch"
import yts from 'yt-search'
import axios from "axios"
const youtubeRegexID = /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([a-zA-Z0-9_-]{11})/

const handler = async (m, { conn, text, usedPrefix, command, botname, dev }) => {
  try {
    if (!text.trim()) {
      return conn.reply(m.chat, `❀ Por favor, ingresa el nombre de la música a descargar.`, m)
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
    title = title || 'no encontrado'
    thumbnail = thumbnail || 'no encontrado'
    timestamp = timestamp || 'no encontrado'
    views = views || 'no encontrado'
    ago = ago || 'no encontrado'
    url = url || 'no encontrado'
    author = author || {}

    const vistas = formatViews(views)
    const canal = author.name ? author.name : 'Desconocido'

    // Construir mensaje info
    const infoMessage = `「✦」𝗗𝗲𝘀𝗰𝗮𝗿𝗴𝗮𝗻𝗱𝗼 *<${title}>*\n\n` +
      `> ✧ 𝖢𝖺𝗇𝖺𝗅 » *${canal}*\n` +
      `> ✰ 𝖵𝗂𝗌𝗍𝖺𝗌 » *${vistas}*\n` +
      `> ⴵ 𝖣𝗎𝗋𝖺𝖼𝗂𝗈́𝗇 » *${timestamp}*\n` +
      `> ✐ 𝖯𝗎𝖻𝗅𝗂𝖼𝖺𝖽𝗈 » *${ago}*\n` +
      `> 🜲 𝖫𝗂𝗇𝗄 » ${url}`

    // Enviar infoMessage SIN esperar thumbnail ni nada más
    await conn.reply(m.chat, infoMessage, m, {
      contextInfo: {
        externalAdReply: {
          title: title,
          body: 'Enviando espere un momento..',
          mediaType: 1,
          previewType: 0,
          mediaUrl: url,
          sourceUrl: url,
          thumbnail: null,
          renderLargerThumbnail: true,
        },
      },
    })    

    // Luego enviar audio o video rápido con URL directa (streaming)
    if (command === 'play' || command === 'yta' || command === 'ytmp3' || command === 'playaudio') {
      try {
        const api = await (await fetch(`https://api.vreden.my.id/api/ytmp3?url=${url}`)).json()
        const result = api.result?.download?.url
        if (!result) throw new Error('⚠ El enlace de audio no se generó correctamente.')
        await conn.sendMessage(m.chat, { audio: { url: result }, fileName: `${api.result.title}.mp3`, mimetype: 'audio/mpeg' }, { quoted: m })
      } catch {
        return conn.reply(m.chat, '⚠︎ No se pudo enviar el audio. Puede que sea muy pesado o un error en la URL. Intenta más tarde.', m)
      }
    } else if (command === 'play2' || command === 'ytv' || command === 'ytmp4' || command === 'mp4') {
      try {
        const response = await fetch(`https://api.neoxr.eu/api/youtube?url=${url}&type=video&quality=480p&apikey=GataDios`)
        const json = await response.json()
        await conn.sendFile(m.chat, json.data.url, `${title}.mp4`, null, m)
      } catch {
        return conn.reply(m.chat, '⚠︎ No se pudo enviar el video. Puede ser muy pesado o error en la URL. Intenta más tarde.', m)
      }
    } else {
      return conn.reply(m.chat, '✧︎ Comando no reconocido.', m)
    }
  } catch (error) {
    return m.reply(`⚠︎ Ocurrió un error: ${error}`)
  }
}

handler.command = handler.help = ['play', 'yta', 'ytmp3', 'play2', 'playaudio', 'mp4']
handler.tags = ['descargas']
handler.group = true

export default handler

function formatViews(views) {
  if (views === undefined) return "No disponible"
  if (typeof views === 'string') return views
  if (views >= 1_000_000_000) return `${(views / 1_000_000_000).toFixed(1)}B (${views.toLocaleString()})`
  if (views >= 1_000_000) return `${(views / 1_000_000).toFixed(1)}M (${views.toLocaleString()})`
  if (views >= 1_000) return `${(views / 1_000).toFixed(1)}K (${views.toLocaleString()})`
  return views.toString()
}
