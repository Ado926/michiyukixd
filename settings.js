import { watchFile, unwatchFile } from 'fs' 
import chalk from 'chalk'
import { fileURLToPath } from 'url'
import fs from 'fs'
import cheerio from 'cheerio'
import fetch from 'node-fetch'
import axios from 'axios'
import moment from 'moment-timezone' 

//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*

//BETA: Si quiere evitar escribir el número que será bot en la consola, agregué desde aquí entonces:
//Sólo aplica para opción 2 (ser bot con código de texto de 8 digitos)
global.botNumber = '' //Ejemplo: 573218138672

//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*

global.owner = [
  ['50493732693', '🜲 Propietario 🜲', true],
  ['5216671548329']
];

//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*

global.mods = []
global.suittag = ['50493732693'] 
global.prems = []

//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*

global.libreria = 'Baileys'
global.baileys = 'V 6.7.16' 
global.vs = '2.2.0'
global.nameqr = 'MichiAi-MD'
global.namebot = '✿◟Mιᴄʜι-Aι-ʙᴏᴛ◞✿'
global.sessions = 'Sessions'
global.jadi = 'JadiBots' 
global.yukiJadibts = true

//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*

global.packname = '⪛✰ 𝐌𝐢𝐜𝐡𝐢-𝐀𝐢-𝐁𝐨𝐭 ✰⪜'
global.botname = '⋆｡˚ ☁︎ 𝑴𝒊𝒄𝒉𝒊 𝒃𝒐𝒕 ✩ 𝑨𝑰'
global.wm = 'ৎ୭࠭͢ Michi_Ai-Bot ⷭ𓆪͟͞ '
global.author = 'Made by Wirk'
global.dev = '© Powered by Wirk'
global.textbot = 'Mιᴄʜι-Aι-ʙᴏᴛ • ☁️ Powered by Wirk'
global.etiqueta = 'Wirk'//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*

global.moneda = '🍄 MichiCoins ☁️'
global.welcom1 = '❍ Edita Con El Comando setwelcome'
global.welcom2 = '❍ Edita Con El Comando setbye'
global.banner = 'https://qu.ax/EbklL.jpg'
global.avatar = 'https://qu.ax/WanWb.jpg'

//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*

global.gp1 = 'https://chat.whatsapp.com/LVswMhDLIzbAf4WliK6nau'
global.comunidad1 = 'https://chat.whatsapp.com/LVswMhDLIzbAf4WliK6nau'
global.channel = 'https://whatsapp.com/channel/0029Vb5UfTC4CrfeKSamhp1f'
global.channel2 = 'https://whatsapp.com/channel/0029Vb5UfTC4CrfeKSamhp1f'
global.md = 'https://github.com/Ado926/BotRandom'
global.correo = 'minexdt@gmail.com'
global.cn ='https://whatsapp.com/channel/0029Vb5UfTC4CrfeKSamhp1f';

//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*

global.catalogo = fs.readFileSync('./src/catalogo.jpg');
global.estilo = { key: {  fromMe: false, participant: `0@s.whatsapp.net`, ...(false ? { remoteJid: "5219992095479-1625305606@g.us" } : {}) }, message: { orderMessage: { itemCount : -999999, status: 1, surface : 1, message: packname, orderTitle: 'Bang', thumbnail: catalogo, sellerJid: '0@s.whatsapp.net'}}}
global.ch = {
ch1: '120363402846939411@newsletter',
}
global.rcanal = {
  contextInfo: {
    isForwarded: true,
    forwardedNewsletterMessageInfo: {
      newsletterJid: "120363402846939411@newsletter",
      serverMessageId: 100,
      newsletterName: '🍁 Vivos Vivientes - By @Wirk ☔',
    },
    externalAdReply: {
      showAdAttribution: true,
      title: wm,
      body: 'Michino Ai 🦈',
      mediaUrl: null,
      description: null,
      previewType: "PHOTO",
      thumbnailUrl: 'https://qu.ax/vmBSN.jpg',
      sourceUrl: 'https://whatsapp.com/channel/0029VaAN15BJP21BYCJ3tH04',
      mediaType: 1,
      renderLargerThumbnail: false
    },
  },
}
global.multiplier = 70

//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*

global.cheerio = cheerio
global.fs = fs
global.fetch = fetch
global.axios = axios
global.moment = moment   

//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*

let file = fileURLToPath(import.meta.url)
watchFile(file, () => {
  unwatchFile(file)
  console.log(chalk.redBright("Update 'settings.js'"))
  import(`${file}?update=${Date.now()}`)
})
