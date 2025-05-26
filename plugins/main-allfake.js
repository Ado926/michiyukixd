import pkg from '@whiskeysockets/baileys'
import fs from 'fs'
import fetch from 'node-fetch'
import axios from 'axios'
import moment from 'moment-timezone'
const { generateWAMessageFromContent, prepareWAMessageMedia, proto } = pkg

var handler = m => m

handler.all = async function (m, { conn }) {
  // Función getBuffer
  global.getBuffer = async function (url, options = {}) {
    try {
      const res = await axios({
        method: "get",
        url,
        headers: {
          'DNT': 1,
          'User-Agent': 'GoogleBot',
          'Upgrade-Insecure-Request': 1
        },
        ...options,
        responseType: 'arraybuffer'
      })
      return res.data
    } catch (e) {
      console.log(`Error : ${e}`)
      return null
    }
  }

  // Datos generales
  global.creador = 'Wa.me/393715279301'
  global.ofcbot = conn?.user?.jid ? conn.user.jid.split('@')[0] : 'BOT'
  global.asistencia = 'Wa.me/393715279301'
  global.namechannel = '=͟͟͞❀ sᥙmі - sᥲkᥙrᥲsᥲᥕᥲ  ⏤͟͟͞͞★'
  global.namechannel2 = '=͟͟͞❀ sᥙmі - sᥲkᥙrᥲsᥲᥕᥲ ⏤͟͟͞͞★'
  global.namegrupo = 'ᰔᩚ ᥡᥙkі sᥙ᥆ᥙ • ᥆𝖿іᥴіᥲᥣ ❀'
  global.namecomu = 'ᰔᩚ ᥡᥙkіᑲ᥆𝗍-mძ • ᥴ᥆mᥙᥒі𝗍ᥡ ❀'
  global.listo = '❀ *Aquí tienes ฅ^•ﻌ•^ฅ*'
  global.fotoperfil = await conn.profilePictureUrl(m.sender, 'image').catch(_ => 'https://files.catbox.moe/xr2m6u.jpg')

  // Canal random
  global.canalIdM = ["120363402846939411@newsletter", "120363402846939411@newsletter"]
  global.canalNombreM = [
    "⪩ ᐉ 𝙑𝙞𝙫𝙤𝙨 𝙑𝙞𝙫𝙞𝙚𝙣𝙩𝙚𝙨 ⪨ ⚡",
    "✺ 𝗏𝗂𝗏𝗈𝗌 𝗏𝗂𝗏𝗂𝖾𝗇𝗍𝖾𝗌 ☼",
    "𓆩 Vɪᴠᴏs Vɪᴠɪᴇɴᴛᴇs 𓆪 ✦",
    "⌗ 𝖵𝗂𝗏𝗈𝗌・𝖵𝗂𝗏𝗂𝖾𝗇𝗍𝖾𝗌 ⌬",
    "✦ VΙVOS VIVΙENTES ™ 🌿"
  ]
  global.channelRD = canalNombreM[Math.floor(Math.random() * canalNombreM.length)]

  // Tiempo
  global.d = new Date(new Date + 3600000)
  global.locale = 'es'
  global.dia = d.toLocaleDateString(locale, { weekday: 'long' })
  global.fecha = d.toLocaleDateString('es', { day: 'numeric', month: 'numeric', year: 'numeric' })
  global.mes = d.toLocaleDateString('es', { month: 'long' })
  global.año = d.toLocaleDateString('es', { year: 'numeric' })
  global.tiempo = d.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true })

  // Emojis y estados
  global.rwait = '🕒'
  global.done = '✅'
  global.error = '✖️'
  global.msm = '⚠︎'
  global.emoji = '♡(｡- ω -)'
  global.emoji2 = '(ฅ•.•ฅ)'
  global.emoji3 = '꒰ ֊ ܸ. .ܸ ֊ ꒱'
  global.emoji4 = '૮₍ ˶ᵔ ᵕ ᵔ˶ ₎ა'
  global.emoji5 = '(｡・//ε//・｡)'
  global.emojis = [emoji, emoji2, emoji3, emoji4][Math.floor(Math.random() * 4)]

  global.wait = ' Espera un momento, soy lento...'
  global.waitt = global.waittt = global.waitttt = global.wait

  // Redes
  var canal = 'https://whatsapp.com/channel/0029Vagdmfv1SWt5nfdR4z3w'
  var comunidad = 'https://chat.whatsapp.com/I0dMp2fEle7L6RaWBmwlAa'
  var git = 'https://github.com/The-King-Destroy'
  var github = 'https://github.com/The-King-Destroy/Yuki_Suou-Bot'
  let correo = 'thekingdestroy507@gmail.com'
  global.redes = [canal, comunidad, git, github, correo][Math.floor(Math.random() * 5)]

  // Icono aleatorio desde db
  const category = "imagen"
  const db = './src/database/db.json'
  const db_ = JSON.parse(fs.readFileSync(db))
  const randomlink = db_.links[category][Math.floor(Math.random() * db_.links[category].length)]
  const response = await fetch(randomlink)
  const rimg = await response.buffer()
  global.icons = rimg

  // Saludo por hora
  let h = new Date().getHours()
  if (h < 3) global.saludo = 'Lɪɴᴅᴀ Nᴏᴄʜᴇ 🌃'
  else if (h < 7) global.saludo = 'Lɪɴᴅᴀ Mᴀɴ̃ᴀɴᴀ 🌄'
  else if (h < 12) global.saludo = 'Lɪɴᴅᴏ Dɪᴀ 🌤'
  else if (h < 18) global.saludo = 'Lɪɴᴅᴀ Tᴀʀᴅᴇ 🌆'
  else global.saludo = 'Lɪɴᴅᴀ Nᴏᴄʜᴇ 🌃'

  // Nombre y formato
  global.nombre = m.pushName || 'Anónimo'
  global.taguser = '@' + m.sender.split("@")[0]
  var more = String.fromCharCode(8206)
  global.readMore = more.repeat(850)

  // Stickers
  global.packsticker = `╭─〔 ʚ♡ɞ Michi Ai Stickers 〕─✧  
│ ୨୧ Canal oficial:  
│ https://whatsapp.com/channel/0029Vb5UfTC4CrfeKSamhp1f  
│  
│ 𖥸 Info:  
│ By Wirk  
╰─────────────♡`

  global.packsticker2 = `\n╭─〔 🐱 Datos del Sticker 〕─✧  
│ ✿ Bot: ${conn?.user?.name || 'Bot'}  
│ ✿ Usuario: ${nombre}  
│ ✿ Fecha: ${fecha}  
╰┈➤ 🕰️ Hora exacta: ${tiempo}`

  // Contacto falso
  global.fkontak = {
    key: {
      participant: `0@s.whatsapp.net`,
      ...(m.chat ? { remoteJid: `6285600793871-1614953337@g.us` } : {})
    },
    message: {
      contactMessage: {
        displayName: `${nombre}`,
        vcard: `BEGIN:VCARD\nVERSION:3.0\nN:XL;${nombre};;;\nFN:${nombre}\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Celular\nEND:VCARD`
      }
    }
  }
}

export default handlerq