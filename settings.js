import { watchFile, unwatchFile } from 'fs';
import chalk from 'chalk';
import { fileURLToPath } from 'url';
import fs from 'fs';
import cheerio from 'cheerio';
import fetch from 'node-fetch';
import axios from 'axios';
import moment from 'moment-timezone';

//─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─

// BETA: Para evitar escribir número del bot en consola (opción 2)
global.botNumber = ''; // Ejemplo: '573218138672'

//─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─

global.owner = [
  ['50493732693', '🜲 Propietario 🜲', true],
  ['5216671548329']
];

//─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─

global.mods = [];
global.suittag = ['50493732693'];
global.prems = [];

// Definición de emojis
global.emoji = '☔';
global.emoji2 = '🍁';
global.emoji3 = '꒰⑅ᵕ༚ᵕ꒱˖♡';
global.emoji4 = '୨୧';
global.emoji5 = '♡';

// Función para obtener un emoji aleatorio
function getRandomEmoji() {
  const emojisArray = [global.emoji, global.emoji2, global.emoji3, global.emoji4];
  return emojisArray[Math.floor(Math.random() * emojisArray.length)];
}
global.emojis = getRandomEmoji();

// Reacciones
global.rwait = '🕒';
global.done = '✅';
global.error = '✖️';
global.msm = '⚠︎';

// Definición para cosas como el menú
global.canalIdM = ["120363402846939411@newsletter", "120363402846939411@newsletter"];
global.canalNombreM = [
  "⏤͟͟͞͞Vivos Vivientes 🌻❀",
  "🌳 𝖵𝗂𝗏𝗈𝗌 𝖵𝗂𝗏𝗂𝖾𝗇𝗍𝖾𝗌 🍄",
  "⪩ ᐉ 𝙑𝙞𝙫𝙤𝙨 𝙑𝙞𝙫𝙞𝙚𝙣𝙩𝙚𝙨 ⪨ ⚡",
  "✺ 𝗏𝗂𝗏𝗈𝗌 𝗏𝗂𝗏𝗂𝖾𝗇𝗍𝖾𝗌 ☼",
  "𓆩 Vɪᴠᴏs Vɪᴠɪᴇɴᴛᴇs 𓆪 ✦",
  "⌗ 𝖵𝗂𝗏𝗈𝗌・𝖵𝗂𝗏𝗂𝖾𝗇𝗍𝖾𝗌 ⌬",
  "✦ VΙVOS VIVΙENTES ™ 🌿"
];
global.channelRD = global.canalNombreM[Math.floor(Math.random() * global.canalNombreM.length)];

//redes XS
var canal = 'https://whatsapp.com/channel/0029Vagdmfv1SWt5nfdR4z3w';
var comunidad = 'https://chat.whatsapp.com/I0dMp2fEle7L6RaWBmwlAa';
var git = 'https://github.com/The-King-Destroy';
var github = 'https://github.com/The-King-Destroy/Yuki_Suou-Bot';
let correo = 'thekingdestroy507@gmail.com';
global.redes = [canal, comunidad, git, github, correo][Math.floor(Math.random() * 5)];

global.fkontak = {
  key: {
    participant: '0@s.whatsapp.net',
    ...(m && m.chat ? { remoteJid: '6285600793871-1614953337@g.us' } : {})
  },
  message: {
    contactMessage: {
      displayName: 'Michi-Ai-Bot', // Reemplazado con un nombre estático o puedes definir 'nombre' si está disponible globalmente
      vcard: `BEGIN:VCARD\nVERSION:3.0\nN:XL;Michi-Ai-Bot;;;\nFN:Michi-Ai-Bot\nitem1.TEL;waid=${m && m.sender ? m.sender.split('@')[0] : '0'}:${m && m.sender ? m.sender.split('@')[0] : '0'}\nitem1.X-ABLabel:Celular\nEND:VCARD`
    }
  }
};

//─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─

