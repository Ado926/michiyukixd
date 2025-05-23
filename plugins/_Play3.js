import Starlights from '@StarlightsTeam/Scraper'
import yts from 'yt-search'
import fetch from 'node-fetch'

let handler = async (m, { conn, args, usedPrefix, text, command }) => {
  let lister = ["mp3", "mp4", "mp3doc", "mp4doc"]
  let [feature, ...query] = text.split(" ")

  if (!lister.includes(feature)) {
    return conn.reply(m.chat, `
☔ *Formato no válido*

✧ Usa uno de los siguientes formatos:
🌵 *${usedPrefix + command}* mp3
🌴 *${usedPrefix + command}* mp3doc
🌵 *${usedPrefix + command}* mp4
🌴 *${usedPrefix + command}* mp4doc

✧ Ejemplo:
> *${usedPrefix + command}* mp3 Título de la canción
`.trim(), m)
  }

  if (!query.length) {
    return conn.reply(m.chat, `☔ *Falta el título*

✧ Escribe el título de un video o canción.

Ejemplo:
> *${usedPrefix + command}* mp3 SUICIDAL-IDOL`, m)
  }

  await m.react('🕓')

  let res = await yts(query.join(" "))
  let vid = res.videos[0]

  let caption = `
╭─〔 ☔ *YOUTUBE PLAY3* ☔ 〕─╮
🌴 *Título:* ${vid.title}
🌵 *Duración:* ${vid.timestamp}
☔ *Vistas:* ${formatNumber(vid.views)}
🌴 *Autor:* ${vid.author.name}
🌵 *Publicado:* ${eYear(vid.ago)}
☔ *Link:* https://youtu.be/${vid.videoId}
╰─⊳ 𝙿𝚛𝚘𝚌𝚎𝚜𝚊𝚗𝚍𝚘… ☁️ ─╯`.trim()

  await conn.sendFile(m.chat, vid.thumbnail, 'thumbnail.jpg', caption, m)

  try {
    let data = feature.includes('mp3') ? await Starlights.ytmp3(vid.url) : await Starlights.ytmp4(vid.url)
    let isDoc = feature.includes('doc')
    let mimetype = feature.includes('mp3') ? 'audio/mpeg' : 'video/mp4'
    let file = { url: data.dl_url }

    await conn.sendMessage(m.chat, {
      [isDoc ? 'document' : feature.includes('mp3') ? 'audio' : 'video']: file,
      mimetype,
      fileName: `${data.title}.${feature.includes('mp3') ? 'mp3' : 'mp4'}`
    }, { quoted: m })

    await m.react('✅')
  } catch {
    await m.react('✖️')
  }
}

handler.help = ['play3 <formato> <búsqueda>']
handler.tags = ['downloader']
handler.command = ['play3']
export default handler

// Funciones auxiliares

function eYear(txt) {
  if (!txt) return '×'
  const map = {
    'month ago': 'mes', 'months ago': 'meses',
    'year ago': 'año', 'years ago': 'años',
    'hour ago': 'hora', 'hours ago': 'horas',
    'minute ago': 'minuto', 'minutes ago': 'minutos',
    'day ago': 'día', 'days ago': 'días'
  }
  for (const k in map) {
    if (txt.includes(k)) return 'hace ' + txt.replace(k, '').trim() + ' ' + map[k]
  }
  return txt
}

function formatNumber(n) {
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}

function toNum(n) {
  if (n >= 1e6) return (n / 1e6).toFixed(1) + 'M'
  if (n >= 1e3) return (n / 1e3).toFixed(1) + 'k'
  if (n <= -1e6) return (n / 1e6).toFixed(1) + 'M'
  if (n <= -1e3) return (n / 1e3).toFixed(1) + 'k'
  return n.toString()
}