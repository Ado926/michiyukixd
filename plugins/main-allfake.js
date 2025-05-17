import pkg from '@whiskeysockets/baileys'
import fs from 'fs'
import fetch from 'node-fetch'
import axios from 'axios'
import moment from 'moment-timezone' // Importado pero no usado en este fragmento

const { generateWAMessageFromContent, prepareWAMessageMedia, proto } = pkg

// --- Definiciones globales y carga inicial ---

// Define Array.prototype.getRandom if it doesn't exist
if (!Array.prototype.getRandom) {
    Array.prototype.getRandom = function () {
        return this[Math.floor(Math.random() * this.length)];
    };
}

// Helper function to get buffer from URL
global.getBuffer = async function getBuffer(url, options) {
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
        });
        return res.data;
    } catch (e) {
        console.error(`Error fetching buffer from ${url}: ${e}`);
        return null; // Return null on error
    }
};

// Load database once at startup
let db_ = {};
try {
    const dbPath = './src/database/db.json';
    if (fs.existsSync(dbPath)) {
        db_ = JSON.parse(fs.readFileSync(dbPath));
    } else {
        console.warn(`Database file not found at ${dbPath}. Initializing empty database.`);
        db_ = { links: {} }; // Initialize with empty structure
    }
} catch (e) {
    console.error(`Error loading database file: ${e}`);
    db_ = { links: {} }; // Initialize with empty structure on error
}

// Load a random icon image once at startup (or set a default)
global.icons = null;
const imageCategory = "imagen"; // Assuming 'imagen' is a key in db_.links
if (db_.links && db_.links[imageCategory] && db_.links[imageCategory].length > 0) {
    const randomLink = db_.links[imageCategory].getRandom();
    // Fetch the image buffer but handle potential errors gracefully
    getBuffer(randomLink).then(buffer => {
        if (buffer) {
            global.icons = buffer;
            console.log("Successfully loaded initial random icon.");
        } else {
            console.warn("Failed to load initial random icon from database link.");
            // Optional: Set a default fallback icon if fetching fails
            // global.icons = await getBuffer('DEFAULT_FALLBACK_IMAGE_URL');
        }
    }).catch(e => {
        console.error(`Error during initial icon fetch: ${e}`);
         // Optional: Set a default fallback icon if fetching fails
         // global.icons = await getBuffer('DEFAULT_FALLBACK_IMAGE_URL');
    });
} else {
    console.warn(`No links found for category '${imageCategory}' in database.`);
    // Optional: Set a default fallback icon if no links are available
    // global.icons = await getBuffer('DEFAULT_FALLBACK_IMAGE_URL');
}

// Define static global variables
global.creador = 'Wa.me/5212202410659';
// global.ofcbot = `${conn.user.jid.split('@')[0]}`; // Requires 'conn' available globally or passed
global.namechannel = '=͟͟͞❀ 𝐘𝐮𝐤𝐢 𝐒𝐮𝐨𝐮 - 𝐂𝐡𝐚𝐧𝐧𝐞𝐥 ⏤͟͟͞͞★';
global.namechannel2 = '=͟͟͞❀ 𝐘𝐮𝐤𝐢 𝐒𝐮𝐨𝐮 - 𝐂𝐡𝐚𝐧𝐧𝐞𝐥 ⏤͟͟͞͞★'; // Duplicate, might be intentional?
global.namegrupo = 'ᰔᩚ Michi Ai • ᥆𝖿іᥴіᥲᥣ ❀';
global.namecomu = 'ᰔᩚ mіᥴһі ᥲі • ᥴ᥆mᥙᥒі𝗍ᥡ ❀';
global.listo = '✐ *Ahi tienes ✧(｡•̀ᴗ-)✧*';

