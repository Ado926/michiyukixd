import yts from 'yt-search'

var handler = async (m, { text, conn, args, command, usedPrefix }) => {

if (!text) return conn.reply(m.chat, `${emoji} іᥒgrᥱsᥲ ᥙᥒᥲ ᑲᥙ́s𝗊ᥙᥱძᥲ ძᥱ ᥡᥙ᥆𝗍ᥙᑲᥱ.`, m)

conn.reply(m.chat, wait, m)

let results = await yts(text)
let tes = results.all
let teks = results.all.map(v => {
  switch (v.type) {
    case 'video': return `📌 *${v.title}*
👤 Canal: ${v.author.name}
⏱️ Duración: ${v.timestamp}
📆 Publicado: ${v.ago}
👁️ Vistas: ${v.views}
🔗 Link: ${v.url}`
  }
}).filter(v => v).join('\n\n━━━━━━━━━━━━━━━\n\n')

conn.sendFile(m.chat, tes[0].thumbnail, 'yts.jpeg', teks, fkontak, m)

}
handler.help = ['ytsearch']
handler.tags = ['buscador']
handler.command = ['ytbuscar', 'ytsearch', 'yts']
handler.register = true
handler.coin = 1

export default handler