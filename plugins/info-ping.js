import speed from 'performance-now'
import os from 'os'

let handler = async (m, { conn }) => {
  let timestamp = speed()
  let latensi = speed() - timestamp

  // Info básica del sistema:
  let totalMem = (os.totalmem() / 1024 / 1024).toFixed(2) + ' MB'
  let freeMem = (os.freemem() / 1024 / 1024).toFixed(2) + ' MB'
  let platform = os.platform()
  let arch = os.arch()

  let info = `✰ *¡Pong!*\n> Tiempo ⴵ ${latensi.toFixed(4)} ms\n\n` +
             `🖥️ Plataforma: ${platform}\n` +
             `⚙️ Arquitectura: ${arch}\n` +
             `🧠 Memoria total: ${totalMem}\n` +
             `💾 Memoria libre: ${freeMem}`

  conn.reply(m.chat, info, m, global.bcanal)
}

handler.help = ['ping']
handler.tags = ['info']
handler.command = ['ping', 'p']
handler.register = true

export default handler