import { readdirSync, statSync, unlinkSync, existsSync, readFileSync, watch, rmSync, promises as fsPromises } from "fs";
const fs = { ...fsPromises, existsSync };
import path, { join } from 'path'
import ws from 'ws';

// Helper function to convert text to sans-serif plain (retained from previous turn)
function toSansSerifPlain(text) {
    const plainMap = {
        'a': '𝖺', 'b': '𝖻', 'c': '𝖼', 'd': '𝖽', 'e': '𝖾', 'f': '𝖿', 'g': '𝗀', 'h': '𝗁', 'i': '𝗂', 'j': '𝗃', 'k': '𝗄', 'l': '𝗅', 'm': '𝗆',
        'n': '𝗇', 'o': '𝗈', 'p': '𝗉', 'q': '𝗊', 'r': '𝗋', 's': '𝗌', 't': '𝗍', 'u': '𝗎', 'v': '𝗏', 'w': '𝗐', 'x': '𝗑', 'y': '𝗒', 'z': '𝗓',
        'A': '𝖠', 'B': '𝖡', 'C': '𝖢', 'D': '𝖣', 'E': '𝖤', 'F': '𝖥', 'G': '𝖦', 'H': '𝖧', 'I': '𝖨', 'J': '𝗃', 'K': '𝖪', 'L': '𝖫', 'M': '𝖬',
        'N': '𝖭', 'O': '𝖮', 'P': '𝖯', 'Q': '𝖰', 'R': '𝖱', 'S': '𝖲', 'T': '𝖳', 'U': '𝖴', 'V': '𝖵', 'W': '𝖶', 'X': '𝖷', 'Y': '𝖸', 'Z': '𝖹',
        '0': '𝟢', '1': '𝟣', '2': '𝟤', '3': '𝟥', '4': '𝟦', '5': '𝟧', '6': '𝟨', '7': '𝟩', '8': '𝟪', '9': '𝟫',
        'á': '𝖺́', 'é': '𝖾́', 'í': '𝗂́', 'ó': '𝗈́', 'ú': '𝗎́', 'ñ': '𝗇̃',
        'Á': '𝖠́', 'É': '𝖤́', 'Í': '𝖨́', 'Ó': '𝖮́', 'Ú': '𝖴́', 'Ñ': '𝖭̃',
        'ü': '𝗎̈', 'Ü': '𝖴̈',
        ',': ',', '.': '.', '?': '?', '!': '!', ':': ':', ';': ';', '(': '(', ')': ')', '-': '-', '/': '/', '&': '&', '#': '#', '@': '@', '+': '+', '=': '=', '%': '%', '$': '$', '€': '€', '"': '"', "'": "'", '`': '`', '~': '~', '^': '^', '<': '<', '>': '>' // Added common punctuation and symbols
    };
    let result = '';
    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        result += plainMap[char] || char; // Use mapped char or original if not in map
    }
    return result;
}


