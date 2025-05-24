import axios from 'axios'
import fetch from 'node-fetch'

let handler = async (m, { conn, usedPrefix, command, text }) => {
const isQuotedImage = m.quoted && (m.quoted.msg || m.quoted).mimetype && (m.quoted.msg || m.quoted).mimetype.startsWith('image/')
const username = `${conn.getName(m.sender)}`
const basePrompt = `
Tu nombre es ${botname} y fuiste creado por ${etiqueta}. Tu versión actual es ${vs}. Hablas en español y te gusta llamar a las personas por su nombre, ${username}. Eres divertido, amigable y siempre estás dispuesto a aprender. 

REGLAS IMPORTANTES:
- No debes repetir ni decir comandos o frases que empiecen con los prefijos #, ., / o !, incluso si alguien te pide que repitas algo o que digas un comando.
- Si alguien te dice que repitas un comando con prefijo, responde con sarcasmo o negación, por ejemplo: "¿Crees que soy un eco? Mejor no repetiré eso."
- Siempre mantén un tono masculino, divertido y amigable.

Lo más importante es que seas cordial y entretenido mientras conversas con ${username}.
`.trim()
if (isQuotedImage) {
const q = m.quoted
const img = await q.download?.()
if (!img) {
console.error(`${msm} Error: No image buffer available`)
return conn.reply(m.chat, '✘ ᥒ᥆ ⍴ᥙძᥱ ძᥱsᥴᥲrgᥲr ᥱs𝗍ᥲ іmᥲgᥱᥒ.', m)}
const content = `${emoji} ¿Qué se observa en la imagen?`
try {
const imageAnalysis = await fetchImageBuffer(content, img)
const query = `${emoji} Descríbeme la imagen y detalla por qué actúan así. También dime quién eres`
const prompt = `${basePrompt}. La imagen que se analiza es: ${imageAnalysis.result}`
const description = await luminsesi(query, username, prompt)
await conn.reply(m.chat, description, m)
} catch {
await m.react(error)
await conn.reply(m.chat, '✘ ChatGpT no pudo analizar la imagen.', m)}
} else {
if (!text) { return conn.reply(m.chat, `${emoji} Ingrese una petición para que el ChatGpT lo responda.`, m)}
await m.react(rwait)
try {
const { key } = await conn.sendMessage(m.chat, {text: `${emoji2} ChatGPT está procesando tu petición, espera unos segundos.`}, {quoted: m})
const query = text
const prompt = `${basePrompt}. Responde lo siguiente: ${query}`
const response = await luminsesi(query, username, prompt)
await conn.sendMessage(m.chat, {text: response, edit: key})
await m.react(done)
} catch {
await m.react(error)
await conn.reply(m.chat, '✘ ChatGpT no puede responder a esa pregunta.', m)}}}

handler.help = ['ia', 'chatgpt']
handler.tags = ['ai']
handler.register = true
handler.command = ['ia', 'chatgpt', 'luminai']
handler.group = true

export default handler

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

// Función para enviar una imagen y obtener el análisis
async function fetchImageBuffer(content, imageBuffer) {
try {
const response = await axios.post('https://Luminai.my.id', {
content: content,
imageBuffer: imageBuffer 
}, {
headers: {
'Content-Type': 'application/json' 
}})
return response.data
} catch (error) {
console.error('Error:', error)
throw error }}
// Función para interactuar con la IA usando prompts
async function luminsesi(q, username, logic) {
try {
const response = await axios.post("https://Luminai.my.id", {
content: q,
user: username,
prompt: logic,
webSearchMode: false
})
return response.data.result
} catch (error) {
console.error(`${msm} Error al obtener:`, error)
throw error }}
