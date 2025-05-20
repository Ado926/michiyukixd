let linkRegex = /chat\.whatsapp\.com\/([0-9A-Za-z]{20,24})/i;
let linkRegex1 = /whatsapp\.com\/channel\/([0-9A-Za-z]{20,24})/i;

export async function before(m, { conn, isAdmin, isBotAdmin, isOwner, isROwner, participants }) {
  if (!m.isGroup) return;
  if (isAdmin || isOwner || m.fromMe || isROwner) return;

  let chat = global.db.data.chats[m.chat];
  if (!chat.antilink) return;

  const isGroupLink = linkRegex.test(m.text) || linkRegex1.test(m.text);
  if (!isGroupLink) return;

  const linkThisGroup = `https://chat.whatsapp.com/${await conn.groupInviteCode(m.chat)}`;
  if (m.text.includes(linkThisGroup)) return; // Ignora si es el link del mismo grupo

  if (isBotAdmin) {
    const user = `@${m.sender.split('@')[0]}`;
    const bang = m.key.id;
    const delet = m.key.participant;

    // Elimina el mensaje con el link
    await conn.sendMessage(m.chat, { delete: { remoteJid: m.chat, fromMe: false, id: bang, participant: delet } });

    // Anuncia y expulsa
    await conn.sendMessage(
      m.chat,
      {
        text: `*⛔ Anti-Link Detectado*\n\nEl usuario ${user} fue eliminado por enviar un link no permitido.`,
        mentions: [m.sender]
      },
      { quoted: m }
    );

    // Expulsar del grupo
    await conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove');
  }
}
