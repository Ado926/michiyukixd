import fetch from "node-fetch"
import yts from 'yt-search'
import axios from "axios"
const youtubeRegexID = /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([a-zA-Z0-9_-]{11})/

// Helper function to convert text to sans-serif plain
function toSansSerifPlain(text) {
    const plainMap = {
        'a': '𝖺', 'b': '𝖻', 'c': '𝖼', 'd': '𝖽', 'e': '𝖾', 'f': '𝖿', 'g': '𝗀', 'h': '𝗁', 'i': '𝗂', 'j': '𝗃', 'k': '𝗄', 'l': '𝗅', 'm': '𝗆',
        'n': '𝗇', 'o': '𝗈', 'p': '𝗉', 'q': '𝗊', 'r': '𝗋', 's': '𝗌', 't': '𝗍', 'u': '𝗎', 'v': '𝗏', 'w': '𝗐', 'x': '𝗑', 'y': '𝗒', 'z': '𝗓',
        'A': '𝖠', 'B': '𝖡', 'C': '𝖢', 'D': '𝖣', 'E': '𝖤', 'F': '𝖥', 'G': '𝖦', 'H': '𝖧', 'I': '𝖨', 'J': '𝗃', 'K': '𝖪', 'L': '𝖫', 'M': '𝖬',
        'N': '𝖭', 'O': '𝖮', 'P': '𝖯', 'Q': '𝖰', 'R': '𝖱', 'S': '𝖲', 'T': '𝖳', 'U': '𝖴', 'V': '𝖵', 'W': '𝖶', 'X': '𝖷', 'Y': '𝖸', 'Z': '𝖹',
        '0': '𝟢', '1': '𝟣', '2': '𝟤', '3': '𝟥', '4': '𝟦', '5': '𝟧', '6': '𝟨', '7': '𝟩', '8': '𝟪', '9': '𝟫',
        'á': '𝖺́', 'é': '𝖾́', 'í': '𝗂́', 'ó': '𝗈́', 'ú': '𝗎́', 'ñ': '𝗇̃',
        'Á': '𝖠́', 'É': '𝖤́', 'Í': '𝖨́', 'Ó': '𝖮́', 'Ú': '𝖴́', 'Ñ': '𝖭̃',
        'ü': '𝗎̈', 'Ü': '𝖴̈',
        ',': ',', '.': '.', '?': '?', '!': '!', ':': ':', ';': ';', '(': '(', ')': ')', '-': '-', '/': '/', '&': '&', '#': '#', '@': '@', '+': '+', '=': '=', '%': '%', '$': '$', '€': '€', '"': '"', "'": "'", '`': '`', '~': '~', '^': '^', '<': '<', '>': '>' // Added common punctuation and symbols
    };
    let result = '';
    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        result += plainMap[char] || char; // Use mapped char or original if not in map
    }
    return result;
}

