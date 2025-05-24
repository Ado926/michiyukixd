import yts from 'yt-search'
import axios from 'axios'
import fetch from 'node-fetch'

const ddownr = {
  download: async (url) => {
    const { data } = await axios.get(`https://zenzapis.xyz/downloader/youtube?url=${encodeURIComponent(url)}&apikey=zenkey`)
    if (!data || !data.status || !data.result?.audio) throw new Error('❌ No se pudo obtener el audio.')

    return {
      title: data.result.title,
      url: data.result.audio,
      image: data.result.thumb
    }
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

    const data = await ddownr.download(url)
    const audio = await fetch(data.url).then(res => res.buffer())

    await conn.sendMessage(m.chat, {
      audio,
      mimetype: 'audio/mpeg',
      fileName: `${data.title}.mp3`,
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