import yts from 'yt-search'
import youtubedl from 'yt-dlp-exec'
import fs from 'fs'
import path from 'path'

const handler = async (m, { conn, text, command }) => {
  if (!text) return conn.reply(m.chat, '❗ Por favor ingresa el nombre o link de la canción.', m)

  try {
    // Buscar video con yt-search
    const searchResult = await yts(text)
    const video = searchResult.videos.length > 0 ? searchResult.videos[0] : null
    if (!video) return conn.reply(m.chat, '✧ No se encontraron resultados para tu búsqueda.', m)

    // Extraer info para mostrar
    const { title, thumbnail, timestamp, views, ago, url, author } = video

    const infoMessage = `「✦」Descargando *<${title}>*

> ✐ Canal » *${author.name}*
> ⴵ Duración » *${timestamp}*
> ✰ Vistas » *${formatViews(views)}*
> ❒ Publicado » *${ago}*
> 🜸 Link » ${url}`

    // Enviar mensaje con la imagen y la info decorada
    await conn.sendMessage(m.chat, {
      image: { url: thumbnail },
      caption: infoMessage,
    }, { quoted: m })

    // Preparar nombre y ruta del archivo
    const fileName = `${title.replace(/[\\\/:*?"<>|]/g, '')}.mp3`
    const filePath = path.join(process.cwd(), fileName)

    // Descargar audio con yt-dlp
    await youtubedl(url, {
      extractAudio: true,
      audioFormat: 'mp3',
      audioQuality: 0,
      output: fileName,
      restrictFilenames: true,
      noCheckCertificate: true,
      noWarnings: true,
    })

    // Enviar audio al chat
    await conn.sendMessage(m.chat, {
      audio: fs.createReadStream(filePath),
      mimetype: 'audio/mpeg',
      fileName,
      ptt: true,
    }, { quoted: m })

    // Borrar archivo después de enviar
    fs.unlinkSync(filePath)

  } catch (error) {
    console.error(error)
    conn.reply(m.chat, '⚠ Ocurrió un error descargando la canción.', m)
  }
}

handler.command = ['play', 'yta', 'ytmp3', 'playaudio']
handler.tags = ['descargas']
handler.help = ['play <link o nombre>']

export default handler

function formatViews(views) {
  if (!views) return 'No disponible'
  if (typeof views === 'string') return views
  if (views >= 1_000_000_000) return `${(views / 1_000_000_000).toFixed(1)}B (${views.toLocaleString()})`
  if (views >= 1_000_000) return `${(views / 1_000_000).toFixed(1)}M (${views.toLocaleString()})`
  if (views >= 1_000) return `${(views / 1_000).toFixed(1)}k (${views.toLocaleString()})`
  return views.toString()
}