const handler = async (m, { conn, text, usedPrefix, command }) => {
  try {
    // Apply sans-serif plain to the initial prompt message
    if (!text.trim()) {
      return conn.reply(m.chat, `❀ ${toSansSerifPlain('Por favor, ingresa el nombre de la música a descargar.')}`, m)
    }

let videoIdToFind = text.match(youtubeRegexID) || null
let ytplay2 = await yts(videoIdToFind === null ? text : 'https://youtu.be/' + videoIdToFind[1])

if (videoIdToFind) {
const videoId = videoIdToFind[1]
ytplay2 = ytplay2.all.find(item => item.videoId === videoId) || ytplay2.videos.find(item => item.videoId === videoId)
}
ytplay2 = ytplay2.all?.[0] || ytplay2.videos?.[0] || ytplay2
// Apply sans-serif plain to the "no results" message
if (!ytplay2 || ytplay2.length == 0) {
return m.reply(`✧ ${toSansSerifPlain('No se encontraron resultados para tu búsqueda.')}`)
}
let { title, thumbnail, timestamp, views, ago, url, author } = ytplay2
title = title || 'no encontrado'
thumbnail = thumbnail || 'no encontrado'
timestamp = timestamp || 'no encontrado'
views = views || 'no encontrado'
ago = ago || 'no encontrado'
url = url || 'no encontrado'
author = author || 'no encontrado'
    const vistas = formatViews(views) // formatViews outputs standard numbers/text

    // Convert the parts of the info message to sans-serif plain
    const canal = author.name ? author.name : 'Desconocido'
    const infoMessage = `「✦」${toSansSerifPlain('Descargando')} ${toSansSerifPlain('<')}${toSansSerifPlain(title || 'Desconocido')}${toSansSerifPlain('>')}\n\n> ✧ ${toSansSerifPlain('Canal')} » ${toSansSerifPlain(canal)}\n> ✰ ${toSansSerifPlain('Vistas')} » ${toSansSerifPlain(vistas || 'Desconocido')}\n> ⴵ ${toSansSerifPlain('Duración')} » ${toSansSerifPlain(timestamp || 'Desconocido')}\n> ✐ ${toSansSerifPlain('Publicado')} » ${toSansSerifPlain(ago || 'Desconocido')}\n> 🜸 ${toSansSerifPlain('Link')} » ${url}` // Keep URL as is

    const thumb = (await conn.getFile(thumbnail))?.data
    const JT = {
      contextInfo: {
        externalAdReply: {
          title: botname,
          body: dev,
          mediaType: 1,
          previewType: 0,
          mediaUrl: url,
          sourceUrl: url,
          thumbnail: thumb,
          renderLargerThumbnail: true,
        },
      },
    }
    await conn.reply(m.chat, infoMessage, m, JT)
    if (command === 'play' || command === 'yta' || command === 'ytmp3' || command === 'playaudio') {
      try {
        const api = await (await fetch(`https://api.vreden.my.id/api/ytmp3?url=${url}`)).json()
        const resulta = api.result
        const result = resulta.download.url
        // Apply sans-serif plain to error and success messages/filenames
        if (!result) throw new Error(toSansSerifPlain('El enlace de audio no se generó correctamente.'))
        await conn.sendMessage(m.chat, { audio: { url: result }, fileName: `${toSansSerifPlain(api.result.title)}.mp3`, mimetype: 'audio/mpeg' }, { quoted: m })
      } catch (e) {
        return conn.reply(m.chat, `⚠︎ ${toSansSerifPlain('No se pudo enviar el audio. Esto puede deberse a que el archivo es demasiado pesado o a un error en la generación de la URL. Por favor, intenta nuevamente más tarde.')}`, m)
      }
    } else if (command === 'play2' || command === 'ytv' || command === 'ytmp4' || command === 'mp4') {
      try {
        const response = await fetch(`https://api.neoxr.eu/api/youtube?url=${url}&type=video&quality=480p&apikey=GataDios`)
        const json = await response.json()
        // Apply sans-serif plain to error and success messages/filenames/captions
        await conn.sendFile(m.chat, json.data.url, `${toSansSerifPlain(json.title)}.mp4`, toSansSerifPlain(title), m)
      } catch (e) {
        return conn.reply(m.chat, `⚠︎ ${toSansSerifPlain('No se pudo enviar el video. Esto puede deberse a que el archivo es demasiado pesado o a un error en la generación de la URL. Por favor, intenta nuevamente más tarde.')}`, m)
      }
    } else {
      // Apply sans-serif plain to the unrecognized command message
      return conn.reply(m.chat, `✧︎ ${toSansSerifPlain('Comando no reconocido.')}`, m)
    }
  } catch (error) {
    // Apply sans-serif plain to the general error message part
    return m.reply(`⚠︎ ${toSansSerifPlain('Ocurrió un error')}: ${error}`) // Keep the actual error object output as is
  }
}
handler.command = handler.help = ['play', 'yta', 'ytmp3', 'play2', 'ytv', 'ytmp4', 'playaudio', 'mp4']
handler.tags = ['descargas']
handler.group = true

export default handler

// Keep the formatViews function as is
function formatViews(views) {
  if (views === undefined) {
    return "No disponible"
  }

  if (views >= 1_000_000_000) {
    return `${(views / 1_000_000_000).toFixed(1)}B (${views.toLocaleString()})`
  } else if (views >= 1_000_000) {
    return `${(views / 1_000_000).toFixed(1)}M (${views.toLocaleString()})`
  } else if (views >= 1_000) {
    return `${(views / 1_000).toFixed(1)}k (${views.toLocaleString()})`
  }
  return views.toString()
}
