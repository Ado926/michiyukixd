import fetch from "node-fetch"
import yts from "yt-search"
import axios from "axios"

const youtubeRegexID = /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([a-zA-Z0-9_-]{11})/

const handler = async (m, { conn, text, command, botname = "Bot", dev = "Dev" }) => {
  try {
    if (!text || !text.trim()) {
      return conn.reply(m.chat, `❀ Por favor, ingresa el nombre de la música a descargar.`, m)
    }

    // Buscar video en yt-search
    let videoIdToFind = text.match(youtubeRegexID) || null
    let searchResult = await yts(videoIdToFind === null ? text : "https://youtu.be/" + videoIdToFind[1])

    // Si especificó ID, obtener video exacto
    if (videoIdToFind) {
      const videoId = videoIdToFind[1]
      searchResult = searchResult.all.find(item => item.videoId === videoId) || searchResult.videos.find(item => item.videoId === videoId)
    }

    // Tomar primer resultado válido
    let video = searchResult.all?.[0] || searchResult.videos?.[0] || searchResult

    if (!video || video.length === 0) {
      return m.reply("✧ No se encontraron resultados para tu búsqueda.")
    }

    let { title, thumbnail, timestamp, views, ago, url, author } = video
    title = title || "No encontrado"
    thumbnail = thumbnail || null
    timestamp = timestamp || "No encontrado"
    views = views || "No encontrado"
    ago = ago || "No encontrado"
    url = url || "No encontrado"
    author = author || {}

    const vistas = formatViews(views)
    const canal = author.name || "Desconocido"

    // Descargar thumbnail como buffer
    let thumb
    try {
      const resp = await fetch(thumbnail)
      thumb = await resp.buffer()
    } catch {
      thumb = null
    }

    // Mensaje de info con thumbnail en contexto
    const infoMessage = `「✦」𝗗𝗲𝘀𝗰𝗮𝗿𝗴𝗮𝗻𝗱𝗼 *<${title}>*\n\n` +
      `> ✧ 𝖢𝖺𝗇𝖺𝗅 » *${canal}*\n` +
      `> ✰ 𝖵𝗂𝗌𝗍𝖺𝗌 » *${vistas}*\n` +
      `> ⴵ 𝖣𝗎𝗋𝖺𝖼𝗂𝗈́𝗇 » *${timestamp}*\n` +
      `> ✐ 𝖯𝗎𝖻𝗅𝗂𝖼𝖺𝖽𝗈 » *${ago}*\n` +
      `> 🜲 𝖫𝗂𝗇𝗄 » ${url}`

    await conn.reply(m.chat, infoMessage, m, {
      contextInfo: {
        externalAdReply: {
          title,
          body: canal,
          mediaType: 1,
          previewType: 0,
          mediaUrl: url,
          sourceUrl: url,
          thumbnail: thumb,
          renderLargerThumbnail: true,
        }
      }
    })

    // Enviar audio o video rápido
    if (["play", "yta", "ytmp3", "playaudio"].includes(command)) {
      try {
        const apiRes = await (await fetch(`https://api.vreden.my.id/api/ytmp3?url=${url}`)).json()
        const audioUrl = apiRes.result?.download?.url
        if (!audioUrl) throw new Error("No se generó el enlace de audio.")
        await conn.sendMessage(m.chat, {
          audio: { url: audioUrl },
          fileName: `${apiRes.result.title || title}.mp3`,
          mimetype: "audio/mpeg",
        }, { quoted: m })
      } catch {
        return conn.reply(m.chat, "⚠ No se pudo enviar el audio. Intenta más tarde.", m)
      }
    } else if (["play2", "ytv", "ytmp4", "mp4"].includes(command)) {
      try {
        const response = await fetch(`https://api.neoxr.eu/api/youtube?url=${url}&type=video&quality=480p&apikey=GataDios`)
        const json = await response.json()
        if (!json.data?.url) throw new Error("No se generó el enlace de video.")
        await conn.sendFile(m.chat, json.data.url, `${title}.mp4`, null, m)
      } catch {
        return conn.reply(m.chat, "⚠ No se pudo enviar el video. Intenta más tarde.", m)
      }
    } else {
      return conn.reply(m.chat, "✧ Comando no reconocido.", m)
    }

  } catch (error) {
    return m.reply(`⚠ Ocurrió un error: ${error.message || error}`)
  }
}

handler.command = handler.help = ["play", "yta", "ytmp3", "play2", "playaudio", "mp4"]
handler.tags = ["descargas"]
handler.group = true

export default handler

function formatViews(views) {
  if (views === undefined || views === null) return "No disponible"
  if (typeof views === "string") return views
  if (views >= 1_000_000_000) return `${(views / 1_000_000_000).toFixed(1)}B (${views.toLocaleString()})`
  if (views >= 1_000_000) return `${(views / 1_000_000).toFixed(1)}M (${views.toLocaleString()})`
  if (views >= 1_000) return `${(views / 1_000).toFixed(1)}K (${views.toLocaleString()})`
  return views.toString()
}
