import uploadFile from '../lib/uploadFile.js'
import uploadImage from '../lib/uploadImage.js'
import fetch from 'node-fetch'

let handler = async (m) => {
  let q = m.quoted ? m.quoted : m
  let mime = (q.msg || q).mimetype || ''
  if (!mime) return conn.reply(m.chat, `${emoji} ⍴᥆r 𝖿ᥲ᥎᥆r rᥱs⍴᥆ᥒძᥱ ᥲ ᥙᥒᥲ *іmᥲgᥱᥒ* ᥆ *᥎іძᥱ᥆*`, m)
  await m.react(rwait)
  try {
  let media = await q.download()
  let isTele = /image\/(png|jpe?g|gif)|video\/mp4/.test(mime)
  let link = await (isTele ? uploadImage : uploadFile)(media)
  let img = await (await fetch(`${link}`)).buffer()
  let txt = `📎 *L I N K  D E S C A R G A* 📎\n\n`
txt += `🔗 *Enlace:* ${link}\n`
txt += `🧩 *Acortado:* ${await shortUrl(link)}\n`
txt += `📦 *Tamaño:* ${formatBytes(media.length)}\n`
txt += `⏳ *Expira:* ${isTele ? 'No expira' : 'Desconocido'}\n\n`
txt += `👤 *Generado por:* ${botname}`

await conn.sendFile(m.chat, img, 'thumbnail.jpg', txt, m, fkontak)
await m.react(done)
} catch {
await m.react(error)
}}
handler.help = ['tourl']
handler.tags = ['transformador']
handler.register = true
handler.command = ['tourl', 'upload']

export default handler

function formatBytes(bytes) {
  if (bytes === 0) {
    return '0 B';
  }
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return `${(bytes / 1024 ** i).toFixed(2)} ${sizes[i]}`;
}

async function shortUrl(url) {
        let res = await fetch(`https://tinyurl.com/api-create.php?url=${url}`)
        return await res.text()
}