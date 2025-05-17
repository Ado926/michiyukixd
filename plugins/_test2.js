import fetch from 'node-fetch'

const limit = 200 // MB

function extractVideoID(url) {
  // Extrae el ID del video de diferentes formatos de URL de YouTube
  let match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([a-zA-Z0-9_-]{11})/)
  return match ? match[1] : null
}

let handler = async (m, { conn }) => {
  if (!m.quoted) 
    return conn.reply(m.chat, `[ ✰ ] Etiqueta el mensaje que contenga el resultado de YouTube Play.`, m).then(() => m.react('✖️'))
  
  if (!m.quoted.text.includes("乂  Y O U T U B E  -  P L A Y")) 
    return conn.reply(m.chat, `[ ✰ ] Etiqueta el mensaje que contenga el resultado de YouTube Play.`, m).then(() => m.react('✖️'))
  
  let urls = m.quoted.text.match(/https?:\/\/[^\s]+/g)
  if (!urls) 
    return conn.reply(m.chat, `Resultado no Encontrado.`, m).then(() => m.react('✖️'))
  
  let url = urls[0]
  let videoId = extractVideoID(url)
  if (!videoId) 
    return conn.reply(m.chat, 'No pude extraer el ID del video.', m).then(() => m.react('✖️'))
  
  await m.react('🕓')
  
  try {
    console.log(`Intentando descargar audio para videoId: ${videoId}`)
    let res = await fetch(`https://api.vreden.my.id/api/ytmp3?url=${encodeURIComponent(`https://www.youtube.com/watch?v=${videoId}`)}`)
    let json = await res.json()
    if (!json.result) throw new Error('API no devolvió resultado')
    
    let sizeMB = parseFloat(json.result.size.replace(' MB', '').trim())
    if (sizeMB > limit) {
      await conn.reply(m.chat, `El archivo pesa más de ${limit} MB, se canceló la descarga.`, m)
      return m.react('✖️')
    }
    
    await conn.sendMessage(m.chat, { 
      audio: { url: json.result.download.url },
      mimetype: 'audio/mpeg',
      fileName: json.result.title + '.mp3',
      contextInfo: { externalAdReply: { title: json.result.title, mediaType: 2, sourceUrl: `https://youtu.be/${videoId}` } }
    }, { quoted: m })
    
    await m.react('✅')
  } catch (e) {
    console.error('Error al descargar audio:', e)
    await m.react('✖️')
    await conn.reply(m.chat, 'Error al descargar el audio. Intenta de nuevo.', m)
  }
}

handler.help = ['audio']
handler.tags = ['downloader']
handler.customPrefix = /^(audio|Audio)$/i
handler.command = new RegExp

export default handler