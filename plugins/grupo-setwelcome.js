let handler = async (m, { conn, text }) => {
  if (!m.isGroup) return m.reply('Este comando solo se puede usar en grupos.');
  if (!text) return m.reply(`${emoji} Por favor, proporciona una bienvenida para el bot.\n> Ejemplo: #setwelcome Hola user`);

  global.db.data.chats[m.chat] = global.db.data.chats[m.chat] || {};
  global.db.data.chats[m.chat].welcome = text.trim();

  m.reply(`${emoji} La bienvenida del bot ha sido cambiada en *este grupo* a:\n${text.trim()}`);
};

handler.help = ['setwelcome'];
handler.tags = ['tools'];
handler.command = ['setwelcome'];
handler.admin = true;
handler.group = true;

export default handler;