global.libreria = 'Baileys';
global.baileys = 'V 6.7.16';
global.vs = '2.2.0';
global.nameqr = 'MichiAi-MD';
global.namebot = '✿◟Mιᴄʜι-Aι-ʙᴏᴛ◞✿';
global.sessions = 'Sessions';
global.jadi = 'JadiBots';
global.yukiJadibts = true;

//─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─

global.packname = '⪛✰ 𝐌𝐢𝐜𝐡𝐢-𝐀𝐢-𝐁𝐨𝐭 ✰⪜';
global.botname = '⋆｡˚ ☁︎ 𝑴𝒊𝒄𝒉𝒊 𝒃𝒐𝒕 ✩ 𝑨𝑰';
global.wm = 'ৎ୭࠭͢ Michi_Ai-Bot ⷭ𓆪͟͞ ';
global.author = 'Made by Wirk';
global.dev = '© Powered by Wirk';
global.textbot = 'Mιᴄʜι-Aι-ʙᴏᴛ • ☁️ Powered by Wirk';
global.etiqueta = 'Wirk';

//─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─

global.moneda = '𝗖𝗵𝗼𝗰𝗼𝗹𝗮𝘁𝗲𝘀 🍫';
global.welcom1 = '❍ Edita Con El Comando setwelcome';
global.welcom2 = '❍ Edita Con El Comando setbye';
global.banner = 'https://qu.ax/EbklL.jpg';
global.avatar = 'https://qu.ax/WanWb.jpg';

//─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─

global.gp1 = 'https://chat.whatsapp.com/LVswMhDLIzbAf4WliK6nau';
global.comunidad1 = 'https://chat.whatsapp.com/LVswMhDLIzbAf4WliK6nau';
global.channel = 'https://whatsapp.com/channel/0029Vb5UfTC4CrfeKSamhp1f';
global.channel2 = 'https://whatsapp.com/channel/0029Vb5UfTC4CrfeKSamhp1f';
global.md = 'https://github.com/Ado926/BotRandom';
global.correo = 'minexdt@gmail.com';
global.cn = 'https://whatsapp.com/channel/0029Vb5UfTC4CrfeKSamhp1f';

//─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─

global.catalogo = fs.readFileSync('./src/catalogo.jpg');

// Ajuste del objeto estilo para enviar mensajes con el catálogo
global.estilo = {
  key: {
    fromMe: false,
    participant: '0@s.whatsapp.net',
  },
  message: {
    orderMessage: {
      itemCount: -999999,
      status: 1,
      surface: 1,
      message: global.packname,
      orderTitle: 'Bang',
      thumbnail: global.catalogo,
      sellerJid: '0@s.whatsapp.net',
    }
  }
};

global.ch = {
  ch1: '120363402846939411@newsletter',
};

global.bcanal = {
  contextInfo: {
    isForwarded: true,
    forwardedNewsletterMessageInfo: {
      newsletterJid: '120363402846939411@newsletter',
      serverMessageId: 100,
      newsletterName: '🍁 Vivos Vivientes - By @Wirk ☔',
    },
    externalAdReply: {
      showAdAttribution: true,
      title: global.wm,
      body: 'Michino Ai 🦈',
      mediaUrl: 'https://chat.whatsapp.com/LVswMhDLIzbAf4WliK6nau',
      description: null,
      previewType: 'PHOTO',
      thumbnailUrl: 'https://files.catbox.moe/h3lk3c.jpg',
      sourceUrl: 'https://github.com/Ado926',
      mediaType: 2,
      renderLargerThumbnail: false,
    },
  },
};

global.multiplier = 70;

//─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─

// Exportar las librerías para usar globalmente
global.cheerio = cheerio;
global.fs = fs;
global.fetch = fetch;
global.axios = axios;
global.moment = moment;

//─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─

// Watch para recargar el archivo settings.js cuando cambie
const file = fileURLToPath(import.meta.url);
watchFile(file, () => {
  unwatchFile(file);
  console.log(chalk.redBright("Update 'settings.js'"));
  import(`${file}?update=${Date.now()}`);
});
