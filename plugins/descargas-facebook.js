import { igdl } from 'ruhend-scraper'

const handler = async (m, { text, conn, args }) => {
  const emoji = '📽️'
  const emoji2 = '⚠️'
  const msm = '❗'
  const rwait = '⏳'
  const done = '✅'
  const error = '❌'

  if (!args[0]) {
    return conn.reply(m.chat, `${emoji} Por favor, ingresa un enlace de Facebook.`, m, global.bcanal)
  }

  let res
  try {
    await m.react(rwait)
    res = await igdl(args[0])
  } catch (e) {
    return conn.reply(m.chat, `${msm} Error al obtener datos. Verifica el enlace.`, m, global.bcanal)
  }

  let result = res.data
  if (!result || result.length === 0) {
    return conn.reply(m.chat, `${emoji2} No se encontraron resultados.`, m, global.bcanal)
  }

  let data
  try {
    data = result.find(i => i.resolution === "720p (HD)") || result.find(i => i.resolution === "360p (SD)")
  } catch (e) {
    return conn.reply(m.chat, `${msm} Error al procesar los datos.`, m, global.bcanal)
  }

  if (!data) {
    return conn.reply(m.chat, `${emoji2} No se encontró una resolución adecuada.`, m, global.bcanal)
  }

  let video = data.url
  try {
    await conn.sendMessage(
      m.chat,
      {
        video: { url: video },
        caption: `${emoji} Tu pedido 👻`,
        fileName: 'fb.mp4',
        mimetype: 'video/mp4'
      },
      { quoted: m }
    )
    await m.react(done)
  } catch (e) {
    await m.react(error)
    return conn.reply(m.chat, `${msm} Error al enviar el video.`, m, global.bcanal)
  }
}

handler.help = ['facebook', 'fb']
handler.tags = ['descargas']
handler.command = ['facebook', 'fb']
handler.group = true
handler.register = true
handler.coin = 0

export default handler