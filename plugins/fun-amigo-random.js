let toM = a => '@' + a.split('@')[0]
function handler(m, { groupMetadata }) {
let ps = groupMetadata.participants.map(v => v.id)
let a = ps.getRandom()
let b
do b = ps.getRandom()
while (b === a)
m.reply(`${emoji} ¡Listos para la partida! 🎮🔥\n\n*Hey ${toM(a)}, escríbele en privado a ${toM(b)} y formen equipo para ganar juntos 🕹️💥*\n\n*¡Las mejores alianzas nacen en el juego! ⚔️🚀.*`, null, {
mentions: [a, b]
})}
handler.help = ['amistad']
handler.tags = ['fun']
handler.command = ['amigorandom','amistad']
handler.group = true
handler.register = true

export default handler