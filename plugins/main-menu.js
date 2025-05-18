let handler = async (m, { conn, args }) => {
    let userId = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.sender
    let user = global.db.data.users[userId]
    let name = conn.getName(userId)
    let _uptime = process.uptime() * 1000
    let uptime = clockString(_uptime)
    let totalreg = Object.keys(global.db.data.users).length
    let totalCommands = Object.values(global.plugins).filter((v) => v.help && v.tags).length

    let txt = ` > 𝙷𝚘𝚕𝚊! 𝚋𝚒𝚎𝚗𝚟𝚎𝚗𝚒𝚍@ 𝚊𝚕 𝚖𝚎𝚗𝚞 𝚍𝚎 *${botname}*

╭─〔🪴 Info del Bot 🪴〕─╮
│🌿 Usuario ➩ @${userId.split('@')[0]}
│🌱 Modo ➩ Público
│🌸 Bot ➩ ${(conn.user.jid == global.conn.user.jid ? 'Principal 🅥' : 'Prem Bot 🅑')}
│🌺 Encendido ➩ ${uptime}
│🌻 Usuarios totales ➩ ${totalreg}
│🌼 Comandos disponibles ➩ ${totalCommands}
╰───────────────────╯

> 🌳 Puedes tener tu *Sub Bot* usa *#code* o *#qr* para vincular.

✦⭒ MENÚ DE COMANDOS ⭒✦

✦⭒ INFO BOT ⭒✦
❢ Comandos para ver estado e información de la Bot.
➜ *#help • #menu*
> ✿ Ver la lista de comandos de la Bot.
➜ *#uptime • #runtime*
> ✿ Ver tiempo activo o en linea de la Bot
➜ *#status • #estado*
> ✿ Ver el estado actual de la Bot.
➜ *#infobot • #infobot*
> ✿ Ver la información completa de la Bot.
➜ *#p • #ping*
> ✿ Ver la velocidad de respuesta del Bot.
➜ *#sistema • #system*
> ✿ Ver estado del sistema de alojamiento.
➜ *#speed • #speedtest*
> ✿ Ver las estadísticas de velocidad de la Bot.
➜ *#views • #usuarios*
> ✿ Ver la cantidad de usuarios registrados en el sistema.
➜ *#funciones • #totalfunciones*
> ✿ Ver todas las funciones de la Bot.
➜ *#ds • #fixmsgespera*
> ✿ Eliminar archivos de sesión innecesarios.
➜ *#editautoresponder*
> ✿ Configurar un Prompt personalizado de la Bot.
➜ *#creador*
> ✿ Contacto del creador de la Bot.
➜ *#links • #grupos*
> ✿ Ver los enlaces oficiales de la Bot.
➜ *#sug • #newcommand*
> ✿ Sugiere un nuevo comando.
➜ *#reporte • #reportar*
> ✿ Reporta alguna falla o problema de la Bot.

✦⭒ SUB BOT ⭒✦
❢ Comandos para gestionar Sub-Bots.
➜ *#serbot • #serbot code*
> ✿ Crea una sesión de Sub-Bot.
➜ *#bots • #sockets*
> ✿ Ver la lista de Sub-Bots activos.

✦⭒ PERFIL ⭒✦
❣ Comandos de perfil para ver, configurar y comprobar estados de tu perfil.
➜ *#reg • #verificar • #register*
> ✿ Registra tu nombre y edad en el bot.
➜ *#unreg*
> ✿ Elimina tu registro del bot.
➜ *#profile*
> ✿ Muestra tu perfil de usuario.
➜ *#setgenre • #setgenero*
> ✿ Establece tu género en el perfil del bot.
➜ *#delgenre • #delgenero*
> ✿ Elimina tu género del perfil del bot.
➜ *#setbirth • #setnacimiento*
> ✿ Establece tu fecha de nacimiento en el perfil del bot.
➜ *#delbirth • #delnacimiento*
> ✿ Elimina la fecha de nacimiento del perfil del bot.
➜ *#setdescription • #setdesc*
> ✿ Establece una descripción en tu perfil del bot.
➜ *#deldescription • #deldesc*
> ✿ Elimina la descripción de tu perfil del bot.
➜ *#comprarpremium • #premium*
> ✿ Compra un pase premium para usar el bot sin límites.
➜ *#confesiones • #confesar*
> ✿ Confiesa tus sentimientos a alguien de manera anonima.

✦⭒ ECONOMÍA Y RPG ⭒✦
❣ Comandos de economía y rpg para ganar dinero y otros recursos.
➜ *#w • #work • #trabajar*
> ✿ Trabaja para ganar ${moneda}.
➜ *#slut • #protituirse*
> ✿ Trabaja como prostituta y gana ${moneda}.
➜ *#crime • #crimen*
> ✿ Trabaja como ladrón para ganar ${moneda}.
➜ *#miming • #minar • #mine*
> ✿ Trabaja como minero y recolecta recursos.
➜ *#daily • #diario*
> ✿ Reclama tu recompensa diaria.
➜ *#cofre*
> ✿ Reclama un cofre diario lleno de recursos.
➜ *#weekly • #semanal*
> ✿ Reclama tu regalo semanal.
➜ *#monthly • #mensual*
> ✿ Reclama tu recompensa mensual.
➜ *#aventura • #adventure*
> ✿ Aventúrate en un nuevo reino y recolecta recursos.
➜ *#cazar • #hunt • #berburu*
> ✿ Aventúrate en una caza de animales.
➜ *#mazmorra • #explorar*
> ✿ Explorar mazmorras para ganar ${moneda}.
➜ *#curar • #heal*
> ✿ Cura tu salud para volverte aventurar.
➜ *#inv • #inventario*
> ✿ Ver tu inventario con todos tus ítems.
➜ *#cf • #suerte*
> ✿ Apuesta tus ${moneda} a cara o cruz.
➜ *#ruleta • #roulette • #rt*
> ✿ Apuesta ${moneda} al color rojo o negro.
➜ *#casino • #apostar*
> ✿ Apuesta tus ${moneda} en el casino.
➜ *#slot*
> ✿ Apuesta tus ${moneda} en la ruleta y prueba tu suerte.
➜ *#steal • #robar • #rob*
> ✿ Intenta robarle ${moneda} a alguien.
➜ *#robarxp • #robxp*
> ✿ Intenta robar XP a un usuario.
➜ *#cartera • #wallet*
> ✿ Ver tus ${moneda} en la cartera.
➜ *#banco • #bank*
> ✿ Ver tus ${moneda} en el banco.
➜ *#deposit • #depositar • #d*
> ✿ Deposita tus ${moneda} al banco.
➜ *#with • #retirar • #withdraw*
> ✿ Retira tus ${moneda} del banco.
➜ *#transfer • #pay*
> ✿ Transfiere ${moneda} o XP a otros usuarios.
➜ *#buyall • #buy*
> ✿ Compra ${moneda} con tu XP.
➜ *#eboard • #baltop*
> ✿ Ver el ranking de usuarios con más ${moneda}.
➜ *#level • #lvl* + <@Mencion>
> ✿ Ver tu nivel y experiencia actual.
➜ *#lb • #lboard* + <Paginá>
> ✿ Top de usuarios con más (experiencia y nivel).
➜ *#halloween*
> ✿ Reclama tu dulce o truco (Solo en Halloween).
➜ *#christmas • #navidad*
> ✿ Reclama tu regalo navideño (Solo en Navidad).

✦⭒ GACHA ⭒✦
❣ Comandos de gacha para reclamar y colecciónar personajes.
➜ *#rollwaifu • #rw • #roll*
> ✿ Waifu o husbando aleatorio.
➜  *#claim • #c • #reclamar*
> ✿ Reclamar un personaje.
➜ *#harem • #waifus • #claims*
> ✿ Ver tus personajes reclamados.
➜ *#charimage • #waifuimage • #wimage*
> ✿ Ver una imagen aleatoria de un personaje.
➜ *#charinfo • #winfo • #waifuinfo*
> ✿ Ver información de un personaje.
➜ *#givechar • #givewaifu • #regalar*
> ✿ Regalar un personaje a otro usuario.
➜ *#vote • #votar*
> ✿ Votar por un personaje para subir su valor.
➜ *#waifusboard • #waifustop • #topwaifus*
> ✿ Ver el top de personajes con mayor valor.

✦⭒ DESCARGAS ⭒✦
❣ Comandos de descargas para varios archivos.
➜ *#tiktok • #tt*
> ✿ Descarga videos de TikTok.
➜ *#ttimg • #ttmp3* + <url>
> ✿ Descarga fotos/audios de tiktok.
➜ *#tiktokrandom • #ttrandom*
> ✿ Descarga un video aleatorio de tiktok.
➜ *#play • #play2*
> ✿ Descarga música/video de YouTube.
➜ *#ytmp3 • #ytmp4*
> ✿ Descarga música/video de YouTube mediante url.
➜ *#fb • #facebook*
> ✿ Descarga videos de Facebook.
➜ *#twitter • #x* + [Link]
> ✿ Descargar un video de Twitter/X
➜ *#ig • #instagram*
> ✿ Descarga contenido de Instagram.
➜ *#pinvid • #pinvideo* + [enlacé]
> ✿ Descargar vídeos de Pinterest.
➜ *#mediafire • #mf*
> ✿ Descargar un archivo de MediaFire.
➜ *#mega • #mg* + [enlacé]
> ✿ Descargar un archivo de MEGA.
➜ *#terabox • #tb* + [enlace]
> ✿ Descargar archivos por Terabox.
➜ *#gitclone* + <url>
> ✿ Descarga un repositorio de github.
➜ *#apk • #modapk*
> ✿ Descarga un apk de Aptoide.
➜ *#npmdl • #npmdownloader*
> ✿ Descarga paquetes de NPMJs.

✦⭒ BUSCADORES ⭒✦
❣ Comandos para realizar búsquedas en distintas plataformas.
➜ *#tiktoksearch • #tiktoks*
> ✿ Buscador de videos de tiktok.
➜ *#tweetposts*
> ✿ Buscador de posts de Twitter/X.
➜ *#ytsearch • #yts*
> ✿ Realiza búsquedas de Youtube.
➜ *#google*
> ✿ Realiza búsquedas por Google.
➜ *#pin • #pinterest*
> ✿ Buscador de imagenes de Pinterest.
➜ *#imagen • #image*
> ✿ buscador de imagenes de Google.
➜ *#githubsearch*
> ✿ Buscador de usuarios de GitHub.
➜ *#cuevana • #cuevanasearch*
> ✿ Buscador de películas/series por Cuevana.
➜ *#infoanime*
> ✿ Buscador de información de anime/manga.
➜ *#npmjs*
> ✿ Buscandor de npmjs.

✦⭒ NSFW ⭒✦
❣ Comandos NSFW (Contenido para adultos) - Úsalo bajo tu responsabilidad.
➜ *#anal* + <mencion>
> ✿ Hacer un anal
➜ *#bath* + <mencion>
> ✿ Bañarse
➜ *#blowjob • #mamada • #bj* + <mencion>
> ✿ Dar una mamada
➜ *#boobjob* + <mencion>
> ✿ Hacer una rusa
➜ *#cum* + <mencion>
> ✿ Venirse en alguien.
➜ *#fap* + <mencion>
> ✿ Hacerse una paja
➜ *#footjob* + <mencion>
> ✿ Hacer una paja con los pies
➜ *#fuck • #coger • #fuck2* + <mencion>
> ✿ Follarte a alguien
➜ *#violar • #perra* + <mencion>
> ✿ Viola a alguien
➜ *#grabboobs* + <mencion>
> ✿ Agarrrar tetas
➜ *#grop* + <mencion>
> ✿ Manosear a alguien
➜ *#lickpussy* + <mencion>
> ✿ Lamer un coño
➜ *#sixnine • #69* + <mencion>
> ✿ Haz un 69 con alguien
➜ *#spank • #nalgada* + <mencion>
> ✿ Dar una nalgada
➜ *#suckboobs* + <mencion>
> ✿ Chupar tetas
➜ *#undress • #encuerar* + <mencion>
> ✿ Desnudar a alguien
➜ *#yuri • #tijeras* + <mencion>
> ✿ Hacer tijeras.
➜ *#waifu*
> ✿ Buscá una waifu aleatorio.
➜ *#ppcouple • #ppcp*
> ✿ Genera imagenes para amistades o parejas.
➜ *#hentaisearch • #searchhentai*
> ✿ Buscador de capítulos hentai.
➜ #xnxxsearch • #xnxxs*
> ✿ Buscador de vídeos de Xnxx.
➜ *#xvsearch • #xvideossearch*
> ✿ Buscador de vídeos de Xvideos.
➜ *#pornhubsearch • #phsearch*
> ✿ Buscador de videos de Pornhub.
➜ *#rule34 • #r34* + [Tags]
> ✿ Buscar imagenes en Rule34
➜ *#xvideosdl*
> ✿ Descarga videos porno de (Xvideos).
➜ *#xnxxdl*
> ✿ Descarga videos porno de (xnxx).

✦⭒ STICKERS ⭒✦
❣ Comandos para creaciones de stickers etc.
➜ *#sticker • #s*
> ✿ Crea stickers de (imagen/video)
➜ *#toimg • #img*
> ✿ Convierte stickers en imagen.
➜ *#setmeta*
> ✿ Estable un pack y autor para los stickers.
➜ *#delmeta*
> ✿ Elimina tu pack de stickers.
➜ *#pfp • #getpic*
> ✿ Obtén la foto de perfil de un usuario.
➜ *#qc*
> ✿ Crea stickers con texto o de un usuario.
➜ *#brat • #ttp • #attp*︎
> ✿ Crea stickers con texto.
➜ *#emojimix*
> ✿ Fuciona 2 emojis para crear un sticker.
➜ *#wm*
> ✿ Cambia el nombre de los stickers.

✦⭒ HERRAMIENTAS ⭒✦
❣ Comandos de herramientas con muchas funciones.
➜ *#calcular • #calcular • #cal*
> ✿ Calcular todo tipo de ecuaciones.
➜ *#translate • #traducir • #trad*
> ✿ Traduce palabras en otros idiomas.
➜ *#tiempo • #clima*
> ✿ Ver el clima de un pais.
➜ *#horario*
> ✿ Ver el horario global de los países.
➜ *#ss • #ssweb*
> ✿ Ver el estado de una página web.
➜ *#whatmusic • #shazam*
> ✿ Descubre el nombre de canciones o vídeos.
➜ *#enhance • #remini • #hd*
> ✿ Mejora la calidad de una imagen.
➜ *#length • #tamaño*
> ✿ Cambia el tamaño de imágenes y vídeos.
➜ *#letra*
> ✿ Cambia la fuente de las letras.
➜ *#say • #decir* + [texto]
> ✿ Repetir un mensaje.
➜ *#fake • #fakereply*
> ✿ Crea un mensaje falso de un usuario.
➜ *#read • #readviewonce • #ver*
> ✿ Ver imágenes de una sola vista.
➜ *#todoc • #toducument*
> ✿ Crea documentos de (audio, imágenes y vídeos).

✦⭒ GRUPOS ⭒✦
❣ Comandos de grupos para una mejor gestión de ellos.
➜ *#gp • #infogrupo*
> ✿  Ver la Informacion del grupo.
➜ *#link*
> ✿ El bot envia el link del grupo.
➜ *#restablecer • #revoke*
> ✿ Restablecer el enlace del grupo.
➜ *#grupo • #group* [open / abrir]
> ✿ Cambia ajustes del grupo para que todos los usuarios envien mensaje.
➜ *#grupo • #gruop* [close / cerrar]
> ✿ Cambia ajustes del grupo para que solo los administradores envien mensaje.
➜ *#gpbanner • #groupimg*
> ✿ Cambiar la imagen del grupo.
➜ *#gpname • #groupname*
> ✿ Cambiar el nombre del grupo.
➜ *#gpdesc • #groupdesc*
> ✿ Cambiar la descripción del grupo.
➜ *admins • admin*
> ✿ Mencionar a los admins para solicitar ayuda.
➜ *#hidetag*
> ✿ Envia un mensaje mencionando a todos los usuarios
➜ *#invocar • #tagall • #todos*
> ✿ Invoca a todos los usuarios de un grupo.
➜ *#linea • #listonline*
> ✿ Ver la lista de los usuarios en linea.
➜ *#fantasmas*
> ✿ Ver lista de inactivos del grupo.
➜ *#kickfantasmas*
> ✿ Elimina a los inactivos del grupo.
➜ *#kick* [número / mension]
> ✿ Elimina un usuario de un grupo.
➜ *#add • #añadir • #agregar* [número]
> ✿ Invita a un usuario a tu grupo.
➜ *#promote* [mension / etiquetar]
> ✿ El bot dara administrador al usuario mencionando.
➜ *#demote* [mension / etiquetar]
> ✿ El bot quitara administrador al usuario mencionando.
➜ *#advertir • #warn • #warning*
> ✿ Darle una advertencia aún usuario.
➜ ︎*#unwarn • #delwarn*
> ✿ Quitar advertencias.
➜ *#advlist • #listadv*
> ✿ Ver lista de usuarios advertidos.
➜ *#setwelcome*
> ✿ Establecer un mensaje de bienvenida personalizado.
➜ *#setbye*
> ✿ Establecer un mensaje de despedida personalizado.
➜ *#setemoji • #setemo*
> ✿ Cambia el emoji que se usa en la invitación de usuarios.
➜ *#listnum • #kicknum*
> ✿ Elimine a usuario por el prefijo de país.
➜ *#bot on*
> ✿ Enciende el bot en un grupo.
> ✿ Apaga el bot en un grupo.
➜ *#mute* [mension / etiquetar]
> ✿ El bot elimina los mensajes del usuario.
➜ *#unmute* [mension / etiquetar]
> ✿ El bot deja de eliminar los mensajes del usuario.
➜ *#delete • #del*
> ✿ Elimina mensaje de otros usuarios.
➜ *#encuesta • #poll*
> ✿ Crea una encuesta.

✦⭒ JUEGOS ⭒✦
❣ Comandos de juegos para jugar con tus amigos.
➜ *#amistad • #amigorandom*
> ✿ hacer amigos con un juego.
➜ *#formarpareja*
> ✿ Forma una pareja.
➜ *#formarpareja5*
> ✿ Forma 5 parejas diferentes.
➜ *#ship • #pareja*
> ✿ La bot te da la probabilidad de enamorarte de una persona.
➜ *#formartrio* + <mencion>
> ✿ Forma un trio.
➜ *#pvp • #suit* + <mencion>
> ✿ Juega un pvp contra otro usuario.
➜ *#ttt*
> ✿ Crea una sala de juego.\n> ✧･ﾟ: *Michi* by Wirk ･ﾟ✧
➜ *#ahorcado*
> ✿ Diviertete con la bot jugando el juego ahorcado.
➜ *#mates • #matematicas*
> ✿ Responde las preguntas de matemáticas para ganar recompensas.
➜ *#ppt*
> ✿ Juega piedra papel o tijeras con la bot.
➜ *#sopa • #buscarpalabra*
> ✿ Juega el famoso juego de sopa de letras.
➜ *#chiste*
> ✿ La bot te cuenta un chiste.
➜ *#consejo*
> ✿ La bot te da un consejo.
➜ *#facto*
> ✿ La bot te lanza un facto.
➜ *#frase*
> ✿ La bot te da una frase.
➜ *#meme*
> ✿ La bot te envía un meme aleatorio.
➜ *#morse*
> ✿ Convierte un texto a codigo morse.
➜ *#nombreninja*
> ✿ Busca un nombre ninja aleatorio.
➜ *#personalidad* + <mencion>
> ✿ La bot busca tu personalidad.
➜ *#piropo*
> ✿ Lanza un piropo.
➜ *#pregunta*
> ✿ Hazle una pregunta a la bot.
➜ *#sorteo*
> ✿ Empieza un sorteo.
➜ *#top*
> ✿ Empieza un top de personas.
➜ *#doxeo • #doxear* + <mencion>
> ✿ Simular un doxeo falso.
➜ *#chaqueta • #jalamela*
> ✿ Hacerte una chaqueta.
➜ *#huevo*
> ✿ Agarrale el huevo a alguien.
➜ *#chupalo* + <mencion>
> ✿ Hacer que un usuario te la chupe.
➜ *#aplauso* + <mencion>
> ✿ Aplaudirle a alguien.
➜ *#marron* + <mencion>
> ✿ Burlarte del color de piel de un usuario.
➜ *#suicidar*
> ✿ Suicidate.
➜ *#iq • #iqtest* + <mencion>
> ✿ Calcular el iq de alguna persona.
➜ *#paja • #pajeame*
> ✿ La bot te hace una paja.


✦⭒ ANIME Y REACCIONES ⭒✦
❣ Comandos de reacciones de anime.
➜ *#angry • #enojado* + <mencion>
> ✿ Estar enojado
➜ *#bite* + <mencion>
> ✿ Muerde a alguien
➜ *#bleh* + <mencion>
> ✿ Sacar la lengua
➜ *#blush* + <mencion>
> ✿ Sonrojarte
➜ *#bored • #aburrido* + <mencion>
> ✿ Estar aburrido
➜ *#cry* + <mencion>
> ✿ Llorar por algo o alguien
➜ *#cuddle* + <mencion>
> ✿ Acurrucarse
➜ *#dance* + <mencion>
> ✿ Sacate los pasitos prohíbidos
➜ *#drunk* + <mencion>
> ✿ Estar borracho
➜ *#eat • #comer* + <mencion>
> ✿ Comer algo delicioso
➜ *#facepalm* + <mencion>
> ✿ Darte una palmada en la cara
➜ *#happy • #feliz* + <mencion>
> ✿ Salta de felicidad
➜ *#hug* + <mencion>
> ✿ Dar un abrazo
➜ *#impregnate • #preg* + <mencion>
> ✿ Embarazar a alguien
➜ *#kill* + <mencion>
> ✿ Toma tu arma y mata a alguien
➜ *#kiss • #besar* • #kiss2 + <mencion>
> ✿ Dar un beso
➜ *#laugh* + <mencion>
> ✿ Reírte de algo o alguien
➜ *#lick* + <mencion>
> ✿ Lamer a alguien
➜ *#love • #amor* + <mencion>
> ✿ Sentirse enamorado
➜ *#pat* + <mencion>
> ✿ Acaricia a alguien
➜ *#poke* + <mencion>
> ✿ Picar a alguien
➜ *#pout* + <mencion>
> ✿ Hacer pucheros
➜ *#punch* + <mencion>
> ✿ Dar un puñetazo
➜ *#run* + <mencion>
> ✿ Correr
➜ *#sad • #triste* + <mencion>
> ✿ Expresar tristeza
➜ *#scared* + <mencion>
> ✿ Estar asustado
➜ *#seduce* + <mencion>
> ✿ Seducir a alguien
➜ *#shy • #timido* + <mencion>
> ✿ Sentir timidez
➜ *#slap* + <mencion>
> ✿ Dar una bofetada
➜ *#dias • #days*
> ✿ Darle los buenos días a alguien
➜ *#noches • #nights*
> ✿ Darle las buenas noches a alguien
➜ *#sleep* + <mencion>
> ✿ Tumbarte a dormir
➜ *#smoke* + <mencion>
> ✿ Fumar
➜ *#think* + <mencion>
> ✿ Pensar en algo
➜ *#marry* [mension / etiquetar]
> ✿ Propón matrimonio a otro usuario.
➜ *#divorce*
> ✿ Divorciarte de tu pareja.
➜ *#cafe • #coffe*
> ✿ Tomate un cafecito con alguien.
  `.trim()

    await conn.sendMessage(m.chat, {
        image: Buffer.from(banner, 'base64'),
        caption: txt,
        mentions: [m.sender, userId] // Include mentions directly in the message options
    }); // Removed contextInfo and the quoted message option

handler.help = ['menu']
handler.tags = ['main']
handler.command = ['menu', 'menú', 'help']

// Changed export default handler to module.exports
module.exports = handler

function clockString(ms) {
    let seconds = Math.floor((ms / 1000) % 60)
    let minutes = Math.floor((ms / (1000 * 60)) % 60)
    let hours = Math.floor((ms / (1000 * 60 * 60)) % 24)
    return `${hours}h ${minutes}m ${seconds}s`
}
