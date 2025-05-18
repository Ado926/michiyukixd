import { WAMessageStubType } from '@whiskeysockets/baileys'
import fetch from 'node-fetch'

export async function before(m, { conn, participants, groupMetadata }) {
  if (!m.messageStubType || !m.isGroup) return !0

  const user = m.messageStubParameters?.[0]
  const username = user?.split('@')[0]
  const chat = global.db.data.chats[m.chat]
  const total = participants.length + (m.messageStubType == 27 ? 1 : (m.messageStubType == 28 || m.messageStubType == 32 ? -1 : 0))

  const fkontak = {
    key: { participants: '0@s.whatsapp.net', remoteJid: 'status@broadcast', fromMe: false, id: 'Halo' },
    message: {
      contactMessage: {
        vcard: `BEGIN:VCARD\nVERSION:3.0\nFN:User\nTEL;waid=${username}:${username}\nEND:VCARD`
      }
    },
    participant: '0@s.whatsapp.net'
  }

  const img = await (await fetch(
    await conn.profilePictureUrl(user, 'image').catch(() => 
      'https://raw.githubusercontent.com/The-King-Destroy/Adiciones/main/Contenido/1745522645448.jpeg'
    )
  )).buffer()

  const welcomeText = `Esperamos que disfrutes tu estancia y participes con respeto. ¡Lee las reglas y diviértete!`
  const byeText = `Se va una gran persona. ¡Buena suerte en todo lo que hagas!`

  if (chat.welcome && m.messageStubType == 27) {
    const texto = `*─「 𓆩✦ Bienvenid@ ✦𓆪 」─*\n\n` +
      `✧ Hola @${username}, ¡bienvenid@ a *${groupMetadata.subject}*!\n` +
      `${welcomeText}\n` +
      `✦ Ahora somos *${total}* miembros.\n\n` +
      `> Puedes usar *#help* para ver mis comandos.`

    await conn.sendMessage(m.chat, {
      image: img,
      caption: texto,
      mentions: [user]
    }, { quoted: fkontak })
  }

  if (chat.welcome && (m.messageStubType == 28 || m.messageStubType == 32)) {
    const texto = `*─「 𓆩✦ Despedida ✦𓆪 」─*\n\n` +
      `✧ @${username} ha salido de *${groupMetadata.subject}*.\n` +
      `${byeText}\n` +
      `✦ Ahora somos *${total}* miembros.\n\n` +
      `> Esperamos verte pronto.`

    await conn.sendMessage(m.chat, {
      image: img,
      caption: texto,
      mentions: [user]
    }, { quoted: fkontak })
  }
}