let handler = async (m, { conn, text, args, usedPrefix, command }) => {
  let target = m.quoted ? m.quoted.sender 
    : (m.mentionedJid && m.mentionedJid[0]) 
      ? m.mentionedJid[0] 
      : (m.fromMe ? conn.user.jid : m.sender);

  let jacketSequence = [
    `${emoji} Preparando la chaqueta...`,
    '╭━━━╮╭╮╭╮╭╮\n┃▔▔▔┃┣╋╋╋╋╮\n┃┈┈┈┃┃╰╯╯╯┃\n┃┈┈┈┃╰━━━━╯\n╰━━━╯        ',
    '╭━━━╮  ╭╮╭╮╭╮\n┃▔▔▔┃━━╋╋╋╋╮\n┃┈┈┈┃    ╰╯╯┃\n┃┈┈┈┃━━━━━━╯\n╰━━━╯          ',
    '╭━━━╮╭╮╭╮╭╮\n┃▔▔▔┃┣╋╋╋╋╮\n┃┈┈┈┃┃╰╯╯╯┃\n┃┈┈┈┃╰━━━━╯\n╰━━━╯        ',
    '╭━━━╮╭━━━╮╭━━━╮\n┃▔▔▔┃┃▔▔▔┃┃▔▔▔┃\n┃┈┈┈┃┃┈┈┈┃┃┈┈┈┃\n┃╭━━╯┃╰━━╮┃╰━━╮┃\n╰╯    ╰━━━╯╰━━━╯',
    '╭━━━╮╭╮╭╮╭╮\n┃▔▔▔┃┣╋╋╋╋╮\n┃┈┈┈┃┃╰╯╯╯┃\n┃╭━━╯╰━━━━╯\n╰╯          ',
    '╭━━━╮╭━━╮╭━━━╮\n┃▔▔▔┃┃▔▔╯┃▔▔▔┃\n┃┈┈┈┃┃┈┈╮┃┈┈┈┃\n┃╭━━╯╰━━╮┃╭━━╯\n╰╯       ╰╯╰╯  ',
    '╭━━━╮╭╮╭╮╭╮\n┃▔▔▔┃┣╋╋╋╋╮\n┃┈┈┈┃┃╰╯╯╯┃\n┃┈┈┈┃╰━━━━╯\n╰━━━╯        ',
    `\n⠀⠀⠀⠀⠀⠀⠀⠀⠀╭╮\n╭━━━╮╭╮╭╮╭╮⠀⠀⠀⠀╰╯\n┃▔▔▔┃┣╋╋╋╋╮\n┃┈┈┈┃┃╰╯╯╯┃\n┃┈┈┈┃╰━━━━╯\n╰━━━╯\n\n*[🔥] @${m.sender.split('@')[0]} acaba de recibir una chaqueta cortesía de @${target.split('@')[0]}.* 🥵🥵`
  ];

  let sentMsg = await conn.sendMessage(m.chat, { text: `${emoji} Iniciando la chaqueta...` });

  for (let frame of jacketSequence) {
    await conn.sendMessage(m.chat, { text: frame, edit: sentMsg.key, mentions: conn.parseMention(frame) });
  }
}

handler.command = ['jalame', 'jalamela', 'chaqueteame', 'chaqueta'];
handler.group = true;
handler.register = true;

export default handler;