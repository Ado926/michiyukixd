import fetch from 'node-fetch'
import yts from 'yt-search'
import axios from 'axios'

const MAX_MB = 20

const handler = async (m, { conn, text, command }) => {
  if (!text) return m.reply(`*Ejemplo:* .${command} calma rihanna`)

  try {
    m.react('⏳')
    
    // Buscar video
    const search = await yts(text)
    const video = search.videos[0]
    if (!video) return m.reply("❌ No encontré resultados.")

    const yturl = video.url
    const titulo = video.title
    const duracion = video.timestamp
    const views = video.views.toLocaleString()
    const fecha = video.ago
    const autor = video.author.name
    const thumbnail = video.thumbnail

    // Mostrar info
    const info = `「🎥」*${titulo}*\n\n> 📺 Canal: *${autor}*\n> 🕒 Duración: *${duracion}*\n> 👀 Vistas: *${views}*\n> 📆 Publicado: *${fecha}*\n> 🔗 Link: ${yturl}`
    await conn.sendMessage(m.chat, { image: { url: thumbnail }, caption: info }, { quoted: m })

    // Llamar API externa
    const apiUrl = `https://ytmp4.run/api/button/mp4/${encodeURIComponent(yturl)}`
    const res1 = await axios.get(apiUrl)
    const html = res1.data

    // Extraer link del video de 360p o 480p
    const match = html.match(/href="(https:\/\/[^"]+\.mp4[^"]*)"/)
    if (!match) return m.reply("❌ No se encontró enlace de descarga válido.")
    const videoUrl = match[1]

    // Verificar tamaño
    const head = await axios.head(videoUrl)
    const sizeMB = parseInt(head.headers['content-length']) / (1024 * 1024)
    if (sizeMB > MAX_MB) {
      return m.reply(`❌ El video pesa *${sizeMB.toFixed(2)} MB* y supera el límite de WhatsApp (${MAX_MB} MB).`)
    }

    // Descargar buffer
    const buffer = await fetch(videoUrl).then(res => res.buffer())

    // Enviar
    await conn.sendMessage(m.chat, {
      video: buffer,
      caption: `🎞️ *${titulo}*`,
      mimetype: 'video/mp4'
    }, { quoted: m })

  } catch (e) {
    console.error(e)
    m.reply('❌ Error al obtener o enviar el video.')
  }
}

handler.command = ['video', 'ytvideo']
export default handler
