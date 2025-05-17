let handler = async (m, { conn, isAdmin, isBotAdmin }) => {
  if (!m.isGroup) return conn.reply(m.chat, 'Este comando solo funciona en grupos.', m)
  if (!isAdmin) return conn.reply(m.chat, 'Solo los administradores pueden usar este comando.', m)
  if (!isBotAdmin) return conn.reply(m.chat, 'Necesito ser administrador para expulsar usuarios.', m)

  let participants = m.isGroup ? m.participants : []
  let botNumber = conn.user.jid.split(':')[0] + '@s.whatsapp.net'
  let admins = participants.filter(p => p.admin === 'admin' || p.admin === 'superadmin').map(p => p.id)
  
  for (let user of participants) {
    if (user.id !== botNumber && user.id !== m.sender && !admins.includes(user.id)) {
      try {
        await conn.groupParticipantsUpdate(m.chat, [user.id], 'remove')
      } catch (e) {
        console.log(`No se pudo expulsar a ${user.id}: ${e}`)
      }
    }
  }

  conn.reply(m.chat, 'Todos los usuarios han sido expulsados (excepto admins y yo).', m)
}
handler.command = ['kickall']
handler.group = true
handler.admin = true
handler.botAdmin = true

export default handler