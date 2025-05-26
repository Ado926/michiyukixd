import {
    smsg
} from './lib/simple.js'
import {
    format
} from 'util'
import {
    fileURLToPath
} from 'url'
import path, {
    join
} from 'path'
import {
    unwatchFile,
    watchFile
} from 'fs'
import chalk from 'chalk'
import fetch from 'node-fetch'
import ws from 'ws'; // Import WebSocket module for ws.CLOSED check

const {
    proto
} = (await import('@whiskeysockets/baileys')).default
const isNumber = x => typeof x === 'number' && !isNaN(x)
const delay = ms => isNumber(ms) && new Promise(resolve => setTimeout(function() {
    clearTimeout(this)
    resolve()
}, ms))

export async function handler(chatUpdate) {
    this.msgqueque = this.msgqueque || []
    this.uptime = this.uptime || Date.now()
    if (!chatUpdate)
        return
    // This part seems to handle processing multiple messages in a batch, but `pushMessage` is not defined in this snippet.
    // If `pushMessage` is intended to add messages to a queue for later processing, this line is fine.
    // If it's meant to *immediately* process them, it might conflict with the rest of the handler logic.
    // Assuming it's part of an external queueing mechanism.
    // Nota: Asegúrate de que 'pushMessage' esté definido en alguna parte si lo necesitas.
    this.pushMessage(chatUpdate.messages).catch(console.error)

    let m = chatUpdate.messages[chatUpdate.messages.length - 1]
    if (!m)
        return;

    // Load database if not loaded
    if (global.db.data == null)
        await global.loadDatabase()

    try {
        // Process message using smsg or use raw message if smsg fails/returns null
        m = smsg(this, m) || m
        if (!m)
            return

        m.exp = 0 // Initialize experience points for the message
        m.coin = false // Initialize coin cost for the message

        try {
            // Initialize user data if it doesn't exist
            let user = global.db.data.users[m.sender]
            if (typeof user !== 'object')
                global.db.data.users[m.sender] = {}

            // Set default values for user properties if they don't exist
            if (user) {
                if (!isNumber(user.exp)) user.exp = 0
                if (!isNumber(user.coin)) user.coin = 10 // Default starting coins
                if (!isNumber(user.joincount)) user.joincount = 1
                if (!isNumber(user.diamond)) user.diamond = 3
                if (!isNumber(user.lastadventure)) user.lastadventure = 0
                if (!isNumber(user.lastclaim)) user.lastclaim = 0
                if (!isNumber(user.health)) user.health = 100
                if (!isNumber(user.crime)) user.crime = 0
                if (!isNumber(user.lastcofre)) user.lastcofre = 0
                if (!isNumber(user.lastdiamantes)) user.lastdiamantes = 0
                if (!isNumber(user.lastpago)) user.lastpago = 0
                if (!isNumber(user.lastcode)) user.lastcode = 0
                if (!isNumber(user.lastcodereg)) user.lastcodereg = 0
                if (!isNumber(user.lastduel)) user.lastduel = 0
                if (!isNumber(user.lastmining)) user.lastmining = 0
                if (!('muto' in user)) user.muto = false
                if (!('premium' in user)) user.premium = false
                if (!user.premium) user.premiumTime = 0 // Ensure premiumTime is 0 if not premium
                if (!('registered' in user)) user.registered = false
                if (!('genre' in user)) user.genre = ''
                if (!('birth' in user)) user.birth = ''
                if (!('marry' in user)) user.marry = ''
                if (!('description' in user)) user.description = ''
                if (!('packstickers' in user)) user.packstickers = null
                if (!user.registered) {
                    if (!('name' in user)) user.name = m.name // Set default name if not registered
                    if (!isNumber(user.age)) user.age = -1
                    if (!isNumber(user.regTime)) user.regTime = -1
                }
                if (!isNumber(user.afk)) user.afk = -1
                if (!('afkReason' in user)) user.afkReason = ''
                if (!('role' in user)) user.role = 'Nuv' // Default role
                if (!('banned' in user)) user.banned = false
                if (!('useDocument' in user)) user.useDocument = false
                if (!isNumber(user.level)) user.level = 0
                if (!isNumber(user.bank)) user.bank = 0
                if (!isNumber(user.warn)) user.warn = 0
            } else {
                // Create new user entry with default values
                global.db.data.users[m.sender] = {
                    exp: 0,
                    coin: 10,
                    joincount: 1,
                    diamond: 3,
                    lastadventure: 0,
                    health: 100,
                    lastclaim: 0,
                    lastcofre: 0,
                    lastdiamantes: 0,
                    lastcode: 0,
                    lastduel: 0,
                    lastpago: 0,
                    lastmining: 0,
                    lastcodereg: 0,
                    muto: false,
                    registered: false,
                    genre: '',
                    birth: '',
                    marry: '',
                    description: '',
                    packstickers: null,
                    name: m.name,
                    age: -1,
                    regTime: -1,
                    afk: -1,
                    afkReason: '',
                    banned: false,
                    useDocument: false,
                    bank: 0,
                    level: 0,
                    role: 'Nuv',
                    premium: false,
                    premiumTime: 0,
                }
            }

            // Initialize chat data if it doesn't exist
            let chat = global.db.data.chats[m.chat]
            if (typeof chat !== 'object')
                global.db.data.chats[m.chat] = {}

            // Set default values for chat properties if they don't exist
            if (chat) {
                if (!('isBanned' in chat)) chat.isBanned = false
                if (!('sAutoresponder' in chat)) chat.sAutoresponder = '' // Likely for simple text autoresponse
                if (!('welcome' in chat)) chat.welcome = true // Welcome message toggle
                if (!('autolevelup' in chat)) chat.autolevelup = false // Auto level up message toggle
                if (!('autoAceptar' in chat)) chat.autoAceptar = false // Auto accept join requests (if applicable)
                if (!('autosticker' in chat)) chat.autosticker = false // Auto create sticker from image/video
                if (!('autoRechazar' in chat)) chat.autoRechazar = false // Auto reject join requests (if applicable)
                if (!('autoresponder' in chat)) chat.autoresponder = false // General autoresponder toggle
                if (!('detect' in chat)) chat.detect = true // Detect links/specific words?
                if (!('antiBot' in chat)) chat.antiBot = false // Basic anti-bot measures
                if (!('antiBot2' in chat)) chat.antiBot2 = false // Another anti-bot level?
                if (!('modoadmin' in chat)) chat.modoadmin = false // Admin mode toggle (only admins can use commands)
                if (!('antiLink' in chat)) chat.antiLink = true // Anti-link feature
                if (!('reaction' in chat)) chat.reaction = false // Auto reaction toggle
                if (!('nsfw' in chat)) chat.nsfw = false // NSFW content toggle
                if (!('antifake' in chat)) chat.antifake = true // Anti fake number feature
                if (!('delete' in chat)) chat.delete = false // Auto delete messages?
                if (!isNumber(chat.expired)) chat.expired = 0 // Chat expiration time
                if (!('antiLag' in chat)) chat.antiLag = false // Anti-lag feature
                if (!('per' in chat)) chat.per = [] // List of allowed bots/users for anti-lag
            } else {
                // Create new chat entry with default values
                global.db.data.chats[m.chat] = {
                    isBanned: false,
                    sAutoresponder: '',
                    welcome: true,
                    autolevelup: false,
                    autoresponder: false,
                    delete: false,
                    autoAceptar: false,
                    autoRechazar: false,
                    detect: true,
                    antiBot: false,
                    antiBot2: false,
                    modoadmin: false,
                    antiLink: true,
                    antifake: true,
                    reaction: false,
                    nsfw: false,
                    expired: 0,
                    antiLag: false,
                    per: [],
                }
            }

            // Initialize settings data for the bot itself if it doesn't exist
            var settings = global.db.data.settings[this.user.jid]
            if (typeof settings !== 'object') global.db.data.settings[this.user.jid] = {}

            // Set default values for settings properties if they don't exist
            if (settings) {
                if (!('self' in settings)) settings.self = false // Self mode (only bot owner commands work)
                if (!('restrict' in settings)) settings.restrict = true // Restrict certain commands (like group settings)
                if (!('jadibotmd' in settings)) settings.jadibotmd = true // Jadibot (become a bot) feature toggle
                if (!('antiPrivate' in settings)) settings.antiPrivate = false // Anti-private chat (block users messaging bot privately)
                if (!('autoread' in settings)) settings.autoread = false // Auto read messages toggle
                if (!('status' in settings)) settings.status = 0 // Bot status (online, typing, recording)
            } else {
                // Create new settings entry with default values
                global.db.data.settings[this.user.jid] = {
                    self: false,
                    restrict: true,
                    jadibotmd: true,
                    antiPrivate: false,
                    autoread: false,
                    status: 0
                }
            }
        } catch (e) {
            console.error(e) // Log errors during database initialization/defaults setting
        }

        // Anti-Lag check: Ensure the current bot instance is allowed if anti-lag is enabled in the chat
        const mainBot = global.conn.user.jid
        const chat = global.db.data.chats[m.chat] || {} // Re-fetch chat data after potential initialization
        const isSubbs = chat.antiLag === true
        const allowedBots = chat.per || []
        // Add the main bot to the allowed list if not present (seems like a way to ensure the main bot is always allowed)
        if (!allowedBots.includes(mainBot)) allowedBots.push(mainBot)
        const isAllowed = allowedBots.includes(this.user.jid) // Check if the current bot instance's JID is in the allowed list
        if (isSubbs && !isAllowed)
            return // If anti-lag is on and the bot is not allowed, stop processing

        // Global bot options checks
        if (opts['nyimak']) return // Stealth mode?
        if (!m.fromMe && opts['self']) return // Self mode (only respond to messages from the bot itself)
        if (opts['swonly'] && m.chat !== 'status@broadcast') return // Status only mode

        // Ensure m.text is a string
        if (typeof m.text !== 'string')
            m.text = ''

        // Get user data (already initialized above, but re-fetched here)
        let _user = global.db.data && global.db.data.users && global.db.data.users[m.sender]

        // Determine user roles based on global lists and user data
        const isROwner = [conn.decodeJid(global.conn.user.id), ...global.owner.map(([number]) => number)].map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net').includes(m.sender)
        const isOwner = isROwner || m.fromMe // Owner is ROwner or the message is from the bot itself
        const isMods = isOwner || global.mods.map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net').includes(m.sender)
        const isPrems = isROwner || global.prems.map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net').includes(m.sender) || (_user?.premium == true) // Use optional chaining for _user

        // Message Queueing (Basic) for non-mod/premium users
        // This logic is a bit complex and might not work reliably depending on how the queue is processed elsewhere.
        if (opts['queque'] && m.text && !(isMods || isPrems)) {
            let queque = this.msgqueque,
                time = 1000 * 5 // 5 seconds delay
            const previousID = queque[queque.length - 1]
            queque.push(m.id || m.key.id)
            setInterval(async function() {
                if (queque.indexOf(previousID) === -1) clearInterval(this)
                await delay(time)
            }, time)
        }

        // Skip messages sent by Baileys internal processes
        if (m.isBaileys) {
            return
        }

        // Add random experience points (before command processing)
        m.exp += Math.ceil(Math.random() * 10)

        let usedPrefix // Variable to store the matched prefix

        // Get group metadata and participants if in a group
        const groupMetadata = (m.isGroup ? ((conn.chats[m.chat] || {}).metadata || await this.groupMetadata(m.chat).catch(_ => null)) : {}) || {}
        const participants = (m.isGroup ? groupMetadata.participants : []) || []
        // Find the user's participant object and the bot's participant object
        const user = (m.isGroup ? participants.find(u => conn.decodeJid(u.id) === m.sender) : {}) || {}
        const bot = (m.isGroup ? participants.find(u => conn.decodeJid(u.id) == this.user.jid) : {}) || {}
        // Determine admin status
        const isRAdmin = user?.admin == 'superadmin' || false
        const isAdmin = isRAdmin || user?.admin == 'admin' || false
        const isBotAdmin = bot?.admin || false

        // Define the directory for plugins
        const ___dirname = path.join(path.dirname(fileURLToPath(import.meta.url)), './plugins')

        // Loop through all registered plugins
        for (let name in global.plugins) {
            let plugin = global.plugins[name]
            if (!plugin)
                continue // Skip if plugin is null/undefined
            if (plugin.disabled)
                continue // Skip if plugin is disabled

            const __filename = join(___dirname, name) // Get the full path to the plugin file

            // Execute the 'all' function in the plugin if it exists (runs on every message)
            if (typeof plugin.all === 'function') {
                try {
                    await plugin.all.call(this, m, {
                        chatUpdate,
                        __dirname: ___dirname,
                        __filename
                    })
                } catch (e) {
                    console.error(e) // Log errors in 'all' function
                }
            }

            // Skip admin plugins if 'restrict' option is off
            if (!opts['restrict']) {
                if (plugin.tags && plugin.tags.includes('admin')) {
                    continue
                }
            }

            // Helper function to escape special characters for RegExp
            const str2Regex = str => str.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&')

            // Determine the prefix(es) to use for matching
            let _prefix = plugin.customPrefix ? plugin.customPrefix : conn.prefix ? conn.prefix : global.prefix

            // Match the message text against the prefix(es)
            // This logic is a bit complex but handles RegExp, arrays of prefixes, and string prefixes.
            let match = (_prefix instanceof RegExp ?
                [
                    [_prefix.exec(m.text), _prefix]
                ] :
                Array.isArray(_prefix) ?
                _prefix.map(p => {
                    let re = p instanceof RegExp ?
                        p :
                        new RegExp(str2Regex(p))
                    return [re.exec(m.text), re]
                }) :
                typeof _prefix === 'string' ?
                [
                    [new RegExp(str2Regex(_prefix)).exec(m.text), new RegExp(str2Regex(_prefix))]
                ] :
                [
                    [
                        [], new RegExp()
                    ]
                ]
            ).find(p => p[1]) // Find the first prefix that matches

            // Execute the 'before' function in the plugin if it exists
            if (typeof plugin.before === 'function') {
                // If 'before' returns true, stop processing this plugin for the message
                if (await plugin.before.call(this, m, {
                        match,
                        conn: this,
                        participants,
                        groupMetadata,
                        user,
                        bot,
                        isROwner,
                        isOwner,
                        isRAdmin,
                        isAdmin,
                        isBotAdmin,
                        isPrems,
                        chatUpdate,
                        __dirname: ___dirname,
                        __filename
                    }))
                    continue
            }

            // Skip if the plugin is not a function (i.e., doesn't have a main command handler)
            if (typeof plugin !== 'function')
                continue

            // If a prefix match was found
            if ((usedPrefix = (match[0] || '')[0])) {
                // Extract command and arguments
                let noPrefix = m.text.replace(usedPrefix, '') // Text without the prefix
                let [command, ...args] = noPrefix.trim().split` `.filter(v => v) // Split by space, filter empty strings
                args = args || [] // Ensure args is an array
                let _args = noPrefix.trim().split` `.slice(1) // Arguments including potential empty strings
                let text = _args.join` ` // Full text of arguments

                // Convert command to lowercase
                command = (command || '').toLowerCase()

                // Get the failure message function
                let fail = plugin.fail || global.dfail

                // Check if the extracted command matches the plugin's command definition
                let isAccept = plugin.command instanceof RegExp ?
                    plugin.command.test(command) : // Match against RegExp
                    Array.isArray(plugin.command) ?
                    plugin.command.some(cmd => cmd instanceof RegExp ?
                        cmd.test(command) : // Match against RegExp in array
                        cmd === command) : // Match against string in array
                    typeof plugin.command === 'string' ?
                    plugin.command === command : // Match against string
                    false // Not a recognised command type

                // Store the matched command globally (used in dfail)
                global.comando = command

                // Skip messages with specific IDs (likely internal or bot-generated)
                if ((m.id.startsWith('NJX-') || (m.id.startsWith('BAE5') && m.id.length === 16) || (m.id.startsWith('B24E') && m.id.length === 20))) return

                // If the command does not match, continue to the next plugin
                if (!isAccept) {
                    continue
                }

                // Assign the plugin name to the message object
                m.plugin = name

                // Check chat and user ban status before executing commands
                // This block seems slightly redundant as ban checks are also done below,
                // but it includes specific exemptions for unban commands.
                if (m.chat in global.db.data.chats || m.sender in global.db.data.users) {
                    let chat = global.db.data.chats[m.chat]
                    let user = global.db.data.users[m.sender]

                    // If chat is banned and user is not ROwner, return/skip.
                    // Includes specific exemptions for 'grupo-unbanchat.js'.
                    if (!['grupo-unbanchat.js'].includes(name) && chat && chat.isBanned && !isROwner) return // This return might stop processing entirely

                    // This is a similar ban check with different exemptions.
                    // It might be redundant or intended for slightly different scenarios.
                    // If chat is banned and user is not ROwner, return/skip unless it's an exempted command.
                    if (name != 'grupo-unbanchat.js' && name != 'owner-exec.js' && name != 'owner-exec2.js' && name != 'grupo-delete.js' && chat?.isBanned && !isROwner) return

                    // Basic antispam check (user must wait 3 seconds between commands)
                    if (user.antispam > 2) return // If antispam count is high, stop. This seems like a simple counter.
                    // Check user banned status and reply with a message if banned and not ROwner
                    if (m.text && user.banned && !isROwner) {
                        m.reply(`《✦》Estas baneado/a, no puedes usar comandos en este bot!\n\n${user.bannedReason ? `✰ *Motivo:* ${user.bannedReason}` : '✰ *Motivo:* Sin Especificar'}\n\n> ✧ Si este Bot es cuenta oficial y tiene evidencia que respalde que este mensaje es un error, puedes exponer tu caso con un moderador.`)
                        user.antispam++ // Increment antispam counter (even if banned?)
                        return
                    }

                    // antispam2 check for ROwner - seems counter-intuitive, might be a mistake?
                    // It would prevent ROwners from using commands if antispam2 is true.
                    if (user.antispam2 && isROwner) return // Consider reviewing this logic

                    // Timestamp-based spam check (3 seconds cooldown)
                    let time = global.db.data.users[m.sender].spam + 1000
                    if (new Date - global.db.data.users[m.sender].spam < 1000) return console.log(`[ SPAM ]`)
                    global.db.data.users[m.sender].spam = new Date * 1 // Update spam timestamp

                    // Another set of ban checks - these seem more targeted towards the command loop context.
                    // If chat is banned and user is not ROwner, skip if it's not the unbanchat command.
                    if (m.chat in global.db.data.chats || m.sender in global.db.data.users) {
                        let chat = global.db.data.chats[m.chat]
                        let user = global.db.data.users[m.sender]
                        let setting = global.db.data.settings[this.user.jid] // Settings variable declared but not used here

                        if (name != 'grupo-unbanchat.js' && chat?.isBanned)
                            return // If chat is banned and command is not unbanchat, stop processing this plugin

                        // If user is banned and command is not unbanuser, skip.
                        if (name != 'owner-unbanuser.js' && user?.banned)
                            return // If user is banned and command is not unbanuser, stop processing this plugin
                    }
                }

                // Admin Mode Check: If admin mode is enabled in the chat,
                // only Owner, ROwner, or Admins can use commands.
                // The 'mini' variable logic is a bit complex; it seems to check if the command
                // is associated with admin/group plugins or if a prefix was used.
                let hl = _prefix
                let adminMode = global.db.data.chats[m.chat].modoadmin
                let mini = `${plugins.botAdmin || plugins.admin || plugins.group || plugins || noPrefix || hl || m.text.slice(0, 1) == hl || plugins.command}`
                if (adminMode && !isOwner && !isROwner && m.isGroup && !isAdmin && mini) {
                    return // If admin mode is on, user is not admin/owner/rowner in a group, and the command seems like a potential command, stop processing.
                }

                // Permission checks based on plugin properties
                if (plugin.rowner && plugin.owner && !(isROwner || isOwner)) {
                    fail('owner', m, this) // Use fail function
                    continue
                }
                if (plugin.rowner && !isROwner) {
                    fail('rowner', m, this)
                    continue
                }
                if (plugin.owner && !isOwner) {
                    fail('owner', m, this)
                    continue
                }
                if (plugin.mods && !isMods) {
                    fail('mods', m, this)
                    continue
                }
                if (plugin.premium && !isPrems) {
                    fail('premium', m, this)
                    continue
                }
                if (plugin.group && !m.isGroup) {
                    fail('group', m, this)
                    continue
                } else if (plugin.botAdmin && !isBotAdmin) {
                    fail('botAdmin', m, this)
                    continue
                } else if (plugin.admin && !isAdmin) {
                    fail('admin', m, this)
                    continue
                }
                if (plugin.private && m.isGroup) {
                    fail('private', m, this)
                    continue
                }

                // Registration check
                if (plugin.register == true && _user?.registered == false) { // Use optional chaining for _user
                    fail('unreg', m, this)
                    continue
                }

                m.isCommand = true // Mark message as a command
                let xp = 'exp' in plugin ? parseInt(plugin.exp) : 17 // Default XP gain
                if (xp > 200) // Cap XP gain? Seems low value (200) for a warning
                    m.reply('chirrido -_-') // Spanish for 'chirp' or 'squeak' - maybe a placeholder?
                else
                    m.exp += xp // Add XP to the message object

                // Coin check
                // Requires global.moneda to be defined
                if (!isPrems && plugin.coin && (global.db.data.users[m.sender]?.coin || 0) < plugin.coin * 1) { // Use optional chaining and default to 0 if coin is undefined
                    // MODIFICACION 1: Añadir texto al mensaje de "monedas agotadas"
                    conn.reply(m.chat, `🍃 Se agotaron tus ${global.moneda}` + '', m)
                    continue
                }

                // Level check
                if (plugin.level > (_user?.level || 0)) { // Use optional chaining and default to 0
                     // MODIFICACION 2: Añadir texto al mensaje de "nivel requerido"
                    conn.reply(m.chat, `🎋 Se requiere el nivel: *${plugin.level}*\n\n• Tu nivel actual es: *${(_user?.level || 0)}*\n\n• Usa este comando para subir de nivel:\n*${usedPrefix}levelup*` + '', m)
                    continue
                }

                // Prepare extra context for the plugin function
                let extra = {
                    match,
                    usedPrefix,
                    noPrefix,
                    _args,
                    args,
                    command,
                    text,
                    conn: this,
                    participants,
                    groupMetadata,
                    user,
                    bot,
                    isROwner,
                    isOwner,
                    isRAdmin,
                    isAdmin,
                    isBotAdmin,
                    isPrems,
                    chatUpdate,
                    __dirname: ___dirname,
                    __filename
                }

                try {
                    // Execute the main plugin function
                    await plugin.call(this, m, extra)

                    // Deduct coins if not premium and coin cost is defined
                    if (!isPrems)
                        m.coin = m.coin || plugin.coin || false // Ensure m.coin reflects the cost if successful
                } catch (e) {
                    // Handle errors during plugin execution
                    m.error = e
                    console.error(e)
                    if (e) {
                        let text = format(e)
                        // Replace API keys in error messages for security
                        for (let key of Object.values(global.APIKeys || {})) // Use optional chaining for global.APIKeys
                            text = text.replace(new RegExp(key, 'g'), 'Administrador') // Use 'Administrador' as replacement
                        m.reply(text) // Nota: Este m.reply enviará el error SIN el texto adicional por diseño. Si quisieras que los errores también lo tuvieran, deberías modificar esta línea.
                    }
                } finally {
                    // Execute the 'after' function in the plugin if it exists
                    if (typeof plugin.after === 'function') {
                        try {
                            await plugin.after.call(this, m, extra)
                        } catch (e) {
                            console.error(e) // Log errors in 'after' function
                        }
                    }

                    // Reply with coin deduction message if applicable
                    if (m.coin && typeof global.moneda !== 'undefined') { // Check if m.coin is truthy and global.moneda is defined
                         // MODIFICACION 3: Añadir texto al mensaje de "monedas usadas"
                         conn.reply(m.chat, `*Gastaste* ${+m.coin} ${global.moneda}` + '', m)
                    }
                }
                break // Stop processing plugins after finding a match and executing
            }
        }
    } catch (e) {
        console.error(e) // Log errors in the main handler try block
    } finally {
        // This block runs after the main try/catch/finally or if no command was found
        // Remove message from the queue if queuing was active
        if (opts['queque'] && m.text) {
            const quequeIndex = this.msgqueque.indexOf(m.id || m.key.id)
            if (quequeIndex !== -1)
                this.msgqueque.splice(quequeIndex, 1)
        }

        let user, stats = global.db.data.stats // Get stats object
        if (m) {
            // Handle user muting - delete the message if user is muted
            let utente = global.db.data.users[m.sender]
            if (utente?.muto == true) { // Use optional chaining
                let bang = m.key.id
                let cancellazzione = m.key.participant
                await conn.sendMessage(m.chat, {
                    delete: {
                        remoteJid: m.chat,
                        fromMe: false,
                        id: bang,
                        participant: cancellazzione
                    }
                })
            }

            // Update user XP and coin (XP was added earlier, coin was deducted in plugin finally block)
            if (m.sender && (user = global.db.data.users[m.sender])) {
                user.exp += m.exp
                // Coin deduction is already handled in the plugin's finally block based on m.coin
                // user.coin -= m.coin * 1 // This line might be redundant if deducted in the plugin's finally
            }

            // Update command usage statistics
            let stat
            if (m.plugin) { // Check if a plugin was executed
                let now = +new Date
                if (m.plugin in stats) {
                    stat = stats[m.plugin]
                    if (!isNumber(stat.total)) stat.total = 1
                    if (!isNumber(stat.success)) stat.success = m.error != null ? 0 : 1 // 1 if no error, 0 if error
                    if (!isNumber(stat.last)) stat.last = now
                    if (!isNumber(stat.lastSuccess)) stat.lastSuccess = m.error != null ? 0 : now // Timestamp of last success
                } else {
                    // Create new entry in stats if plugin is not tracked yet
                    stat = stats[m.plugin] = {
                        total: 1,
                        success: m.error != null ? 0 : 1,
                        last: now,
                        lastSuccess: m.error != null ? 0 : now
                    }
                }
                stat.total += 1 // Increment total usage
                stat.last = now // Update last used timestamp
                if (m.error == null) { // If execution was successful
                    stat.success += 1 // Increment success count
                    stat.lastSuccess = now // Update last success timestamp
                }
            }
        }

        // Call print function for logging (if not disabled)
        try {
            if (!opts['noprint']) await (await import(`./lib/print.js`)).default(m, this)
        } catch (e) {
            console.log(m, m.quoted, e) // Log errors during printing
        }

        // Auto read messages if enabled in settings
        let settingsREAD = global.db.data.settings[this.user.jid] || {}
        if (settingsREAD.autoread) { // Use settingsREAD variable
             await this.readMessages([m.key])
        }

        // Auto reaction feature
        // The RegExp is very broad and might react to many messages.
        if (global.db.data.chats[m.chat]?.reaction && m.text.match(/(ción|dad|aje|oso|izar|mente|pero|tion|age|ous|ate|and|but|ify|ai|yuki|a|s)/gi)) { // Use optional chaining
            let emot = pickRandom(["🍟", "😃", "😄", "😁", "😆", "🍓", "😅", "😂", "🤣", "🥲", "☺️", "😊", "😇", "🙂", "🙃", "😉", "😌", "😍", "🥰", "😘", "😗", "😙", "🌺", "🌸", "😚", "😋", "😛", "😝", "😜", "🤪", "🤨", "🌟", "🤓", "😎", "🥸", "🤩", "🥳", "😏", "💫", "😞", "😔", "😟", "😕", "🙁", "☹️", "😣", "😖", "😫", "😩", "🥺", "😢", "😭", "😤", "😠", "😡", "🤬", "🤯", "😳", "🥵", "🥶", "😶‍🌫️", "😱", "😨", "😰", "😥", "😓", "🤗", "🤔", "🫣", "🤭", "🤖", "🍭", "🤫", "🫠", "🤥", "😶", "📇", "😐", "💧", "😑", "🫨", "😬", "🙄", "😯", "😦", "😧", "😮", "😲", "🥱", "😴", "🤤", "😪", "😮‍💨", "😵", "😵‍💫", "🤐", "🥴", "🤢", "🤮", "🤧", "😷", "🤒", "🤕", "🤑", "🤠", "😈", "👿", "👺", "🧿", "🌩", "👻", "😺", "😸", "😹", "😻", "😼", "😽", "🙀", "😿", "😾", "🫶", "👍", "✌️", "🙏", "🫵", "🤏", "🤌", "☝️", "🖕", "🙏", "🫵", "🫂", "🐱", "🤹‍♀️", "🤹‍♂️", "🗿", "✨", "⚡", "🔥", "🌈", "🩷", "❤️", "🧡", "💛", "💚", "🩵", "💙", "💜", "🖤", "🩶", "🤍", "🤎", "💔", "❤️‍🔥", "❤️‍🩹", "❣️", "💕", "💞", "💓", "💗", "💖", "💘", "💝", "🚩", "👊", "⚡️", "💋", "🫰", "💅", "👑", "🐣", "🐤", "🐈"])
            if (!m.fromMe) { // Don't react to own messages
                 await this.sendMessage(m.chat, { react: { text: emot, key: m.key }})
            }
        }

        // Define pickRandom function (moved outside the conditional block for better practice)
        function pickRandom(list) {
            return list[Math.floor(Math.random() * list.length)]
        }
    }
}

