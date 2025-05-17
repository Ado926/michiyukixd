import fetch from 'node-fetch'

const limit = 200 // MB

let handler = async (m, { conn, text }) => {
  if (!m.quoted) 
    return conn.reply(m.chat, `[ ✰ ] Etiqueta el mensaje que contenga el resultado de YouTube Play.`, m).then(() => m.react('✖️'))
  
  if (!m.quoted.text.includes("乂  Y O U T U B E  -  P L A Y")) 
    return conn.reply(m.chat, `[ ✰ ] Etiqueta el mensaje que contenga el resultado de YouTube Play.`, m).then(() => m.react('✖️'))
  
  // Extraer URLs de Youtube del texto citado
  let urls = m.quoted.text.match(/(?:https?:\/\/)?(?:youtu\.be\/|(?:www\.|m\.)?youtube\.com\/(?:watch|v|embed|shorts)(?:\.php)?(?:\?.*v=|\/))([a-zA-Z0-9\_-]+)/gi)
  if (!urls) 
    return conn.reply(m.chat, `Resultado no Encontrado.`, m).then(() => m.react('✖️'))
  
  // Solo toma el primer URL
  let url = urls[0]
  
  await m.react('🕓')
  
  try {
    // Extraer el video ID
    let videoIdMatch = url.match(/(?:v=|\/)([a-zA-Z0-9\-_]{11})(?:&|$)/)
    let videoId = videoIdMatch ? videoIdMatch[1] : null
    if (!videoId) throw new Error("No pude extraer el ID del video.")
    
    // Llamar API vreden para ytmp3
    let res = await fetch(`https://api.vreden.my.id/api/ytmp3?url=https://www.youtube.com/watch?v=${videoId}`)
    let json = await res.json()
    
    if (!json.result || !json.result.download || !json.result.download.url) throw new Error("Error al obtener URL de descarga.")
    
    // Validar tamaño (en MB)
    let sizeMB = parseFloat(json.result.size.replace(' MB', '').trim())
    if (sizeMB > limit) {
      await conn.reply(m.chat, `El archivo pesa más de ${limit} MB, se canceló la descarga.`, m)
      return m.react('✖️')
    }
    
    // Enviar archivo mp3
    await conn.sendMessage(m.chat, { 
      audio: { url: json.result.download.url },
      mimetype: 'audio/mpeg',
      fileName: json.result.title + '.mp3',
      contextInfo: { externalAdReply: { title: json.result.title, mediaType: 2, sourceUrl: `https://youtu.be/${videoId}` } }
    }, { quoted: m })
    
    await m.react('✅')
  } catch (e) {
    console.error(e)
    await m.react('✖️')
    await conn.reply(m.chat, 'Error al descargar el audio. Intenta de nuevo.', m)
  }
}

handler.help = ['audio']
handler.tags = ['downloader']
handler.customPrefix = /^(audio|Audio)$/i
handler.command = new RegExp

export default handler