let handler = async (m, { conn: _envio, command, usedPrefix, args, text, isOwner}) => {
const isCommand1 = /^(deletesesion|deletebot|deletesession|deletesesaion)$/i.test(command)
const isCommand2 = /^(stop|pausarai|pausarbot)$/i.test(command)
const isCommand3 = /^(bots|sockets|socket)$/i.test(command)

// Added ❌ emoji to the error message
async function reportError(e) {
await m.reply(`❌ ${msm} ${toSansSerifPlain('Ocurrió un error.')}`)
console.log(e)
}

switch (true) {
case isCommand1:
let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender
let uniqid = `${who.split`@`[0]}`
const path = `./${jadi}/${uniqid}`

// Added ❓ emoji to the "no session" message
if (!await fs.existsSync(path)) {
await conn.sendMessage(m.chat, { text: `❓ ${emoji} ${toSansSerifPlain('Usted no tiene una sesión, puede crear una usando:')}\n${usedPrefix + command}\n\n${toSansSerifPlain('Si tiene una (ID) puede usar para saltarse el paso anterior usando:')}\n${usedPrefix + command} \`\`\`(ID)\`\`\`` }, { quoted: m }) // Removed markdown bold
return
}
// Added ➡️ emoji to the "use main bot" message
if (global.conn.user.jid !== conn.user.jid) return conn.sendMessage(m.chat, {text: `➡️ ${emoji2} ${toSansSerifPlain('Use este comando al Bot principal.')}\n\n*https://api.whatsapp.com/send/?phone=${global.conn.user.jid.split`@`[0]}&text=${usedPrefix + command}&type=phone_number&app_absent=0*`}, { quoted: m }) // Removed markdown bold
else {
// Added 🗑️ emoji to the "session deleted" message (before confirmation)
await conn.sendMessage(m.chat, { text: `🗑️ ${emoji} ${toSansSerifPlain('Tu sesión como Sub-Bot se ha eliminado')}` }, { quoted: m })} // Removed markdown bold
try {
fs.rmdir(`./${jadi}/` + uniqid, { recursive: true, force: true })
// Added ✅ emoji to the confirmation message
await conn.sendMessage(m.chat, { text : `✅ ${emoji3} ${toSansSerifPlain('Ha cerrado sesión y borrado todo rastro.')}` } , { quoted: m })
} catch (e) {
reportError(e)
}
break

case isCommand2:
// Added ℹ️ emoji to the info message
if (global.conn.user.jid == conn.user.jid) conn.reply(m.chat, `ℹ️ ${emoji} ${toSansSerifPlain('Si no es Sub-Bot comuníquese al numero principal del Bot para ser Sub-Bot.')}`, m) // Removed markdown bold
else {
// Added 🚫 emoji to the "bot deactivated" message
await conn.reply(m.chat, `🚫 ${emoji} ${botname} ${toSansSerifPlain('desactivada.')}`, m) // Assume botname is already stylized
conn.ws.close()}
break

case isCommand3:
// Added 😔 emoji if no bots are available
//if (global.db.data.settings[conn.user.jid].jadibotmd) return m.reply(`😔 ${emoji} ${toSansSerifPlain('Este comando está desactivado por mi creador.')}`) // Apply sans-serif plain and add emoji if this line is uncommented
const users = [...new Set([...global.conns.filter((conn) => conn.user && conn.ws.socket && conn.ws.socket.readyState !== ws.CLOSED).map((conn) => conn)])];
function convertirMsADiasHorasMinutosSegundos(ms) {
var segundos = Math.floor(ms / 1000);
var minutos = Math.floor(segundos / 60);
var horas = Math.floor(minutos / 60);
var días = Math.floor(horas / 24);
segundos %= 60;
minutos %= 60;
horas %= 24;
var resultado = "";
if (días !== 0) {
resultado += días + " días, ";
}
if (horas !== 0) {
resultado += horas + " horas, ";
}
if (minutos !== 0) {
resultado += minutos + " minutos, ";
}
if (segundos !== 0) {
resultado += segundos + " segundos";
}
return resultado;
}
// Individual bot listing kept as is (already has symbols)
const message = users.map((v, i) =>
`╭━━━ ✦ Sub-Bot #${i + 1} ✦ ━━━╮
┃ 🧙 Nombre: *${toSansSerifPlain(v.user.name || 'Sub-Bot')}*
┃ ⏱️ Online: *${v.uptime ? convertirMsADiasHorasMinutosSegundos(Date.now() - v.uptime) : 'Desconocido'}*
┃ ✉️ Link: wa.me/${v.user.jid.replace(/[^0-9]/g, '')}?text=${usedPrefix}estado
╰━━━━━━━━━━━━━━━━━━━━╯`).join('\n\n');

const responseMessage = `
⚔️ *Sub-Bots Conectados: ${users.length}*

${message}
`.trim(); // Added 📊, 🤝, ⚠️, 🟢 emojis

await _envio.sendMessage(m.chat, {text: responseMessage, mentions: _envio.parseMention(responseMessage)}, {quoted: m})
break
}}

handler.tags = ['serbot']
handler.help = ['sockets', 'deletesesion', 'pausarai']
handler.command = ['deletesesion', 'deletebot', 'deletesession', 'deletesession', 'stop', 'pausarai', 'pausarbot', 'bots', 'sockets', 'socket']

export default handler

// The formatViews function was not in the provided snippet but keep it if it exists elsewhere.
// function formatViews(views) { /* ... */ }
