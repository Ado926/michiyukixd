import { sticker } from '../lib/sticker.js'
import uploadFile from '../lib/uploadFile.js'
import uploadImage from '../lib/uploadImage.js'
import { webp2png } from '../lib/webp2mp4.js'

const handler = async (m, { conn, args }) => {
  const quoted = m.quoted || m
  const mime = (quoted.msg || quoted).mimetype || quoted.mediaType || ''
  const userId = m.sender
  const userPack = global.db.data.users[userId] || {}
  const texto1 = userPack.text1 || global.packsticker
  const texto2 = userPack.text2 || global.packsticker2

  let stickerBuffer = null

  try {
    // Procesar imagen, video o sticker webp
    if (/webp|image|video/.test(mime)) {
      if (/video/.test(mime) && (quoted.msg || quoted).seconds > 20)
        return m.reply('✧ El video no puede durar más de *20 segundos*.')
      
      const media = await quoted.download?.()
      if (!media) return conn.reply(m.chat, '❀ Envía una imagen o video para crear el sticker.', m)

      stickerBuffer = await crearSticker(media, mime, texto1, texto2)
    }

    // Procesar URL
    else if (args[0]) {
      if (!isUrl(args[0])) return m.reply('⚠︎ El URL proporcionado no es válido.')
      stickerBuffer = await sticker(false, args[0], texto1, texto2)
    }

    // Ningún contenido válido
    else {
      return conn.reply(m.chat, '> Por favor, envíame una *imagen*, *video* o *URL* para hacer el sticker ☁️', m)
    }

    if (stickerBuffer) {
      await conn.sendFile(m.chat, stickerBuffer, 'sticker.webp', '', m)
    } else {
      throw new Error('No se pudo generar el sticker.')
    }

  } catch (err) {
    console.error(err)
    m.reply('⚠︎ Ocurrió un error al intentar crear el sticker.')
  }
}

handler.help = ['sticker <imagen|video|url>']
handler.tags = ['sticker']
handler.command = ['s', 'sticker', 'stiker']

export default handler

// Función que crea el sticker desde media y mime
async function crearSticker(media, mime, texto1, texto2) {
  try {
    return await sticker(media, false, texto1, texto2)
  } catch {
    let url = null
    if (/webp/.test(mime)) url = await webp2png(media)
    else if (/image/.test(mime)) url = await uploadImage(media)
    else if (/video/.test(mime)) url = await uploadFile(media)

    if (typeof url !== 'string') url = await uploadImage(media)
    return await sticker(false, url, texto1, texto2)
  }
}

// Validador simple de URLs de imagen
function isUrl(text) {
  return /^https?:\/\/.*\.(jpe?g|png|gif|webp)$/i.test(text)
}
