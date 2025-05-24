import speed from 'performance-now'
import { exec } from 'child_process'

let handler = async (m, { conn }) => {
  let timestamp = speed()
  let latensi = speed() - timestamp
  exec(`neofetch --stdout`, (error, stdout, stderr) => {
    if (error) {
      console.error(error)
      return conn.reply(m.chat, 'Error ejecutando neofetch', m, global.bcanal)
    }
    let child = stdout.toString('utf-8')
    let ssd = child.replace(/Memory:/, 'Ram:')

    conn.reply(m.chat, `✰ *¡Pong!*\n> Tiempo ⴵ ${latensi.toFixed(4)}ms\n\n${ssd}`, m, global.bcanal)
  })
}

handler.help = ['ping']
handler.tags = ['info']
handler.command = ['ping', 'p']
handler.register = true

export default handler