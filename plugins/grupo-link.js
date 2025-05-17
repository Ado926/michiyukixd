var handler = async (m, { conn, args }) => {

let group = m.chat
let link = 'https://chat.whatsapp.com/' + await conn.groupInviteCode(group)
conn.reply(
  m.chat,
  `─── ⋆✩⋆ ───\n` +
  `🔗 Aquí está el link del grupo:\n\n` +
  `${link}\n\n` +
  `${dev}\n` +
  `─── ⋆✩⋆ ───`,
  m,
  { detectLink: true }
)

}
handler.help = ['link']
handler.tags = ['grupo']
handler.command = ['link', 'enlace']
handler.group = true
handler.botAdmin = true

export default handler