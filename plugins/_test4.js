import ytdl from 'ytdl-core'

const limitNormal = 500 // MB
const limitPremium = 999 // MB

let handler = async (m, { conn, text, args, isPrems, isOwner }) => {
  const url = args[0]
  if (!url || !ytdl.validateURL(url)) {
    return m.reply('✦ Proporcióname un enlace válido de YouTube.\n\nEjemplo:\n`.ytmp4 https://youtu.be/abc123xyz`')
  }

  await m.react('⏳')

  try {
    const info = await ytdl.getInfo(url)
    const format = ytdl.chooseFormat(info.formats, { quality: '18' }) // MP4 360p
    const title = info.videoDetails.title
    const duration = parseInt(info.videoDetails.lengthSeconds)
    const quality = format.qualityLabel || '360p'
    const downloadUrl = format.url
    const contentLength = format.contentLength || '0'
    const sizeMB = parseInt(contentLength) / 1048576

    const limit = (isPrems || isOwner) ? limitPremium : limitNormal
    if (sizeMB >= limit) {
      return m.reply(`✖️ El video pesa más de ${limit} MB. Descarga cancelada.`).then(() => m.react('✖️'))
    }

    const sendAsDocument = duration > 1620 // Más de 27 minutos

    await conn.sendFile(
      m.chat,
      downloadUrl,
      title + '.mp4',
      `*➤ Título:* ${title}\n*➤ Calidad:* ${quality}`,
      m,
      false,
      { asDocument: sendAsDocument }
    )

    await m.react('✅')

  } catch (e) {
    console.error(e)
    await m.react('✖️')
    m.reply('✖️ Error al descargar el video. Intenta con otro enlace.')
  }
}

handler.help = ['ytmp4 <link>']
handler.tags = ['downloader']
handler.command = ['ytmp42']

export default handler
