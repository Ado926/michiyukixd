let handler = async (m, { conn, args }) => {
    let userId = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.sender;
    let user = global.db.data.users[userId]; // Asegúrate de que 'user' se maneje si es undefined (nuevo usuario)

    // Corregido: conn.getName es probablemente asíncrono
    let name = await conn.getName(userId);

    let _uptime = process.uptime() * 1000;
    let uptime = clockString(_uptime);
    let totalreg = Object.keys(global.db.data.users).length;

    // Corregido: Sintaxis de la función flecha
    let totalCommands = Object.values(global.plugins).filter(v => v.help && v.tags).length;

    let moneda = global.moneda || 'Moneda';
    let botname = global.botname || 'TuBot';

    let txt = `> *・°☆・°・°☆・°・*☆・°・*
> Hola @${userId.split('@')[0]}!, Bienvenido!
> *・°☆・°・°☆・°・*☆・°・*
> Bot: *${(conn.user.jid == global.conn.user.jid ? 'Principal 🅥' : 'Sub Bot 🅑')}*
> Moneda: *${moneda}*
> Activado: *${uptime}*
> Usuarios: *${totalreg}*
> Comandos: *${totalCommands}*
> *・°☆・°・°☆・°・*☆・°・*

🌳 Puedes tener tu *Sub Bot* usa *#code* o *#qr* para vincular.

 ⧠⭔ *INFO BOT* ⭔⧠
 ❢ Comandos para ver estado e información de la Bot.
 𖹭𖹭 *#help • #menu*
✿ Ver la lista de comandos de la Bot.
 𖹭𖹭 *#uptime • #runtime*
✿ Ver tiempo activo o en linea de la Bot
 𖹭𖹭 *#status • #estado*
✿ Ver el estado actual de la Bot.
 𖹭𖹭 *#infobot • #infobot*
✿ Ver la información completa de la Bot.
 𖹭𖹭 *#p • #ping*
✿ Ver la velocidad de respuesta del Bot.
 𖹭𖹭 *#sistema • #system*
✿ Ver estado del sistema de alojamiento.
 𖹭𖹭 *#speed • #speedtest*
✿ Ver las estadísticas de velocidad de la Bot.
 𖹭𖹭 *#views • #usuarios*
✿ Ver la cantidad de usuarios registrados en el sistema.
 𖹭𖹭 *#funciones • #totalfunciones*
✿ Ver todas las funciones de la Bot.
 𖹭𖹭 *#ds • #fixmsgespera*
✿ Eliminar archivos de sesión innecesarios.
 𖹭𖹭 *#editautoresponder*
✿ Configurar un Prompt personalizado de la Bot.
 𖹭𖹭 *#creador*
✿ Contacto del creador de la Bot.
 𖹭𖹭 *#links • #grupos*
✿ Ver los enlaces oficiales de la Bot.
 𖹭𖹭 *#sug • #newcommand*
✿ Sugiere un nuevo comando.
 𖹭𖹭 *#reporte • #reportar*
✿ Reporta alguna falla o problema de la Bot.

 ⧠⭔ *𝐒𝐮𝐛𝐛𝐨𝐭𝐬* ⭔⧠
 ❢ Comandos para gestionar Sub-Bots.
 𖹭𖹭 *#serbot • #serbot code*
✿ Crea una sesión de Sub-Bot.
 𖹭𖹭 *#bots • #sockets*
✿ Ver la lista de Sub-Bots activos.

 ⧠⭔ *𝐏𝐞𝐫𝐟𝐢𝐥* ⭔⧠
 ❣ Comandos de perfil para ver, configurar y comprobar estados de tu perfil.
 𖹭𖹭 *#reg • #verificar • #register*
✿ Registra tu nombre y edad en el bot.
 𖹭𖹭 *#unreg*
✿ Elimina tu registro del bot.
 𖹭𖹭 *#profile*
✿ Muestra tu perfil de usuario.
 𖹭𖹭 *#setgenre • #setgenero*
✿ Establece tu género en el perfil del bot.
 𖹭𖹭 *#delgenre • #delgenero*
✿ Elimina tu género del perfil del bot.
 𖹭𖹭 *#setbirth • #setnacimiento*
✿ Establece tu fecha de nacimiento en el perfil del bot.
 𖹭𖹭 *#delbirth • #delnacimiento*
✿ Elimina la fecha de nacimiento del perfil del bot.
 𖹭𖹭 *#setdescription • #setdesc*
✿ Establece una descripción en tu perfil del bot.
 𖹭𖹭 *#deldescription • #deldesc*
✿ Elimina la descripción de tu perfil del bot.
 𖹭𖹭 *#comprarpremium • #premium*
✿ Compra un pase premium para usar el bot sin límites.
 𖹭𖹭 *#confesiones • #confesar*
✿ Confiesa tus sentimientos a alguien de manera anonima.

 ⧠⭔ *𝐄𝐜𝐨𝐧𝐨𝐦𝐢́𝐚 𝐲 𝐑𝐏𝐆* ⭔⧠
 ❣ Comandos de economía y rpg para ganar dinero y otros recursos.
 𖹭𖹭 *#w • #work • #trabajar*
✿ Trabaja para ganar ${moneda}.
 𖹭𖹭 *#slut • #protituirse*
✿ Trabaja como prostituta y gana ${moneda}.
 𖹭𖹭 *#crime • #crimen*
✿ Trabaja como ladrón para ganar ${moneda}.
 𖹭𖹭 *#miming • #minar • #mine*
✿ Trabaja como minero y recolecta recursos.
 𖹭𖹭 *#daily • #diario*
✿ Reclama tu recompensa diaria.
 𖹭𖹭 *#cofre*
✿ Reclama un cofre diario lleno de recursos.
 𖹭𖹭 *#weekly • #semanal*
✿ Reclama tu regalo semanal.
 𖹭𖹭 *#monthly • #mensual*
✿ Reclama tu recompensa mensual.
 𖹭𖹭 *#aventura • #adventure*
✿ Aventúrate en un nuevo reino y recolecta recursos.
 𖹭𖹭 *#cazar • #hunt • #berburu*
✿ Aventúrate en una caza de animales.
 𖹭𖹭 *#mazmorra • #explorar*
✿ Explorar mazmorras para ganar ${moneda}.
 𖹭𖹭 *#curar • #heal*
✿ Cura tu salud para volverte aventurar.
 𖹭𖹭 *#inv • #inventario*
✿ Ver tu inventario con todos tus ítems.
 𖹭𖹭 *#cf • #suerte*
✿ Apuesta tus ${moneda} a cara o cruz.
 𖹭𖹭 *#ruleta • #roulette • #rt*
✿ Apuesta ${moneda} al color rojo o negro.
 𖹭𖹭 *#casino • #apostar*
✿ Apuesta tus ${moneda} en el casino.
 𖹭𖹭 *#slot*
✿ Apuesta tus ${moneda} en la ruleta y prueba tu suerte.
 𖹭𖹭 *#steal • #robar • #rob*
✿ Intenta robarle ${moneda} a alguien.
 𖹭𖹭 *#robarxp • #robxp*
✿ Intenta robar XP a un usuario.
 𖹭𖹭 *#cartera • #wallet*
✿ Ver tus ${moneda} en la cartera.
 𖹭𖹭 *#banco • #bank*
✿ Ver tus ${moneda} en el banco.
 𖹭𖹭 *#deposit • #depositar • #d*
✿ Deposita tus ${moneda} al banco.
 𖹭𖹭 *#with • #retirar • #withdraw*
✿ Retira tus ${moneda} del banco.
 𖹭𖹭 *#transfer • #pay*
✿ Transfiere ${moneda} o XP a otros usuarios.
 𖹭𖹭 *#buyall • #buy*
✿ Compra ${moneda} con tu XP.
 𖹭𖹭 *#eboard • #baltop*
✿ Ver el ranking de usuarios con más ${moneda}.
 𖹭𖹭 *#level • #lvl* + <@Mencion
✿ Ver tu nivel y experiencia actual.
 𖹭𖹭 *#lb • #lboard* + <Paginá
✿ Top de usuarios con más (experiencia y nivel).
 𖹭𖹭 *#halloween*
✿ Reclama tu dulce o truco (Solo en Halloween).
 𖹭𖹭 *#christmas • #navidad*
✿ Reclama tu regalo navideño (Solo en Navidad).

 ⧠⭔ *𝐆𝐚𝐜𝐡𝐚* ⭔⧠
 ❣ Comandos de gacha para reclamar y colecciónar personajes.
 𖹭𖹭 *#rollwaifu • #rw • #roll*
✿ Waifu o husbando aleatorio.
 𖹭𖹭*#claim • #c • #reclamar*
✿ Reclamar un personaje.
 𖹭𖹭 *#harem • #waifus • #claims*
✿ Ver tus personajes reclamados.
 𖹭𖹭 *#charimage • #waifuimage • #wimage*
✿ Ver una imagen aleatoria de un personaje.
 𖹭𖹭 *#charinfo • #winfo • #waifuinfo*
✿ Ver información de un personaje.
 𖹭𖹭 *#givechar • #givewaifu • #regalar*
✿ Regalar un personaje a otro usuario.
 𖹭𖹭 *#vote • #votar*
✿ Votar por un personaje para subir su valor.
 𖹭𖹭 *#waifusboard • #waifustop • #topwaifus*
✿ Ver el top de personajes con mayor valor.

 ⧠⭔ *𝐃𝐞𝐬𝐜𝐚𝐫𝐠𝐚𝐬* ⭔⧠
 ❣ Comandos de descargas para varios archivos.
 𖹭𖹭 *#tiktok • #tt*
✿ Descarga videos de TikTok.
 𖹭𖹭 *#ttimg • #ttmp3* + <url
✿ Descarga fotos/audios de tiktok.
 𖹭𖹭 *#tiktokrandom • #ttrandom*
✿ Descarga un video aleatorio de tiktok.
 𖹭𖹭 *#play • #play2*
✿ Descarga música/video de YouTube.
 𖹭𖹭 *#ytmp3 • #ytmp4*
✿ Descarga música/video de YouTube mediante url.
 𖹭𖹭 *#fb • #facebook*
✿ Descarga videos de Facebook.
 𖹭𖹭 *#twitter • #x* + [Link]
✿ Descargar un video de Twitter/X
 𖹭𖹭 *#ig • #instagram*
✿ Descarga contenido de Instagram.
 𖹭𖹭 *#pinvid • #pinvideo* + [enlacé]
✿ Descargar vídeos de Pinterest.
 𖹭𖹭 *#mediafire • #mf*
✿ Descargar un archivo de MediaFire.
 𖹭𖹭 *#mega • #mg* + [enlacé]
✿ Descargar un archivo de MEGA.
 𖹭𖹭 *#terabox • #tb* + [enlace]
✿ Descargar archivos por Terabox.
 𖹭𖹭 *#gitclone* + <url
✿ Descarga un repositorio de github.
 𖹭𖹭 *#apk • #modapk*
✿ Descarga un apk de Aptoide.
 𖹭𖹭 *#npmdl • #npmdownloader*
✿ Descarga paquetes de NPMJs.

 ⧠⭔ *𝐁𝐮𝐬𝐜𝐚𝐝𝐨𝐫𝐞𝐬* ⭔⧠
 ❣ Comandos para realizar búsquedas en distintas plataformas.
 𖹭𖹭 *#tiktoksearch • #tiktoks*
✿ Buscador de videos de tiktok.
 𖹭𖹭 *#tweetposts*
✿ Buscador de posts de Twitter/X.
 𖹭𖹭 *#ytsearch • #yts*
✿ Realiza búsquedas de Youtube.
 𖹭𖹭 *#google*
✿ Realiza búsquedas por Google.
 𖹭𖹭 *#pin • #pinterest*
✿ Buscador de imagenes de Pinterest.
 𖹭𖹭 *#imagen • #image*
✿ buscador de imagenes de Google.
 𖹭𖹭 *#githubsearch*
✿ Buscador de usuarios de GitHub.
 𖹭𖹭 *#cuevana • #cuevanasearch*
✿ Buscador de películas/series por Cuevana.
 𖹭𖹭 *#infoanime*
✿ Buscador de información de anime/manga.
 𖹭𖹭 *#npmjs*
✿ Buscandor de npmjs.

 ⧠⭔ *𝐍𝐒𝐅𝐖* ⭔⧠
 ❣ Comandos NSFW (Contenido para adultos) - Úsalo bajo tu responsabilidad.
 𖹭𖹭 *#anal* + <mencion
✿ Hacer un anal
 𖹭𖹭 *#bath* + <mencion
✿ Bañarse
 𖹭𖹭 *#blowjob • #mamada • #bj* + <mencion
✿ Dar una mamada
 𖹭𖹭 *#boobjob* + <mencion
✿ Hacer una rusa
 𖹭𖹭 *#cum* + <mencion
✿
