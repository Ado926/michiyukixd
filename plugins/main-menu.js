let handler = async (m, { conn, args }) => {
    let userId = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.sender
    let user = global.db.data.users[userId]
    let name = conn.getName(userId)
    let _uptime = process.uptime() * 1000
    let uptime = clockString(_uptime)
    let totalreg = Object.keys(global.db.data.users).length
    let totalCommands = Object.values(global.plugins).filter((v) => v.help && v.tags).length
    // Assuming 'moneda' and 'botname' are defined globally or passed in 'conn' or 'global'
    let moneda = global.moneda || 'Moneda'; // Default if not defined
    let botname = global.botname || 'TuBot'; // Default if not defined

    let txt = `> *・°☆・°・°☆・°・*☆・°・*
> Hola @${userId.split('@')[0]}!, Bienvenido!
> *・°☆・°・°☆・°・*☆・°・*
> Bot: *${(conn.user.jid == global.conn.user.jid ? 'Principal 🅥' : 'Sub Bot 🅑')}*
> Moneda: *${moneda}*
> Activada: *${uptime}*
> Usuarios: *${totalreg}*
> Comandos: *${totalCommands}*
> *・°☆・°・°☆・°・*☆・°・*
>
> > 🌳 Puedes tener tu *Sub Bot* usa *#code* o *#qr* para vincular.
>
> ⧠⭔ *INFO BOT* ⭔⧠
> ❢ Comandos para ver estado e información de la Bot.
> 𖹭𖹭 *#help • #menu*
> > ✿ Ver la lista de comandos de la Bot.
> 𖹭𖹭 *#uptime • #runtime*
> > ✿ Ver tiempo activo o en linea de la Bot
> 𖹭𖹭 *#status • #estado*
> > ✿ Ver el estado actual de la Bot.
> 𖹭𖹭 *#infobot • #infobot*
> > ✿ Ver la información completa de la Bot.
> 𖹭𖹭 *#p • #ping*
> > ✿ Ver la velocidad de respuesta del Bot.
> 𖹭𖹭 *#sistema • #system*
> > ✿ Ver estado del sistema de alojamiento.
> 𖹭𖹭 *#speed • #speedtest*
> > ✿ Ver las estadísticas de velocidad de la Bot.
> 𖹭𖹭 *#views • #usuarios*
> > ✿ Ver la cantidad de usuarios registrados en el sistema.
> 𖹭𖹭 *#funciones • #totalfunciones*
> > ✿ Ver todas las funciones de la Bot.
> 𖹭𖹭 *#ds • #fixmsgespera*
> > ✿ Eliminar archivos de sesión innecesarios.
> 𖹭𖹭 *#editautoresponder*
> > ✿ Configurar un Prompt personalizado de la Bot.
> 𖹭𖹭 *#creador*
> > ✿ Contacto del creador de la Bot.
> 𖹭𖹭 *#links • #grupos*
> > ✿ Ver los enlaces oficiales de la Bot.
> 𖹭𖹭 *#sug • #newcommand*
> > ✿ Sugiere un nuevo comando.
> 𖹭𖹭 *#reporte • #reportar*
> > ✿ Reporta alguna falla o problema de la Bot.
>
> ⧠⭔ *𝐒𝐮𝐛𝐛𝐨𝐭𝐬* ⭔⧠
> ❢ Comandos para gestionar Sub-Bots.
> 𖹭𖹭 *#serbot • #serbot code*
> > ✿ Crea una sesión de Sub-Bot.
> 𖹭𖹭 *#bots • #sockets*
> > ✿ Ver la lista de Sub-Bots activos.
>
> ⧠⭔ *𝐏𝐞𝐫𝐟𝐢𝐥* ⭔⧠
> ❣ Comandos de perfil para ver, configurar y comprobar estados de tu perfil.
> 𖹭𖹭 *#reg • #verificar • #register*
> > ✿ Registra tu nombre y edad en el bot.
> 𖹭𖹭 *#unreg*
> > ✿ Elimina tu registro del bot.
> 𖹭𖹭 *#profile*
> > ✿ Muestra tu perfil de usuario.
> 𖹭𖹭 *#setgenre • #setgenero*
> > ✿ Establece tu género en el perfil del bot.
> 𖹭𖹭 *#delgenre • #delgenero*
> > ✿ Elimina tu género del perfil del bot.
> 𖹭𖹭 *#setbirth • #setnacimiento*
> > ✿ Establece tu fecha de nacimiento en el perfil del bot.
> 𖹭𖹭 *#delbirth • #delnacimiento*
> > ✿ Elimina la fecha de nacimiento del perfil del bot.
> 𖹭𖹭 *#setdescription • #setdesc*
> > ✿ Establece una descripción en tu perfil del bot.
> 𖹭𖹭 *#deldescription • #deldesc*
> > ✿ Elimina la descripción de tu perfil del bot.
> 𖹭𖹭 *#comprarpremium • #premium*
> > ✿ Compra un pase premium para usar el bot sin límites.
> 𖹭𖹭 *#confesiones • #confesar*
> > ✿ Confiesa tus sentimientos a alguien de manera anonima.
>
> ⧠⭔ *𝐄𝐜𝐨𝐧𝐨𝐦𝐢́𝐚 𝐲 𝐑𝐏𝐆* ⭔⧠
> ❣ Comandos de economía y rpg para ganar dinero y otros recursos.
> 𖹭𖹭 *#w • #work • #trabajar*
> > ✿ Trabaja para ganar ${moneda}.
> 𖹭𖹭 *#slut • #protituirse*
> > ✿ Trabaja como prostituta y gana ${moneda}.
> 𖹭𖹭 *#crime • #crimen*
> > ✿ Trabaja como ladrón para ganar ${moneda}.
> 𖹭𖹭 *#miming • #minar • #mine*
> > ✿ Trabaja como minero y recolecta recursos.
> 𖹭𖹭 *#daily • #diario*
> > ✿ Reclama tu recompensa diaria.
> 𖹭𖹭 *#cofre*
> > ✿ Reclama un cofre diario lleno de recursos.
> 𖹭𖹭 *#weekly • #semanal*
> > ✿ Reclama tu regalo semanal.
> 𖹭𖹭 *#monthly • #mensual*
> > ✿ Reclama tu recompensa mensual.
> 𖹭𖹭 *#aventura • #adventure*
> > ✿ Aventúrate en un nuevo reino y recolecta recursos.
> 𖹭𖹭 *#cazar • #hunt • #berburu*
> > ✿ Aventúrate en una caza de animales.
> 𖹭𖹭 *#mazmorra • #explorar*
> > ✿ Explorar mazmorras para ganar ${moneda}.
> 𖹭𖹭 *#curar • #heal*
> > ✿ Cura tu salud para volverte aventurar.
> 𖹭𖹭 *#inv • #inventario*
> > ✿ Ver tu inventario con todos tus ítems.
> 𖹭𖹭 *#cf • #suerte*
> > ✿ Apuesta tus ${moneda} a cara o cruz.
> 𖹭𖹭 *#ruleta • #roulette • #rt*
> > ✿ Apuesta ${moneda} al color rojo o negro.
> 𖹭𖹭 *#casino • #apostar*
> > ✿ Apuesta tus ${moneda} en el casino.
> 𖹭𖹭 *#slot*
> > ✿ Apuesta tus ${moneda} en la ruleta y prueba tu suerte.
> 𖹭𖹭 *#steal • #robar • #rob*
> > ✿ Intenta robarle ${moneda} a alguien.
> 𖹭𖹭 *#robarxp • #robxp*
> > ✿ Intenta robar XP a un usuario.
> 𖹭𖹭 *#cartera • #wallet*
> > ✿ Ver tus ${moneda} en la cartera.
> 𖹭𖹭 *#banco • #bank*
> > ✿ Ver tus ${moneda} en el banco.
> 𖹭𖹭 *#deposit • #depositar • #d*
> > ✿ Deposita tus ${moneda} al banco.
> 𖹭𖹭 *#with • #retirar • #withdraw*
> > ✿ Retira tus ${moneda} del banco.
> 𖹭𖹭 *#transfer • #pay*
> > ✿ Transfiere ${moneda} o XP a otros usuarios.
> 𖹭𖹭 *#buyall • #buy*
> > ✿ Compra ${moneda} con tu XP.
> 𖹭𖹭 *#eboard • #baltop*
> > ✿ Ver el ranking de usuarios con más ${moneda}.
> 𖹭𖹭 *#level • #lvl* + <@Mencion>
> > ✿ Ver tu nivel y experiencia actual.
> 𖹭𖹭 *#lb • #lboard* + <Paginá>
> > ✿ Top de usuarios con más (experiencia y nivel).
> 𖹭𖹭 *#halloween*
> > ✿ Reclama tu dulce o truco (Solo en Halloween).
> 𖹭𖹭 *#christmas • #navidad*
> > ✿ Reclama tu regalo navideño (Solo en Navidad).
>
> ⧠⭔ *𝐆𝐚𝐜𝐡𝐚* ⭔⧠
> ❣ Comandos de gacha para reclamar y colecciónar personajes.
> 𖹭𖹭 *#rollwaifu • #rw • #roll*
> > ✿ Waifu o husbando aleatorio.
> 𖹭𖹭  *#claim • #c • #reclamar*
> > ✿ Reclamar un personaje.
> 𖹭𖹭 *#harem • #waifus • #claims*
> > ✿ Ver tus personajes reclamados.
> 𖹭𖹭 *#charimage • #waifuimage • #wimage*
> > ✿ Ver una imagen aleatoria de un personaje.
> 𖹭𖹭 *#charinfo • #winfo • #waifuinfo*
> > ✿ Ver información de un personaje.
> 𖹭𖹭 *#givechar • #givewaifu • #regalar*
> > ✿ Regalar un personaje a otro usuario.
> 𖹭𖹭 *#vote • #votar*
> > ✿ Votar por un personaje para subir su valor.
> 𖹭𖹭 *#waifusboard • #waifustop • #topwaifus*
> > ✿ Ver el top de personajes con mayor valor.
>
> ⧠⭔ *𝐃𝐞𝐬𝐜𝐚𝐫𝐠𝐚𝐬* ⭔⧠
> ❣ Comandos de descargas para varios archivos.
> 𖹭𖹭 *#tiktok • #tt*
> > ✿ Descarga videos de TikTok.
> 𖹭𖹭 *#ttimg • #ttmp3* + <url>
> > ✿ Descarga fotos/audios de tiktok.
> 𖹭𖹭 *#tiktokrandom • #ttrandom*
> > ✿ Descarga un video aleatorio de tiktok.
> 𖹭𖹭 *#play • #play2*
> > ✿ Descarga música/video de YouTube.
> 𖹭𖹭 *#ytmp3 • #ytmp4*
> > ✿ Descarga música/video de YouTube mediante url.
> 𖹭𖹭 *#fb • #facebook*
> > ✿ Descarga videos de Facebook.
> 𖹭𖹭 *#twitter • #x* + [Link]
> > ✿ Descargar un video de Twitter/X
> 𖹭𖹭 *#ig • #instagram*
> > ✿ Descarga contenido de Instagram.
> 𖹭𖹭 *#pinvid • #pinvideo* + [enlacé]
> > ✿ Descargar vídeos de Pinterest.
> 𖹭𖹭 *#mediafire • #mf*
> > ✿ Descargar un archivo de MediaFire.
> 𖹭𖹭 *#mega • #mg* + [enlacé]
> > ✿ Descargar un archivo de MEGA.
> 𖹭𖹭 *#terabox • #tb* + [enlace]
> > ✿ Descargar archivos por Terabox.
> 𖹭𖹭 *#gitclone* + <url>
> > ✿ Descarga un repositorio de github.
> 𖹭𖹭 *#apk • #modapk*
> > ✿ Descarga un apk de Aptoide.
> 𖹭𖹭 *#npmdl • #npmdownloader*
> > ✿ Descarga paquetes de NPMJs.
>
> ⧠⭔ *𝐁𝐮𝐬𝐜𝐚𝐝𝐨𝐫𝐞𝐬* ⭔⧠
> ❣ Comandos para realizar búsquedas en distintas plataformas.
> 𖹭𖹭 *#tiktoksearch • #tiktoks*
> > ✿ Buscador de videos de tiktok.
> 𖹭𖹭 *#tweetposts*
> > ✿ Buscador de posts de Twitter/X.
> 𖹭𖹭 *#ytsearch • #yts*
> > ✿ Realiza búsquedas de Youtube.
> 𖹭𖹭 *#google*
> > ✿ Realiza búsquedas por Google.
> 𖹭𖹭 *#pin • #pinterest*
> > ✿ Buscador de imagenes de Pinterest.
> 𖹭𖹭 *#imagen • #image*
> > ✿ buscador de imagenes de Google.
> 𖹭𖹭 *#githubsearch*
> > ✿ Buscador de usuarios de GitHub.
> 𖹭𖹭 *#cuevana • #cuevanasearch*
> > ✿ Buscador de películas/series por Cuevana.
> 𖹭𖹭 *#infoanime*
> > ✿ Buscador de información de anime/manga.
> 𖹭𖹭 *#npmjs*
> > ✿ Buscandor de npmjs.
>
> ⧠⭔ *𝐍𝐒𝐅𝐖* ⭔⧠
> ❣ Comandos NSFW (Contenido para adultos) - Úsalo bajo tu responsabilidad.
> 𖹭𖹭 *#anal* + <mencion>
> > ✿ Hacer un anal
> 𖹭𖹭 *#bath* + <mencion>
> > ✿ Bañarse
> 𖹭𖹭 *#blowjob • #mamada • #bj* + <mencion>
> > ✿ Dar una mamada
> 𖹭𖹭 *#boobjob* + <mencion>
> > ✿ Hacer una rusa
> 𖹭𖹭 *#cum* + <mencion>
> > ✿ Venirse en alguien.
> 𖹭𖹭 *#fap* + <mencion>
> > ✿ Hacerse una paja
> 𖹭𖹭 *#footjob* + <mencion>
> > ✿ Hacer una paja con los pies
> 𖹭𖹭 *#fuck • #coger • #fuck2* + <mencion>
> > ✿ Follarte a alguien
> 𖹭𖹭 *#violar • #perra* + <mencion>
> > ✿ Viola a alguien
> 𖹭𖹭 *#grabboobs* + <mencion>
> > ✿ Agarrrar tetas
> 𖹭𖹭 *#grop* + <mencion>
> > ✿ Manosear a alguien
> 𖹭𖹭 *#lickpussy* + <mencion>
> > ✿ Lamer un coño
> 𖹭𖹭 *#sixnine • #69* + <mencion>
> > ✿ Haz un 69 con alguien
> 𖹭𖹭 *#spank • #nalgada* + <mencion>
> > ✿ Dar una nalgada
> 𖹭𖹭 *#suckboobs* + <mencion>
> > ✿ Chupar tetas
> 𖹭𖹭 *#undress • #encuerar* + <mencion>
> > ✿ Desnudar a alguien
> 𖹭𖹭 *#yuri • #tijeras* + <mencion>
> > ✿ Hacer tijeras.
> 𖹭𖹭 *#waifu*
> > ✿ Buscá una waifu aleatorio.
> 𖹭𖹭 *#ppcouple • #ppcp*
> > ✿ Genera imagenes para amistades o parejas.
> 𖹭𖹭 *#hentaisearch • #searchhentai*
> > ✿ Buscador de capítulos hentai.
> 𖹭𖹭 #xnxxsearch • #xnxxs*
> > ✿ Buscador de vídeos de Xnxx.
> 𖹭𖹭 *#xvsearch • #xvideossearch*
> > ✿ Buscador de vídeos de Xvideos.
> 𖹭𖹭 *#pornhubsearch • #phsearch*
> > ✿ Buscador de videos de Pornhub.
> 𖹭𖹭 *#rule34 • #r34* + [Tags]
> > ✿ Buscar imagenes en Rule34
> 𖹭𖹭 *#xvideosdl*
> > ✿ Descarga videos porno de (Xvideos).
> 𖹭𖹭 *#xnxxdl*
> > ✿ Descarga videos porno de (xnxx).
>
> ⧠⭔ *𝐒𝐭𝐢𝐜𝐤𝐞𝐫𝐬* ⭔⧠
> ❣ Comandos para creaciones de stickers etc.
> 𖹭𖹭 *#sticker • #s*
> > ✿ Crea stickers de (imagen/video)
> 𖹭𖹭 *#toimg • #img*
> > ✿ Convierte stickers en imagen.
> 𖹭𖹭 *#setmeta*
> > ✿ Estable un pack y autor para los stickers.
> 𖹭𖹭 *#delmeta*
> > ✿ Elimina tu pack de stickers.
> 𖹭𖹭 *#pfp • #getpic*
> > ✿ Obtén la foto de perfil de un usuario.
> 𖹭𖹭 *#qc*
> > ✿ Crea stickers con texto o de un usuario.
> 𖹭𖹭 *#brat • #ttp • #attp*︎
> > ✿ Crea stickers con texto.
> 𖹭𖹭 *#emojimix*
> > ✿ Fuciona 2 emojis para crear un sticker.
> 𖹭𖹭 *#wm*
> > ✿ Cambia el nombre de los stickers.
>
> ⧠⭔ *𝐇𝐞𝐫𝐫𝐚𝐦𝐢𝐞𝐧𝐭𝐚𝐬* ⭔⧠
> ❣ Comandos de herramientas con muchas funciones.
> 𖹭𖹭 *#calcular • #calcular • #cal*
> > ✿ Calcular todo tipo de ecuaciones.
> 𖹭𖹭 *#translate • #traducir • #trad*
> > ✿ Traduce palabras en otros idiomas.
> 𖹭𖹭 *#tiempo • #clima*
> > ✿ Ver el clima de un pais.
> 𖹭𖹭 *#horario*
> > ✿ Ver el horario global de los países.
> 𖹭𖹭 *#ss • #ssweb*
> > ✿ Ver el estado de una página web.
> 𖹭𖹭 *#whatmusic • #shazam*
> > ✿ Descubre el nombre de canciones o vídeos.
> 𖹭𖹭 *#enhance • #remini • #hd*
> > ✿ Mejora la calidad de una imagen.
> 𖹭𖹭 *#length • #tamaño*
> > ✿ Cambia el tamaño de imágenes y vídeos.
> 𖹭𖹭 *#letra*
> > ✿ Cambia la fuente de las letras.
> 𖹭𖹭 *#say • #decir* + [texto]
> > ✿ Repetir un mensaje.
> 𖹭𖹭 *#fake • #fakereply*
> > ✿ Crea un mensaje falso de un usuario.
> 𖹭𖹭 *#read • #readviewonce • #ver*
> > ✿ Ver imágenes de una sola vista.
> 𖹭𖹭 *#todoc • #toducument*
> > ✿ Crea documentos de (audio, imágenes y vídeos).
>
> ⧠⭔ *𝐆𝐫𝐮𝐩𝐨𝐬* ⭔⧠
> ❣ Comandos de grupos para una mejor gestión de ellos.
> 𖹭𖹭 *#gp • #infogrupo*
> > ✿  Ver la Informacion del grupo.
> 𖹭𖹭 *#link*
> > ✿ El bot envia el link del grupo.
> 𖹭𖹭 *#restablecer • #revoke*
> > ✿ Restablecer el enlace del grupo.
> 𖹭𖹭 *#grupo • #group* [open / abrir]
> > ✿ Cambia ajustes del grupo para que todos los usuarios envien mensaje.
> 𖹭𖹭 *#grupo • #gruop* [close / cerrar]
> > ✿ Cambia ajustes del grupo para que solo los administradores envien mensaje.
> 𖹭𖹭 *#gpbanner • #groupimg*
> > ✿ Cambiar la imagen del grupo.
> 𖹭𖹭 *#gpname • #groupname*
> > ✿ Cambiar el nombre del grupo.
> 𖹭𖹭 *#gpdesc • #groupdesc*
> > ✿ Cambiar la descripción del grupo.
> 𖹭𖹭 *admins • admin*
> > ✿ Mencionar a los admins para solicitar ayuda.
> 𖹭𖹭 *#hidetag*
> > ✿ Envia un mensaje mencionando a todos los usuarios
> 𖹭𖹭 *#invocar • #tagall • #todos*
> > ✿ Invoca a todos los usuarios de un grupo.
> 𖹭𖹭 *#linea • #listonline*
> > ✿ Ver la lista de los usuarios en linea.
> 𖹭𖹭 *#fantasmas*
> > ✿ Ver lista de inactivos del grupo.
> 𖹭𖹭 *#kickfantasmas*
> > ✿ Elimina a los inactivos del grupo.
> 𖹭𖹭 *#kick* [número / mension]
> > ✿ Elimina un usuario de un grupo.
> 𖹭𖹭 *#add • #añadir • #agregar* [número]
> > ✿ Invita a un usuario a tu grupo.
> 𖹭𖹭 *#promote* [mension / etiquetar]
> > ✿ El bot dara administrador al usuario mencionando.
> 𖹭𖹭 *#demote* [mension / etiquetar]
> > ✿ El bot quitara administrador al usuario mencionando.
> 𖹭𖹭 *#advertir • #warn • #warning*
> > ✿ Darle una advertencia aún usuario.
> 𖹭𖹭 ︎*#unwarn • #delwarn*
> > ✿ Quitar advertencias.
> 𖹭𖹭 *#advlist • #listadv*
> > ✿ Ver lista de usuarios advertidos.
> 𖹭𖹭 *#setwelcome*
> > ✿ Establecer un mensaje de bienvenida personalizado.
> 𖹭𖹭 *#setbye*
> > ✿ Establecer un mensaje de despedida personalizado.
> 𖹭𖹭 *#setemoji • #setemo*
> > ✿ Cambia el emoji que se usa en la invitación de usuarios.
> 𖹭𖹭 *#listnum • #kicknum*
> > ✿ Elimine a usuario por el prefijo de país.
> 𖹭𖹭 *#bot on*
> > ✿ Enciende el bot en un grupo.
> > ✿ Apaga el bot en un grupo.
> 𖹭𖹭 *#mute* [mension / etiquetar]
> > ✿ El bot elimina los mensajes del usuario.
> 𖹭𖹭 *#unmute* [mension / etiquetar]
> > ✿ El bot deja de eliminar los mensajes del usuario.
> 𖹭𖹭 *#delete • #del*
> > ✿ Elimina mensaje de otros usuarios.
> 𖹭𖹭 *#encuesta • #poll*
> > ✿ Crea una encuesta.
>
> ⧠⭔ *𝐉𝐮𝐞𝐠𝐨𝐬* ⭔⧠
> ❣ Comandos de juegos para jugar con tus amigos.
> 𖹭𖹭 *#amistad • #amigorandom*
> > ✿ hacer amigos con un juego.
> 𖹭𖹭 *#formarpareja*
> > ✿ Forma una pareja.
> 𖹭𖹭 *#formarpareja5*
> > ✿ Forma 5 parejas diferentes.
> 𖹭𖹭 *#ship • #pareja*
> > ✿ La bot te da la probabilidad de enamorarte de una persona.
> 𖹭𖹭 *#formartrio* + <mencion>
> > ✿ Forma un trio.
> 𖹭𖹭 *#pvp • #suit* + <mencion>
> > ✿ Juega un pvp contra otro usuario.
> 𖹭𖹭 *#ttt*
> > ✿ Crea una sala de juego.
> > ✧･ﾟ: *Michi* by Wirk ･ﾟ✧
> 𖹭𖹭 *#ahorcado*
> > ✿ Diviertete con la bot jugando el juego ahorcado.
> 𖹭𖹭 *#mates • #matematicas*
> > ✿ Responde las preguntas de matemáticas para ganar recompensas.
> 𖹭𖹭 *#ppt*
> > ✿ Juega piedra papel o tijeras con la bot.
> 𖹭𖹭 *#sopa • #buscarpalabra*
> > ✿ Juega el famoso juego de sopa de letras.
> 𖹭𖹭 *#chiste*
> > ✿ La bot te cuenta un chiste.
> 𖹭𖹭 *#consejo*
> > ✿ La bot te da un consejo.
> 𖹭𖹭 *#facto*
> > ✿ La bot te lanza un facto.
> 𖹭𖹭 *#frase*
> > ✿ La bot te da una frase.
> 𖹭𖹭 *#meme*
> > ✿ La bot te envía un meme aleatorio.
> 𖹭𖹭 *#morse*
> > ✿ Convierte un texto a codigo morse.
> 𖹭𖹭 *#nombreninja*
> > ✿ Busca un nombre ninja aleatorio.
> 𖹭𖹭 *#personalidad* + <mencion>
> > ✿ La bot busca tu personalidad.
> 𖹭𖹭 *#piropo*
> > ✿ Lanza un piropo.
> 𖹭𖹭 *#pregunta*
> > ✿ Hazle una pregunta a la bot.
> 𖹭𖹭 *#sorteo*
> > ✿ Empieza un sorteo.
> 𖹭𖹭 *#top*
> > ✿ Empieza un top de personas.
> 𖹭𖹭 *#doxeo • #doxear* + <mencion>
> > ✿ Simular un doxeo falso.
> 𖹭𖹭 *#chaqueta • #jalamela*
> > ✿ Hacerte una chaqueta.
> 𖹭𖹭 *#huevo*
> > ✿ Agarrale el huevo a alguien.
> 𖹭𖹭 *#chupalo* + <mencion>
> > ✿ Hacer que un usuario te la chupe.
> 𖹭𖹭 *#aplauso* + <mencion>
> > ✿ Aplaudirle a alguien.
> 𖹭𖹭 *#marron* + <mencion>
> > ✿ Burlarte del color de piel de un usuario.
> 𖹭𖹭 *#suicidar*
> > ✿ Suicidate.
> 𖹭𖹭 *#iq • #iqtest* + <mencion>
> > ✿ Calcular el iq de alguna persona.
> 𖹭𖹭 *#paja • #pajeame*
> > ✿ La bot te hace una paja.
>
>
> ⧠⭔ *𝐀𝐧𝐢𝐦𝐞 𝐲 𝐑𝐞𝐚𝐜𝐜𝐢𝐨𝐧𝐞𝐬* ⭔⧠
> ❣ Comandos de reacciones de anime.
> 𖹭𖹭 *#angry • #enojado* + <mencion>
> > ✿ Estar enojado
> 𖹭𖹭 *#bite* + <mencion>
> > ✿ Muerde a alguien
> 𖹭𖹭 *#bleh* + <mencion>
> > ✿ Sacar la lengua
> 𖹭𖹭 *#blush* + <mencion>
> > ✿ Sonrojarte
> 𖹭𖹭 *#bored • #aburrido* + <mencion>
> > ✿ Estar aburrido
> 𖹭𖹭 *#cry* + <mencion>
> > ✿ Llorar por algo o alguien
> 𖹭𖹭 *#cuddle* + <mencion>
> > ✿ Acurrucarse
> 𖹭𖹭 *#dance* + <mencion>
> > ✿ Sacate los pasitos prohíbidos
> 𖹭𖹭 *#drunk* + <mencion>
> > ✿ Estar borracho
> 𖹭𖹭 *#eat • #comer* + <mencion>
> > ✿ Comer algo delicioso
> 𖹭𖹭 *#facepalm* + <mencion>
> > ✿ Darte una palmada en la cara
> 𖹭𖹭 *#happy • #feliz* + <mencion>
> > ✿ Salta de felicidad
> 𖹭𖹭 *#hug* + <mencion>
> > ✿ Dar un abrazo
> 𖹭𖹭 *#impregnate • #preg* + <mencion>
> > ✿ Embarazar a alguien
> 𖹭𖹭 *#kill* + <mencion>
> > ✿ Toma tu arma y mata a alguien
> 𖹭𖹭 *#kiss • #besar* • #kiss2 + <mencion>
> > ✿ Dar un beso
> 𖹭𖹭 *#laugh* + <mencion>
> > ✿ Reírte de algo o alguien
> 𖹭𖹭 *#lick* + <mencion>
> > ✿ Lamer a alguien
> 𖹭𖹭 *#love • #amor* + <mencion>
> > ✿ Sentirse enamorado
> 𖹭𖹭 *#pat* + <mencion>
> > ✿ Acaricia a alguien
> 𖹭𖹭 *#poke* + <mencion>
> > ✿ Picar a alguien
> 𖹭𖹭 *#pout* + <mencion>
> > ✿ Hacer pucheros
> 𖹭𖹭 *#punch* + <mencion>
> > ✿ Dar un puñetazo
> 𖹭𖹭 *#run* + <mencion>
> > ✿ Correr
> 𖹭𖹭 *#sad • #triste* + <mencion>
> > ✿ Expresar tristeza
> 𖹭𖹭 *#scared* + <mencion>
> > ✿ Estar asustado
> 𖹭𖹭 *#seduce* + <mencion>
> > ✿ Seducir a alguien
> 𖹭𖹭 *#shy • #timido* + <mencion>
> > ✿ Sentir timidez
> 𖹭𖹭 *#slap* + <mencion>
> > ✿ Dar una bofetada
> 𖹭𖹭 *#dias • #days*
> > ✿ Darle los buenos días a alguien
> 𖹭𖹭 *#noches • #nights*
> > ✿ Darle las buenas noches a alguien
> 𖹭𖹭 *#sleep* + <mencion>
> > ✿ Tumbarte a dormir
> 𖹭𖹭 *#smoke* + <mencion>
> > ✿ Fumar
> 𖹭𖹭 *#think* + <mencion>
> > ✿ Pensar en algo
> 𖹭𖹭 *#marry* [mension / etiquetar]
> > ✿ Propón matrimonio a otro usuario.
> 𖹭𖹭 *#divorce*
> > ✿ Divorciarte de tu pareja.
> 𖹭𖹭 *#cafe • #coffe*
> > ✿ Tomate un cafecito con alguien.
  `.trim();

      await conn.sendMessage(m.chat, {
      text: txt,
      contextInfo: {
          mentionedJid: [m.sender, userId],
          isForwarded: true,
          forwardedNewsletterMessageInfo: {
              newsletterJid: global.channelRD ? global.channelRD.id : '120363291566029361@newsletter', // Fallback JID
              newsletterName: global.channelRD ? global.channelRD.name : 'Bot News', // Fallback Name
              serverMessageId: -1,
          },
          forwardingScore: 999,
          externalAdReply: {
              title: botname,
              body: global.textbot || 'By Wirk', // Fallback body
              thumbnailUrl: global.banner || '', // Fallback empty string if banner not defined
              sourceUrl: global.redes || '', // Fallback empty string if redes not defined
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
    let h = Math.floor(ms / 3600000);
    let m = Math.floor(ms / 60000) % 60;
    let s = Math.floor(ms / 1000) % 60;
    return `${h}h ${m}m ${s}s`;
}
