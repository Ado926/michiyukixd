import Starlights from '@StarlightsTeam/Scraper'
import ytdl from 'ytdl-core'

let limitMB = 500 // Límite para usuarios normales

let handler = async (m, { conn, text, isPrems, isOwner }) => {
  if (!m.quoted) return conn.reply(m.chat, `[ ✰ ] Etiqueta el mensaje que contenga el resultado de YouTube Play.`, m).then(_ => m.react('✖️'))

  if (!m.quoted.text.includes("乂  Y O U T U B E  -  P L A Y")) return conn.reply(m.chat, `[ ✰ ] Etiqueta el mensaje correcto con resultado de YouTube Play.`, m).then(_ => m.react('✖️'))

  let urls = m.quoted.text.match(/(?:https?:\/\/)?(?:youtu\.be\/|(?:www\.|m\.)?youtube\.com\/(?:watch|v|embed|shorts)(?:\.php)?(?:\?.*v=|\/))([a-zA-Z0-9\_-]+)/gi)
  if (!urls) return conn.reply(m.chat, `Resultado no encontrado.`, m).then(_ => m.react('✖️'))

  let user = global.db.data.users[m.sender]
  if (isOwner || isPrems) limitMB = 999

  await m.react('🕓')

  try {
    let v = urls[0]
    let { title, size, quality, thumbnail, dl_url, duration } = await Starlights.ytmp4(v)

    if (parseFloat(size) >= limitMB) return m.reply(`El archivo pesa más de ${limitMB} MB, descarga cancelada.`).then(_ => m.react('✖️'))

    let forceDocument = duration && duration > 1620 // 27 minutos = 1620 segundos
    await conn.sendFile(m.chat, dl_url, title + '.mp4', `*☔ Título:* ${title}\n*🪷 Calidad:* ${quality}`, m, false, { asDocument: forceDocument || user.useDocument })
    return await m.react('✅')

  } catch (e) {
    try {
      let v = urls[0]
      let info = await ytdl.getInfo(v)
      let format = ytdl.chooseFormat(info.formats, { quality: '18' }) // mp4 360p

      let sizeBytes = format.contentLength || '0'
      let sizeMB = parseInt(sizeBytes) / 1048576
      if (sizeMB >= limitMB) return m.reply(`El video pesa más de ${limitMB} MB. Descarga cancelada.`).then(_ => m.react('✖️'))

      let durationSec = parseInt(info.videoDetails.lengthSeconds || '0')
      let forceDocument = durationSec > 1620 // 27 minutos

      await conn.sendFile(m.chat, format.url, info.videoDetails.title + '.mp4', `*🌵 Título:* ${info.videoDetails.title}\n*🍁 Calidad:* 360p`, m, false, { asDocument: forceDocument || user.useDocument })
      return await m.react('✅')

    } catch (err) {
      console.error(err)
      await m.react('✖️')
      return await m.reply('[ ✖ ] Falló la descarga con todas las fuentes.')
    }
  }
}

handler.help = ['video']
handler.tags = ['downloader']
handler.customPrefix = /^(Video|video|vídeo|Vídeo)/
handler.command = new RegExp

export default handler