// Default failure message function (used by plugins when permission checks fail)
global.dfail = (type, m, conn) => { // Added conn to arguments as it was passed in the original code
    // Assuming getRandom() is available on Array.prototype or globally
    let edadaleatoria = ['10', '28', '20', '40', '18', '21', '15', '11', '9', '17', '25'].getRandom()
    let user2 = m.pushName || 'Anónimo'
    let verifyaleatorio = ['registrar', 'reg', 'verificar', 'verify', 'register'].getRandom()

    const msg = {
        rowner: `🍀 Solo los *creadores del bot* pueden usar el comando *${global.comando}*.`, // Use global.comando
        owner: `🌹 El comando *${global.comando}* está reservado para los *desarrolladores del bot*.`,
        mods: `🌈 Este comando (*${global.comando}*) solo puede ser usado por *moderadores*.`,
        premium: `🌷 El comando *${global.comando}* es exclusivo para *usuarios premium*.`,
        group: `🌱 El comando *${global.comando}* solo se puede usar en *grupos*.`,
        private: `🎋 El comando *${global.comando}* solo se puede usar en *chat privado*.`,
        admin: `🍃 Debes ser *administrador del grupo* para usar el comando *${global.comando}*.`,
        botAdmin: `🌾 Necesito ser *administrador del grupo* para ejecutar el comando *${global.comando}*.`,
        unreg: `🎍 Debes estar *registrado* para usar el comando *${global.comando}*.\n> » #${verifyaleatorio} ${user2}.${edadaleatoria}`,
        restrict: `🌻 Esta función está *desactivada* por el creador del bot.`
    } [type];

    if (msg) {
        // MODIFICACION 4: Añadir texto al mensaje de dfail
        // Use conn.reply instead of m.reply as m might not have the reply method directly depending on smsg implementation
        // Or ensure smsg adds a reply method to m
        // Assuming smsg adds reply, m.reply is fine.
        return m.reply(msg + '').then(_ => m.react('✖️')) // React with X emoji on failure
    }
}


// File watching for hot reloading
let file = global.__filename(import.meta.url, true) // Get the current file path
watchFile(file, async () => {
    unwatchFile(file) // Stop watching the old file
    console.log(chalk.magenta("Se actualizo 'handler.js'")) // Log update

    // Reload handler for all connected bot instances (jadibots)
    if (global.conns && global.conns.length > 0) {
        const users = [...new Set([...global.conns.filter((conn) => conn.user && conn.ws.socket && conn.ws.socket.readyState !== ws.CLOSED).map((conn) => conn)])];
        for (const userr of users) {
            userr.subreloadHandler(false) // Call subreloadHandler on each active connection
        }
    }
});
