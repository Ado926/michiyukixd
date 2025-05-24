let handler = async (m, { conn, args }) => {
    let userId = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.sender
    let user = global.db.data.users[userId]
    let name = conn.getName(userId)
    let _uptime = process.uptime() * 1000
    let uptime = clockString(_uptime)
    let totalreg = Object.keys(global.db.data.users).length
    let totalCommands = Object.values(global.plugins).filter((v) => v.help && v.tags).length

    let txt = `*・°☆・°・°☆・°・*☆・°・*
¡Hola @${userId.split('@')[0]}!, ¡Bienvenido!
*・°☆・°・°☆・°・*☆・°・*

 【 *𝖬𝗂𝖼𝗁𝗂 𝖠𝗂* *${(conn.user.jid == global.conn.user.jid ? 'Principal 🅥' : 'Sub Bot 🅑')}* 】

🍁 *Moneda:* ${moneda}
🍁 *Activado:* ${uptime}
🍁 *Usuarios:* ${totalreg}
🍁 *Comandos:* ${totalCommands}
*・°☆・°・°☆・°・*☆・°・*

🍁 Obten tu *Sub Bot* con *#code* o *#qr*.


*⚙️ INFO DEL BOT*
_Comandos para ver el estado y la información general del Bot._

☔  *#help* / *#menu*: Ver la lista completa de comandos.
☔  *#uptime* / *#runtime*: Mostrar el tiempo que el Bot ha estado activo.
☔  *#status* / *#estado*: Consultar el estado actual del Bot.
☔  *#infobot*: Obtener información detallada sobre el Bot.
☔  *#p* / *#ping*: Medir la velocidad de respuesta del Bot.
☔  *#sistema* / *#system*: Ver el estado del sistema de alojamiento.
☔  *#speed* / *#speedtest*: Consultar las estadísticas de velocidad del Bot.
☔  *#views* / *#usuarios*: Ver el número total de usuarios registrados.
☔  *#funciones* / *#totalfunciones*: Descubrir todas las funciones disponibles del Bot.
☔  *#ds* / *#fixmsgespera*: Eliminar archivos de sesión innecesarios.
☔  *#editautoresponder*: Configurar un mensaje de respuesta automática personalizado.
☔  *#creador*: Obtener el contacto del creador del Bot.
☔  *#links* / *#grupos*: Acceder a los enlaces oficiales del Bot.
☔  *#sug* / *#newcommand*: Sugerir un nuevo comando.
☔  *#reporte* / *#reportar*: Reportar cualquier falla o problema con el Bot.


*🔗 SUBBOTS*
_Comandos para gestionar tus Sub☔Bots._

☔  *#serbot* / *#serbot code*: Crear una nueva sesión de Sub☔Bot.
☔  *#bots* / *#sockets*: Ver la lista de Sub☔Bots activos.


*👤 MI PERFIL*
_Comandos para personalizar y gestionar tu perfil de usuario._

☔  *#reg* / *#verificar* / *#register*: Registrar tu nombre y edad en el Bot.
☔  *#unreg*: Eliminar tu registro del Bot.
☔  *#profile*: Mostrar tu perfil de usuario.
☔  *#setgenre* / *#setgenero*: Establecer tu género en el perfil.
☔  *#delgenre* / *#delgenero*: Eliminar tu género del perfil.
☔  *#setbirth* / *#setnacimiento*: Establecer tu fecha de nacimiento.
☔  *#delbirth* / *#delnacimiento*: Eliminar tu fecha de nacimiento.
☔  *#setdescription* / *#setdesc*: Añadir una descripción a tu perfil.
☔  *#deldescription* / *#deldesc*: Eliminar la descripción de tu perfil.
☔  *#comprarpremium* / *#premium*: Adquirir un pase premium para el Bot.
☔  *#confesiones* / *#confesar*: Confesar tus sentimientos de forma anónima.


*💸 ECONOMÍA & RPG*
_Comandos para ganar ${moneda} y obtener recursos en el juego._

☔  *#w* / *#work* / *#trabajar*: Trabaja para ganar ${moneda}.
☔  *#slut* / *#protituirse*: Trabaja como prostituta y gana ${moneda}.
☔  *#crime* / *#crimen*: Conviértete en ladrón para ganar ${moneda}.
☔  *#miming* / *#minar* / *#mine*: Trabaja como minero y recolecta recursos.
☔  *#daily* / *#diario*: Reclama tu recompensa diaria.
☔  *#cofre*: Abre un cofre diario lleno de recursos.
☔  *#weekly* / *#semanal*: Reclama tu regalo semanal.
☔  *#monthly* / *#mensual*: Reclama tu recompensa mensual.
☔  *#aventura* / *#adventure*: Embárcate en una aventura y encuentra recursos.
☔  *#cazar* / *#hunt* / *#berburu*: Sal de caza en el juego.
☔  *#mazmorra* / *#explorar*: Explora mazmorras para ganar ${moneda}.
☔  *#curar* / *#heal*: Recupera tu salud para seguir aventurándote.
☔  *#inv* / *#inventario*: Revisa todos tus ítems en el inventario.
☔  *#cf* / *#suerte*: Apuesta tus ${moneda} a cara o cruz.
☔  *#ruleta* / *#roulette* / *#rt*: Apuesta ${moneda} al color rojo o negro.
☔  *#casino* / *#apostar*: Juega tus ${moneda} en el casino.
☔  *#slot*: Prueba tu suerte apostando en la ruleta.
☔  *#steal* / *#robar* / *#rob*: Intenta robar ${moneda} a otro usuario.
☔  *#robarxp* / *#robxp*: Intenta robar XP a un usuario.
☔  *#cartera* / *#wallet*: Ver la cantidad de ${moneda} en tu cartera.
☔  *#banco* / *#bank*: Ver la cantidad de ${moneda} en tu banco.
☔  *#deposit* / *#depositar* / *#d*: Deposita tus ${moneda} en el banco.
☔  *#with* / *#retirar* / *#withdraw*: Retira tus ${moneda} del banco.
☔  *#transfer* / *#pay*: Transfiere ${moneda} o XP a otros usuarios.
☔  *#buyall* / *#buy*: Compra ${moneda} usando tu XP.
☔  *#eboard* / *#baltop*: Consulta el ranking de usuarios con más ${moneda}.
☔  *#level* / *#lvl* + <@Mencion>: Ver tu nivel y experiencia actual.
☔  *#lb* / *#lboard* + <Paginá>: Ver el top de usuarios por experiencia y nivel.
☔  *#halloween*: Reclama tu dulce o truco (Solo en Halloween).
☔  *#christmas* / *#navidad*: Reclama tu regalo navideño (Solo en Navidad).


*🎁 GACHA*
_Comandos para reclamar y coleccionar personajes._

☔  *#rollwaifu* / *#rw* / *#roll*: Obtén una waifu o husbando aleatorio.
☔  *#claim* / *#c* / *#reclamar*: Reclama un personaje.
☔  *#harem* / *#waifus* / *#claims*: Ver todos tus personajes reclamados.
☔  *#charimage* / *#waifuimage* / *#wimage*: Obtén una imagen aleatoria de un personaje.
☔  *#charinfo* / *#winfo* / *#waifuinfo*: Ver información detallada de un personaje.
☔  *#givechar* / *#givewaifu* / *#regalar*: Regala un personaje a otro usuario.
☔  *#vote* / *#votar*: Vota por un personaje para aumentar su valor.
☔  *#waifusboard* / *#waifustop* / *#topwaifus*: Consulta el top de personajes con mayor valor.


*📥 DESCARGAS*
_Comandos para descargar diversos tipos de archivos._

☔  *#tiktok* / *#tt*: Descarga videos de TikTok.
☔  *#ttimg* / *#ttmp3* + <url>: Descarga fotos/audios de TikTok.
☔  *#tiktokrandom* / *#ttrandom*: Descarga un video aleatorio de TikTok.
☔  *#play* / *#play2* / *#play3*: Descarga música o videos de YouTube.
☔  *#ytmp3* / *#ytmp4*: Descarga música o videos de YouTube usando una URL.
☔  *#fb* / *#facebook*: Descarga videos de Facebook.
☔  *#twitter* / *#x* + [Link]: Descarga un video de Twitter/X.
☔  *#ig* / *#instagram*: Descarga contenido de Instagram.
☔  *#pinvid* / *#pinvideo* + [enlacé]: Descarga videos de Pinterest.
☔  *#mediafire* / *#mf*: Descarga un archivo de MediaFire.
☔  *#mega* / *#mg* + [enlacé]: Descarga un archivo de MEGA.
☔  *#terabox* / *#tb* + [enlace]: Descarga archivos desde Terabox.
☔  *#gitclone* + <url>: Descarga un repositorio de GitHub.
☔  *#apk* / *#modapk*: Descarga una aplicación APK desde Aptoide.
☔  *#npmdl* / *#npmdownloader*: Descarga paquetes de NPMJs.


*🔎 BUSCADORES*
_Comandos para realizar búsquedas en distintas plataformas._

☔  *#tiktoksearch* / *#tiktoks*: Busca videos de TikTok.
☔  *#tweetposts*: Busca publicaciones en Twitter/X.
☔  *#ytsearch* / *#yts*: Realiza búsquedas en YouTube.
☔  *#google*: Realiza búsquedas generales en Google.
☔  *#pin* / *#pinterest*: Busca imágenes en Pinterest.
☔  *#wallpaper*: Busca wallpapers.
☔  *#imagen* / *#image*: Busca imágenes en Google.
☔  *#githubsearch*: Busca usuarios en GitHub.
☔  *#cuevana* / *#cuevanasearch*: Busca películas/series en Cuevana.
☔  *#infoanime*: Busca información sobre anime/manga.
☔  *#npmjs*: Busca paquetes en npmjs.


*🔞 NSFW*
_Comandos NSFW (Contenido para adultos) ☔ Úsalo bajo tu responsabilidad._

☔  *#anal* + <mencion>: Realizar un anal.
☔  *#bath* + <mencion>: Bañarse.
☔  *#blowjob* / *#mamada* / *#bj* + <mencion>: Dar una mamada.
☔  *#boobjob* + <mencion>: Hacer una rusa.
☔  *#cum* + <mencion>: Venirse en alguien.
☔  *#fap* + <mencion>: Hacerse una paja.
☔  *#footjob* + <mencion>: Hacer una paja con los pies.
☔  *#fuck* / *#coger* / *#fuck2* + <mencion>: Follarte a alguien.
☔  *#violar* / *#perra* + <mencion>: Violar a alguien.
☔  *#grabboobs* + <mencion>: Agarrar tetas.
☔  *#grop* + <mencion>: Manosear a alguien.
☔  *#lickpussy* + <mencion>: Lamer un coño.
☔  *#sixnine* / *#69* + <mencion>: Hacer un 69 con alguien.
☔  *#spank* / *#nalgada* + <mencion>: Dar una nalgada.
☔  *#suckboobs* + <mencion>: Chupar tetas.
☔  *#undress* / *#encuerar* + <mencion>: Desnudar a alguien.
☔  *#yuri* / *#tijeras* + <mencion>: Hacer tijeras.
☔  *#waifu*: Busca una waifu aleatoria.
☔  *#ppcouple* / *#ppcp*: Genera imágenes para amistades o parejas.
☔  *#hentaisearch* / *#searchhentai*: Busca capítulos hentai.
☔  *#xnxxsearch* / *#xnxxs*: Busca videos en Xnxx.
☔  *#xvsearch* / *#xvideossearch*: Busca videos en Xvideos.
☔  *#pornhubsearch* / *#phsearch*: Busca videos en Pornhub.
☔  *#rule34* / *#r34* + [Tags]: Busca imágenes en Rule34.
☔  *#xvideosdl*: Descarga videos porno de Xvideos.
☔  *#xnxxdl*: Descarga videos porno de Xnxx.


*✨ STICKERS*
_Comandos para la creación y gestión de stickers._

☔  *#sticker* / *#s*: Crea stickers a partir de una imagen o video.
☔  *#toimg* / *#img*: Convierte un sticker en una imagen.
☔  *#setmeta*: Establece un pack y autor para tus stickers.
☔  *#delmeta*: Elimina tu pack de stickers.
☔  *#pfp* / *#getpic*: Obtén la foto de perfil de un usuario.
☔  *#qc*: Crea stickers con texto o de un usuario.
☔  *#brat* / *#ttp* / *#attp*: Crea stickers con texto.
☔  *#emojimix*: Fusiona 2 emojis para crear un sticker.
☔  *#wm*: Cambia el nombre de los stickers.


*🔧 HERRAMIENTAS*
_Comandos de herramientas con diversas funciones útiles._

☔  *#calcular* / *#cal*: Calcula todo tipo de ecuaciones.
☔  *#translate* / *#traducir* / *#trad*: Traduce palabras a otros idiomas.
☔  *#tiempo* / *#clima*: Consulta el clima de un país.
☔  *#horario*: Ver el horario global de los países.
☔  *#ss* / *#ssweb*: Consulta el estado de una página web.
☔  *#whatmusic* / *#shazam*: Descubre el nombre de canciones o videos.
☔  *#enhance* / *#remini* / *#hd*: Mejora la calidad de una imagen.
☔  *#length* / *#tamaño*: Cambia el tamaño de imágenes y videos.
☔  *#letra*: Cambia la fuente de las letras.
☔  *#say* / *#decir* + [texto]: El Bot repite un mensaje.
☔  *#fake* / *#fakereply*: Crea un mensaje falso de un usuario.
☔  *#read* / *#readviewonce* / *#ver*: Ver imágenes de una sola vista.
☔  *#todoc* / *#toducument*: Crea documentos de audio, imágenes y videos.


*🤝 GRUPOS*
_Comandos para una mejor gestión de tus grupos._

☔  *#gp* / *#infogrupo*: Ver la información del grupo.
☔  *#link*: El Bot envía el enlace del grupo.
☔  *#restablecer* / *#revoke*: Restablecer el enlace del grupo.
☔  *#grupo* / *#group* [open / abrir]: Abre el grupo para que todos envíen mensajes.
☔  *#grupo* / *#group* [close / cerrar]: Cierra el grupo (solo administradores pueden enviar).
☔  *#gpbanner* / *#groupimg*: Cambiar la imagen del grupo.
☔  *#gpname* / *#groupname*: Cambiar el nombre del grupo.
☔  *#gpdesc* / *#groupdesc*: Cambiar la descripción del grupo.
☔  *#admins* / *#admin*: Mencionar a los administradores.
☔  *#hidetag*: Enviar un mensaje mencionando a todos los usuarios.
☔  *#invocar* / *#tagall* / *#todos*: Invocar a todos los usuarios del grupo.
☔  *#linea* / *#listonline*: Ver la lista de usuarios en línea.
☔  *#fantasmas*: Ver la lista de usuarios inactivos del grupo.
☔  *#kickfantasmas*: Eliminar a los usuarios inactivos del grupo.
☔  *#kick* [número / mención]: Eliminar un usuario del grupo.
☔  *#add* / *#añadir* / *#agregar* [número]: Invitar a un usuario al grupo.
☔  *#promote* [mención / etiquetar]: Dar administrador a un usuario.
☔  *#demote* [mención / etiquetar]: Quitar administrador a un usuario.
☔  *#advertir* / *#warn* / *#warning*: Dar una advertencia a un usuario.
☔  *#unwarn* / *#delwarn*: Quitar advertencias.
☔  *#advlist* / *#listadv*: Ver la lista de usuarios advertidos.
☔  *#setwelcome*: Establecer un mensaje de bienvenida personalizado.
☔  *#setbye*: Establecer un mensaje de despedida personalizado.
☔  *#setemoji* / *#setemo*: Cambia el emoji utilizado en la invitación de usuarios.
☔  *#listnum* / *#kicknum*: Eliminar usuarios por el prefijo de su país.
☔  *#bot on*: Encender el Bot en un grupo.
☔  *#bot off*: Apagar el Bot en un grupo.
☔  *#mute* [mención / etiquetar]: El Bot elimina los mensajes del usuario.
☔  *#unmute* [mención / etiquetar]: El Bot deja de eliminar los mensajes del usuario.
☔  *#delete* / *#del*: Eliminar mensajes de otros usuarios.
☔  *#encuesta* / *#poll*: Crear una encuesta.


*🎲 JUEGOS*
_Comandos para divertirte jugando con tus amigos._

☔  *#amistad* / *#amigorandom*: Haz amigos con un juego.
☔  *#formarpareja*: Forma una pareja.
☔  *#formarpareja5*: Forma 5 parejas diferentes.
☔  *#ship* / *#pareja*: Descubre la probabilidad de enamorarte de alguien.
☔  *#formartrio* + <mencion>: Forma un trío.
☔  *#pvp* / *#suit* + <mencion>: Juega un PvP contra otro usuario.
☔  *#ttt*: Crea una sala de juego (Michi).
☔  *#ahorcado*: Diviértete con el Bot jugando al ahorcado.
☔  *#mates* / *#matematicas*: Responde preguntas de matemáticas para ganar recompensas.
☔  *#ppt*: Juega piedra, papel o tijeras con el Bot.
☔  *#sopa* / *#buscarpalabra*: Juega al famoso juego de sopa de letras.
☔  *#chiste*: El Bot te cuenta un chiste.
☔  *#consejo*: El Bot te da un consejo.
☔  *#facto*: El Bot te lanza un facto.
☔  *#frase*: El Bot te da una frase.
☔  *#meme*: El Bot te envía un meme aleatorio.
☔  *#morse*: Convierte un texto a código morse.
☔  *#nombreninja*: Busca un nombre ninja aleatorio.
☔  *#personalidad* + <mencion>: El Bot busca tu personalidad.
☔  *#piropo*: Lanza un piropo.
☔  *#pregunta*: Hazle una pregunta al Bot.
☔  *#sorteo*: Empieza un sorteo.
☔  *#top*: Empieza un top de personas.
☔  *#doxeo* / *#doxear* + <mencion>: Simula un doxeo falso.
☔  *#chaqueta* / *#jalamela*: Hazte una chaqueta.
☔  *#huevo*: Agárrale el huevo a alguien.
☔  *#chupalo* + <mencion>: Haz que un usuario te la chupe.
☔  *#aplauso* + <mencion>: Aplaudirle a alguien.
☔  *#marron* + <mencion>: Burlarte del color de piel de un usuario.
☔  *#suicidar*: Suicídate.
☔  *#iq* / *#iqtest* + <mencion>: Calcula el IQ de alguna persona.
☔  *#paja* / *#pajeame*: El Bot te hace una paja.


*💖 ANIME & REACCIONES*
_Comandos de reacciones de anime para expresar emociones._

☔  *#angry* / *#enojado* + <mencion>: Estar enojado.
☔  *#bite* + <mencion>: Muerde a alguien.
☔  *#bleh* + <mencion>: Sacar la lengua.
☔  *#blush* + <mencion>: Sonrojarte.
☔  *#bored* / *#aburrido* + <mencion>: Estar aburrido.
☔  *#cry* + <mencion>: Llorar por algo o alguien.
☔  *#cuddle* + <mencion>: Acurrucarse.
☔  *#dance* + <mencion>: Saca tus pasos prohibidos.
☔  *#drunk* + <mencion>: Estar borracho.
☔  *#eat* / *#comer* + <mencion>: Comer algo delicioso.
☔  *#facepalm* + <mencion>: Darte una palmada en la cara.
☔  *#happy* / *#feliz* + <mencion>: Saltar de felicidad.
☔  *#hug* + <mencion>: Dar un abrazo.
☔  *#impregnate* / *#preg* + <mencion>: Embarazar a alguien.
☔  *#kill* + <mencion>: Toma tu arma y mata a alguien.
☔  *#kiss* / *#besar* / *#kiss2* + <mencion>: Dar un beso.
☔  *#laugh* + <mencion>: Reírte de algo o alguien.
☔  *#lick* + <mencion>: Lamer a alguien.
☔  *#love* / *#amor* + <mencion>: Sentirse enamorado.
☔  *#pat* + <mencion>: Acaricia a alguien.
☔  *#poke* + <mencion>: Picar a alguien.
☔  *#pout* + <mencion>: Hacer pucheros.
☔  *#punch* + <mencion>: Dar un puñetazo.
☔  *#run* + <mencion>: Correr.
☔  *#sad* / *#triste* + <mencion>: Expresar tristeza.
☔  *#scared* + <mencion>: Estar asustado.
☔  *#seduce* + <mencion>: Seducir a alguien.
☔  *#shy* / *#timido* + <mencion>: Sentir timidez.
☔  *#slap* + <mencion>: Dar una bofetada.
☔  *#dias* / *#days*: Darle los buenos días a alguien.
☔  *#noches* / *#nights*: Darle las buenas noches a alguien.
☔  *#sleep* + <mencion>: Tumbarte a dormir.
☔  *#smoke* + <mencion>: Fumar.
☔  *#think* + <mencion>: Pensar en algo.
☔  *#marry* [mención / etiquetar]: Proponer matrimonio a otro usuario.
☔  *#divorce*: Divorciarte de tu pareja.
☔  *#cafe* / *#coffe*: Tomarte un cafecito con alguien.`.trim()

        await conn.sendMessage(m.chat, { 
      text: txt,
      contextInfo: {
          mentionedJid: [m.sender, userId],
          isForwarded: true,
          forwardedNewsletterMessageInfo: {
              newsletterJid: channelRD.id,
              newsletterName: channelRD.name,
              serverMessageId: -1,
          },
          forwardingScore: 999,
          externalAdReply: {
              title: botname,
              body: textbot,
              thumbnailUrl: banner,
              sourceUrl: redes,
              mediaType: 1,
              showAdAttribution: true,
              renderLargerThumbnail: true,
          },
      },
  }, { quoted: m })

}
handler.help = ['menu']
handler.tags = ['main']
handler.command = ['menu', 'menú', 'help']

// Changed export default handler to module.exports
export default handler

function clockString(ms) {
    let seconds = Math.floor((ms / 1000) % 60)
    let minutes = Math.floor((ms / (1000 * 60)) % 60)
    let hours = Math.floor((ms / (1000 * 60 * 60)) % 24)
    return `${hours}h ${minutes}m ${seconds}s`
}
