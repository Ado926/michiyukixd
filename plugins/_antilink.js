let linkRegex = /chat\.whatsapp\.com\/([0-9A-Za-z]{20,24})/i;
let linkRegex1 = /whatsapp\.com\/channel\/([0-9A-Za-z]{20,24})/i;

export async function before(m, { conn, isAdmin, isBotAdmin, isOwner, isROwner, participants }) {
  if (!m.isGroup) return;
  if (isAdmin || isOwner || m.fromMe || isROwner) return;

  let chat = global.db.data.chats[m.chat];
  if (!chat?.antilink) return;

  const text = m.text || '';
  const isLink = linkRegex.exec(text) || linkRegex1.exec(text);
  if (!isLink) return;

  try {
    // Ignora si es el link del mismo grupo
    const thisGroupLink = `https://chat.whatsapp.com/${await conn.groupInviteCode(m.chat)}`;
    if (text.includes(thisGroupLink)) return;

    if (isBotAdmin) {
      const user = m.sender;
      const bang = m.key.id;
      const delet = m.key.participant;

      // Borra mensaje
      await conn.sendMessage(m.chat, { delete: { remoteJid: m.chat, fromMe: false, id: bang, participant: delet } });

      // Envía mensaje de aviso
      await conn.sendMessage(m.chat, {
        text: `*⚠️ Anti-Link activado*\n\nEl usuario @${user.split('@')[0]} ha sido *eliminado* por enviar un link no permitido.`,
        mentions: [user]
      }, { quoted: m });

      // Expulsa al usuario
      await conn.groupParticipantsUpdate(m.chat, [user], 'remove');
    }
  } catch (e) {
    console.error('[ERROR ANTI-LINK]', e);
  }

  return !0;
}