// Static list of channel IDs and Names
global.canalIdM = ["✼  ⃟᭄🍷🆅ꪱׁׁׁׁׅׅׅׅ᥎ׁׅᨵׁׅׅ꯱ ׁׅ🆅ꪱׁׁׁׁׅׅׅׅ᥎ׁׅꪱׁׁׁׅׅׅꫀׁׅܻ݊݊ꪀtׁׁׅׅꫀׁׅܻׅ݊꯱⃟✤", "120363402846939411@newsletter"];
global.canalNombreM = ["✼  ⃟᭄🍷🆅ꪱׁׁׁׁׅׅׅׅ᥎ׁׅᨵׁׅׅ꯱ ׁׅ🆅ꪱׁׁׁׁׅׅׅׅ᥎ׁׅꪱׁׁׁׅׅׅꫀׁׅܻ݊݊ꪀtׁׁׅׅꫀׁׅܻׅ݊꯱⃟✤", "✼  ⃟᭄🍷🆅ꪱׁׁׁׁׅׅׅׅ᥎ׁׅᨵׁׅׅ꯱ ׁׅ🆅ꪱׁׁׁׁׅׅׅׅ᥎ׁׅꪱׁׁׁׅׅׅꫀׁׅܻ݊݊ꪀtׁׁׅׅꫀׁׅܻׅ݊꯱⃟✤"]; // Duplicate, might be intentional?

// Static list of network links
global.redes = [
    'https://whatsapp.com/channel/0029Vb5UfTC4CrfeKSamhp1f',
    'https://chat.whatsapp.com/LVswMhDLIzbAf4WliK6nau',
    'https://github.com/Ado926',
    'https://github.com/Ado926/BotRandom',
    'minexdt@gmail.com'
];

// Define base wait message (can be reused)
global.wait = '❍ Espera un momento, soy lenta...';
// Removed redundant waitt, waittt, waitttt as they were duplicates

// Static icon list for context
global.iconosList = [
    'https://qu.ax/HKtQj.jpg',
    // Add more icon URLs here if needed
];


// --- Handler function ---

