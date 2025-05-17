let WAMessageStubType = (await import('@whiskeysockets/baileys')).default

let handler = m => m
handler.before = async function (m, { conn, participants, groupMetadata }) {
if (!m.messageStubType || !m.isGroup) return
const fkontak = { "key": { "participants":"0@s.whatsapp.net", "remoteJid": "status@broadcast", "fromMe": false, "id": "Halo" }, "message": { "contactMessage": { "vcard": `BEGIN:VCARD\nVERSION:3.0\nN:Sy;Bot;;;\nFN:y\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD` }}, "participant": "0@s.whatsapp.net"}  
let chat = global.db.data.chats[m.chat]
let usuario = `@${m.sender.split`@`[0]}`
let pp = await conn.profilePictureUrl(m.chat, 'image').catch(_ => null) || 'https://files.catbox.moe/xr2m6u.jpg'

let nombre, foto, edit, newlink, status, admingp, noadmingp

nombre = `🌸 *${usuario}* cambió el nombre del grupo.
📝 Ahora se llama: *${m.messageStubParameters[0]}*`

foto = `🌼 Se actualizó la foto del grupo.
✨ Hecho por: *${usuario}*`

edit = `⚙️ *${usuario}* modificó los permisos del grupo.
✧ Ahora ${m.messageStubParameters[0] == 'on' ? '*solo los admins*' : '*todos*'} pueden hacer cambios.`

newlink = `🔗 El enlace del grupo fue restablecido.
✨ Realizado por: *${usuario}*`

status = `🔒 El grupo fue ${m.messageStubParameters[0] == 'on' ? '*cerrado*' : '*abierto*'} por *${usuario}*.
💬 Ahora ${m.messageStubParameters[0] == 'on' ? '*solo los admins*' : '*todos*'} pueden enviar mensajes.`

admingp = `👑 *@${m.messageStubParameters[0].split`@`[0]}* ahora es admin del grupo.
✨ Nombrado por: *${usuario}*`

noadmingp = `🗑️ *@${m.messageStubParameters[0].split`@`[0]}* ya no es admin.
✨ Acción hecha por: *${usuario}*`
  
if (chat.detect && m.messageStubType == 21) {
await conn.sendMessage(m.chat, { text: nombre, mentions: [m.sender] }, { quoted: fkontak })   

} else if (chat.detect && m.messageStubType == 22) {
await conn.sendMessage(m.chat, { image: { url: pp }, caption: foto, mentions: [m.sender] }, { quoted: fkontak })

} else if (chat.detect && m.messageStubType == 23) {
await conn.sendMessage(m.chat, { text: newlink, mentions: [m.sender] }, { quoted: fkontak })    

} else if (chat.detect && m.messageStubType == 25) {
await conn.sendMessage(m.chat, { text: edit, mentions: [m.sender] }, { quoted: fkontak })  

} else if (chat.detect && m.messageStubType == 26) {
await conn.sendMessage(m.chat, { text: status, mentions: [m.sender] }, { quoted: fkontak })  

} else if (chat.detect && m.messageStubType == 29) {
await conn.sendMessage(m.chat, { text: admingp, mentions: [`${m.sender}`,`${m.messageStubParameters[0]}`] }, { quoted: fkontak })  

} if (chat.detect && m.messageStubType == 30) {
await conn.sendMessage(m.chat, { text: noadmingp, mentions: [`${m.sender}`,`${m.messageStubParameters[0]}`] }, { quoted: fkontak })
} else {
if (m.messageStubType == 2) return
console.log({messageStubType: m.messageStubType,
messageStubParameters: m.messageStubParameters,
type: WAMessageStubType[m.messageStubType], 
})
}}
export default handler
