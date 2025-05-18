import Starlights from '@StarlightsTeam/Scraper'

let limit = 300 // límite máximo para cancelar
let docLimit = 100 // si pasa este peso, se envía como documento

let handler = async (m, { conn }) => {
  if (!m.quoted) return m.reply('[ ✰ ] Etiqueta el mensaje que contenga el resultado de YouTube Play.').then(_ => m.react('✖️'))
  if (!m.quoted.text.includes('乂  Y O U T U B E  -  P L A Y')) return m.reply('[ ✰ ] Etiqueta el mensaje que contenga el resultado de YouTube Play.').then(_ => m.react('✖️'))

  let urls = m.quoted.text.match(/(?:https?:\/\/)?(?:youtu\.be\/|(?:www\.|m\.)?youtube\.com\/(?:watch|v|embed|shorts)(?:\.php)?(?:\?.*v=|\/))([a-zA-Z0-9_-]+)/gi)
  if (!urls || urls.length < 1) return m.reply('Resultado no encontrado.').then(_ => m.react('✖️'))

  await m.react('🕓')

  try {
    let { title, size, dl_url } = await Starlights.ytmp4(urls[0])
    let fileSize = parseFloat(size)

    if (fileSize >= limit) return m.reply(`El archivo pesa más de ${limit} MB. Se canceló la descarga.`).then(_ => m.react('✖️'))

    let asDoc = fileSize >= docLimit

    await conn.sendFile(m.chat, dl_url, `${title}.mp4`, `*» Título:* ${title}`, m, false, {
      asDocument: asDoc,
      mimetype: 'video/mp4'
    })

    await m.react('✅')
  } catch (e) {
    console.error(e)
    await m.react('✖️')
    m.reply('Ocurrió un error al intentar descargar el video.')
  }
}

handler.help = ['video']
handler.tags = ['downloader']
handler.customPrefix = /^(Video|video|vídeo|Vídeo)/
handler.command = new RegExp

export default handler