var handler = m => m;
handler.all = async function (m) {
    // Ensure conn is available (assuming it's provided by the framework)
    if (!global.conn) {
        console.error("Baileys connection object 'conn' is not available in the global scope.");
        return; // Exit if conn is not available
    }

    // Get sender's profile picture URL (can be slow, might be better outside if not needed for every message)
    global.fotoperfil = await conn.profilePictureUrl(m.sender, 'image').catch(_ => 'https://raw.githubusercontent.com/The-King-Destroy/Adiciones/main/Contenido/1745522645448.jpeg');

    // Get random channel details for context (done per message if context is needed)
    // Assuming getRandomChannel selects randomly from canalIdM/canalNombreM
    global.channelRD = await (async function getRandomChannel() {
        let randomIndex = Math.floor(Math.random() * global.canalIdM.length);
        let id = global.canalIdM[randomIndex];
        let name = global.canalNombreM[randomIndex]; // Use global.canalNombreM
        return { id, name };
    })();


    // Date and Time formatting (done per message as it changes)
    const d = new Date();
    global.locale = 'es';
    global.dia = d.toLocaleDateString(global.locale, { weekday: 'long' });
    global.fecha = d.toLocaleDateString('es', { day: 'numeric', month: 'numeric', year: 'numeric' });
    global.mes = d.toLocaleDateString('es', { month: 'long' });
    global.año = d.toLocaleDateString('es', { year: 'numeric' });
    global.tiempo = d.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true }); // Using en-US for standard AM/PM format

    // Emojis
    global.emoji = '✰';
    global.emoji2 = '✤';
    global.emoji3 = '✧';
    global.emoji4 = '❒';
    global.emoji5 = '✰'; // Duplicate, might be intentional?
    global.emojis = [global.emoji, global.emoji2, global.emoji3, global.emoji4].getRandom();

    // Randomly select a network link per message if needed for context
    const randomRedesLink = global.redes.getRandom(); // Use the pre-defined global.redes array

    // Determine greeting based on hour (done per message)
    const hour = d.getHours();
    let greeting;
    if (hour >= 0 && hour < 3) greeting = 'Lɪɴᴅᴀ Nᴏᴄʜᴇ 🌃';
    else if (hour >= 3 && hour < 7) greeting = 'Lɪɴᴅᴀ Mᴀɴ̃ᴀɴᴀ 🌄';
    else if (hour === 7) greeting = 'Lɪɴᴅᴀ Mᴀɴ̃ᴀɴᴀ 🌅';
    else if (hour >= 8 && hour < 10) greeting = 'LɪɴᴅA Mᴀɴ̃ᴀɴᴀ 🌄';
    else if (hour >= 10 && hour < 14) greeting = 'Lɪɴᴅᴏ Dɪᴀ 🌤';
    else if (hour >= 14 && hour < 18) greeting = 'Lɪɴᴅᴀ Tᴀʀᴅᴇ 🌆';
    else greeting = 'Lɪɴᴅᴀ NᴏᴄʜE 🌃';
    global.saludo = greeting;

    // User and bot names
    global.nombre = m.pushName || 'Anónimo';
    global.taguser = '@' + m.sender.split("@s.whatsapp.net")[0];
    // Assuming global.botname and global.dev are defined elsewhere
    // global.botname = 'YourBotName';
    // global.dev = 'YourDevInfo';


    // Read More character
    const more = String.fromCharCode(8206);
    global.readMore = more.repeat(850);

    // Sticker pack info (uses variables set above)
    // Ensure global.botname and global.dev are defined before this
    global.packsticker = `°.⎯⃘̶⎯̸⎯ܴ⎯̶᳞͇ࠝ⎯⃘̶⎯̸⎯ܴ⎯̶᳞͇ࠝ⎯⃘̶⎯̸.°\nᰔᩚ Usuario: ${global.nombre}\n❀ Bot: ${global.botname || 'Bot'}\n✦ Fecha: ${global.fecha}\nⴵ Hora: ${global.tiempo}`;
    global.packsticker2 = `\n°.⎯⃘̶⎯̸⎯ܴ⎯̶᳞͇ࠝ⎯⃘̶⎯̸⎯ܴ⎯̶᳞͇ࠝ⎯⃘̶⎯̸.°\n\n${global.dev || 'Developer'}`;

    // Fake kontak object (uses variables set above)
    global.fkontak = {
        key: {
            participant: `0@s.whatsapp.net`,
            ...(m.chat ? { remoteJid: `6285600793871-1614953337@g.us` } : {})
        },
        message: {
            'contactMessage': {
                'displayName': `${global.nombre}`,
                'vcard': `BEGIN:VCARD\nVERSION:3.0\nN:XL;${global.nombre},;;;\nFN:${global.nombre},\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD`,
                'jpegThumbnail': null, // Consider providing a thumbnail here if available
                thumbnail: null, // Consider providing a thumbnail here if available
                sendEphemeral: true
            }
        }
    };

    // Select a random icon URL for context (done per message)
    global.icono = global.iconosList.getRandom();

    // Fake context object for forwarding (uses variables set above)
    global.fake = {
        contextInfo: {
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
                newsletterJid: global.channelRD.id,
                newsletterName: global.channelRD.name,
                serverMessageId: -1 // Or a specific message ID if needed
            }
        }
        // The original code had a syntax error here with { quoted: m } outside the object.
        // If you want to quote the message *and* have the context, you need to combine them when sending the message.
        // This 'fake' object is likely just for the context part.
        // Example usage when sending: conn.sendMessage(m.chat, { text: '...', contextInfo: global.fake }, { quoted: m });
    };

    // Reply channel context object (uses variables set above)
    // Ensure global.packname and global.dev are defined before this
    global.rcanal = {
        contextInfo: {
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
                newsletterJid: global.channelRD.id,
                serverMessageId: 100, // Or a specific message ID if needed
                newsletterName: global.channelRD.name,
            },
            externalAdReply: {
                showAdAttribution: true,
                title: global.packname || 'Pack Name', // Use global.packname or a default
                body: global.dev || 'Developer', // Use global.dev or a default
                mediaUrl: null, // Set if you have media
                description: null, // Set if you have a description
                previewType: "PHOTO", // Or "VIDEO"
                thumbnailUrl: global.icono, // Use the randomly selected icon URL
                sourceUrl: randomRedesLink, // Use the randomly selected network link
                mediaType: 1, // 1 for image, 2 for video
                renderLargerThumbnail: false
            },
        }
        // The original code had { quoted: m } outside the object, which was a syntax error.
        // Similar to global.fake, this object is likely for the context part and the quote should be added when sending.
        // Example usage when sending: conn.sendMessage(m.chat, { text: '...', contextInfo: global.rcanal }, { quoted: m });
    };

    // Any other logic that should run for every message goes here
};

export default handler;

// The original pickRandom function can be removed if Array.prototype.getRandom is used consistently
// function pickRandom(list) {
// return list[Math.floor(Math.random() * list.length)]
// }

// The original getRandomChannel function is now implemented inline within handler.all
// async function getRandomChannel() {
// let randomIndex = Math.floor(Math.random() * canalIdM.length)
// let id = canalIdM[randomIndex]
// let name = canalNombreM[randomIndex]
// return { id, name }
// }
