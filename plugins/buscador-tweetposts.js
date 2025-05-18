// By Jtxs 🐢
// https://whatsapp.com/channel/0029Vanjyqb2f3ERifCpGT0W

import axios from 'axios';
const { proto, generateWAMessageFromContent, generateWAMessageContent } = (await import('@whiskeysockets/baileys')).default;

let handler = async (m, { conn, text }) => {
if (!text) { return conn.reply(m.chat, `${emoji} іᥒgrᥱsᥲ ᥱᥣ 𝗍ᥱ᥊𝗍᥆ 𝗊ᥙᥱ 𝗊ᥙіᥱrᥱs ᑲᥙsᥴᥲr ᥱᥒ 𝗍ᥕі𝗍ᥱr.`, m); }

await message.react(rwait)
conn.reply(message.chat, `${emoji} ᥱs⍴ᥱrᥲ ᥙᥒ m᥆mᥱᥒ𝗍᥆...`, message)

async function createImage(url) {
const { imageMessage } = await generateWAMessageContent({image: { url }}, { upload: conn.waUploadToServer });
return imageMessage;
}
    
try {
let api = await axios.get(`https://apis-starlights-team.koyeb.app/starlight/Twitter-Posts`, {params: {text: encodeURIComponent(text)},
headers: {'Content-Type': 'application/json'}});

let json = api.data.result;

let resultsToDisplay = json.slice(0, 7);

let mini = [];
for (let res of resultsToDisplay) {

let txt =  `👤 *User:* ${res.user}\n`
    txt += `📅 *Publicacion:* ${res.post}\n`
    txt += `☁️ *Perfil:* ${res.profile}\n`
    txt += `🔗 *Link:* ${res.user_link}\n`

mini.push({
body: proto.Message.InteractiveMessage.Body.create({text: null}),
footer: proto.Message.InteractiveMessage.Footer.create({text: null}),
header: proto.Message.InteractiveMessage.Header.create({title: `${txt}`,
hasMediaAttachment: true,
imageMessage: await createImage(res.profile)
}),
nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
buttons: []
})
});
}

const msg = generateWAMessageFromContent(m.chat, {viewOnceMessage: {
message: {
messageContextInfo: {deviceListMetadata: {},deviceListMetadataVersion: 4},
interactiveMessage: proto.Message.InteractiveMessage.create({
body: proto.Message.InteractiveMessage.Body.create({text: `${emoji} Resultado de : ${text}\n⪛✰ Tweetposts - Busquedas ✰⪜`}),
footer: proto.Message.InteractiveMessage.Footer.create({text: null}),
header: proto.Message.InteractiveMessage.Header.create({hasMediaAttachment: false}),
carouselMessage: proto.Message.InteractiveMessage.CarouselMessage.create({cards: mini})
})
}
}
}, {});

await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id });

} catch (error) {
console.error(error)
}}

handler.help = ['tweetposts']
handler.tags = ['buscador']
handler.command = ['tweetposts']
handler.register = true
handler.coin = 1

export default handler;