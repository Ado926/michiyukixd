let handler = async (m, { conn, text }) => {
  if (!text) return m.reply(`${emoji} Por favor, proporciona un mensaje de despedida para el bot.\n> Ejemplo: #setbye adiós user`);

  let chat = global.db.data.chats[m.chat];
  if (!chat) global.db.data.chats[m.chat] = {};
  global.db.data.chats[m.chat].bye = text.trim();

  m.reply(`${emoji} La despedida del bot ha sido cambiada a:\n"${text.trim()}"`);
};

handler.help = ['setbye'];
handler.tags = ['tools'];
handler.command = ['setbye'];
handler.owner = false;
handler.admin = true;

export default handler;
