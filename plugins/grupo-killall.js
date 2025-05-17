let handler = async (m, { conn, isAdmin, isBotAdmin }) => {
  if (!m.isGroup) return conn.reply(m.chat, 'Este comando solo funciona en grupos.', m)
  if (!isAdmin) return conn.reply(m.chat, 'Solo los administradores pueden usar este comando.', m)
  if (!isBotAdmin) return conn.reply(m.chat, 'Necesito ser administrador para expulsar usuarios.', m)

  // Obtener participantes del grupo
  let groupMetadata = await conn.groupMetadata(m.chat)
  let participants = groupMetadata.participants

  // Obtener el JID del bot y del que manda el comando
  let botNumber = conn.user.jid
  let sender = m.sender

  // Filtrar admins
  let admins = participants.filter(p => p.admin === 'admin' || p.admin === 'superadmin').map(p => p.id)

  // Usuarios a expulsar: todos excepto admins, el bot y quien manda el comando
  let usersToRemove = participants
    .map(p => p.id)
    .filter(id => !admins.includes(id) && id !== botNumber && id !== sender)

  // Expulsar usuarios uno por uno
  for (const userId of usersToRemove) {
    try {
      await conn.groupParticipantsUpdate(m.chat, [userId], 'remove')
    } catch (e) {
      console.log(`No se pudo expulsar a ${userId}: ${e}`)
    }
  }

  conn.reply(m.chat, 'Se han expulsado a todos los usuarios (excepto admins, tú y yo).', m)
}

handler.command = ['kickall']
handler.group = true
handler.admin = true
handler.botAdmin = true

export default handler