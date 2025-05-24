import yts from 'yt-search'
import axios from 'axios'
import fetch from 'node-fetch'

const ddownr = {
  download: async (url, format = 'mp3') => {
    const config = {
      method: 'GET',
      url: `https://p.oceansaver.in/ajax/download.php?format=${format}&url=${encodeURIComponent(url)}&api=dfcb6d76f2f6a9894gjkege8a4ab232222`,
      headers: {
        'User-Agent': 'Mozilla/5.0'
      }
    }
    const res = await axios.request(config)
    if (!res.data?.success || !res.data.id) throw new Error('⛔ No se pudo obtener los detalles del video.')
    const downloadUrl = await ddownr.cekProgress(res.data.id)
    return {
      title: res.data.title,
      image: res.data.info?.image,
      url: downloadUrl
    }
  },

  cekProgress: async (id) => {
    const config = {
      method: 'GET',
      url: `https://p.oceansaver.in/ajax/progress.php?id=${id}`,
      headers: { 'User-Agent': 'Mozilla/5.0' }
    }
    for (let i = 0; i < 20; i++) {
      const res = await axios.request(config)
      if (res.data?.success && res.data.progress === 1000 && res.data.download_url) {
        return res.data.download_url
      }
      await new Promise(r => setTimeout(r, 1200))
    }
    throw new Error('❌ La descarga tardó demasiado. Intenta nuevamente.')
  }
}

const handler = async (m, { conn, text, command }) => {
  if (!text) return conn.sendMessage(m.chat, {
    text: `*Ejemplo:* .${command} calm down rihanna`,
    ...bcanal
  }, { quoted: m })

  try {
    const search = await yts(text)
    const vid = search.videos?.[0]
    if (!vid) return m.reply('❌ No encontré resultados.')

    const { title, url, timestamp, views, author, thumbnail } = vid

    const info = `「✦」Descargando *<${title}>*

> ☔ Canal *»* *${author.name}*
> ☔ Duración *»* *${timestamp}*
> ☔ Vistas *»* *${views.toLocaleString()}*
> ☔ Link *»* ${url}`

    await conn.sendMessage(m.chat, {
      image: { url: thumbnail },
      caption: info,
      ...bcanal
    }, { quoted: m })

    const data = await ddownr.download(url, 'mp3')
    const audio = await fetch(data.url).then(res => res.buffer())

    await conn.sendMessage(m.chat, {
      audio,
      mimetype: 'audio/mpeg',
      ptt: true,
      ...bcanal
    }, { quoted: m })

  } catch (err) {
    console.error('Error en el comando .play:', err)
    m.reply('❌ No se pudo obtener o enviar el audio. Intenta con otra canción o más tarde.')
  }
}

handler.command = ['play', 'ytmp3']
handler.tags = ['downloader']
handler.help = ['play <nombre de canción>']
export default handler