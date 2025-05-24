// Este código es una adaptación de tu script original para integrarlo con la estructura de tu bot.

import fetch from 'node-fetch';
import yts from 'yt-search';
import axios from 'axios';

// Nota: Las siguientes importaciones de librerías locales
// '../lib/yt-savetube.js', '../lib/youtubedl.js', '../lib/scraper.js'
// y la dependencia '@hiudyy/ytdl' requieren que esos archivos/módulos
// estén presentes y configurados correctamente en tu entorno.
// Si no los tienes, esta parte del código podría no funcionar.
// Es crucial que 'savetube', 'ogmp3', 'amdl' y '@hiudyy/ytdl'
// estén instalados y/o sus archivos 'lib' estén en la ubicación correcta.
import { savetube } from '../lib/yt-savetube.js';
import { ogmp3 } from '../lib/youtubedl.js';
import { amdl } from '../lib/scraper.js';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { ytmp3, ytmp4 } = require("@hiudyy/ytdl");

// Definiciones de límites y expresiones regulares
const LimitAud = 725 * 1024 * 1024; // 725MB
const LimitVid = 425 * 1024 * 1024; // 425MB
const youtubeRegexID = /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([a-zA-Z0-9_-]{11})/;

// Mapas y objetos para manejar solicitudes de usuario (opcional, puedes simplificar si no necesitas esto)
const userCaptions = new Map();
const userRequests = {};

// --- Helper Functions (Funciones auxiliares) ---

// Esta función 'tr' es un placeholder.
// Debes implementarla o reemplazarla con tu sistema de traducción si tu bot lo usa.
// Si no usas traducción, puedes eliminar las llamadas a `tr` o definirlas como `async (text) => text;`
async function tr(text) {
    // Aquí iría tu lógica de traducción
    return text;
}

function secondString(seconds) {
    seconds = Number(seconds);
    const d = Math.floor(seconds / (3600 * 24));
    const h = Math.floor((seconds % (3600 * 24)) / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    const dDisplay = d > 0 ? d + (d == 1 ? ' día, ' : ' días, ') : '';
    const hDisplay = h > 0 ? h + (h == 1 ? ' hora, ' : ' horas, ') : '';
    const mDisplay = m > 0 ? m + (m == 1 ? ' minuto, ' : ' minutos, ') : '';
    const sDisplay = s > 0 ? s + (s == 1 ? ' segundo' : ' segundos') : '';
    return dDisplay + hDisplay + mDisplay + sDisplay;
}

async function getFileSize(url) {
    try {
        const response = await fetch(url, { method: 'HEAD' });
        const contentLength = response.headers.get('content-length');
        return contentLength ? parseInt(contentLength) : 0;
    } catch {
        return 0; // Si falla, asumimos 0
    }
}

// --- API Definitions (Definiciones de APIs) ---

// Define las APIs que utilizas. Asegúrate de tener las URLs y claves correctas.
// Si 'APIs' es un objeto global en tu bot, no necesitas definirlo aquí.
const APIs = {
    neoxr: { url: 'https://api.neoxr.eu', key: 'YOUR_NEOXR_API_KEY' }, // <-- Reemplaza con tu clave
    fgmods: { url: 'https://api.fgmods.xyz', key: 'YOUR_FGMODS_API_KEY' }, // <-- Reemplaza con tu clave
    // Si 'apis' es otra variable para una API, defínela aquí también
    // apis: 'https://otra-api-ejemplo.com'
};

const audioApis = [
    { url: (videoUrl, format) => savetube.download(videoUrl, format), extract: (data) => ({ data: data.result.download, isDirect: false }) },
    { url: (videoUrl, selectedQuality) => ogmp3.download(videoUrl, selectedQuality, 'audio'), extract: (data) => ({ data: data.result.download, isDirect: false }) },
    { url: (videoUrl) => ytmp3(videoUrl), extract: (data) => ({ data, isDirect: true }) },
    { url: (videoUrl) => amdl.download(videoUrl, "720p"), extract: (data) => ({ data: data.result.download, isDirect: false }) },
    { url: (videoUrl) => fetch(`https://api.dorratz.com/v3/ytdl?url=${videoUrl}`).then(res => res.json()), extract: (data) => {
        const mp3 = data.medias.find(media => media.quality === "160kbps" && media.extension === "mp3");
        return { data: mp3?.url, isDirect: false }
    }},
    { url: (videoUrl) => fetch(`${APIs.neoxr.url}/youtube?url=${videoUrl}&type=audio&quality=128kbps&apikey=${APIs.neoxr.key}`).then(res => res.json()), extract: (data) => ({ data: data.data.url, isDirect: false }) },
    { url: (videoUrl) => fetch(`https://api.fgmods.xyz/api/downloader/ytmp4?url=${videoUrl}&apikey=${APIs.fgmods.key}`).then(res => res.json()), extract: (data) => ({ data: data.result.dl_url, isDirect: false }) },
    { url: (videoUrl) => fetch(`https://api.siputzx.my.id/api/d/ytmp4?url=${videoUrl}`).then(res => res.json()), extract: (data) => ({ data: data.dl, isDirect: false }) },
    // { url: (videoUrl) => fetch(`${apis}/download/ytmp3?url=${videoUrl}`).then(res => res.json()), extract: (data) => ({ data: data.status ? data.data.download.url : null, isDirect: false }) }, // Descomentar y definir 'apis' si lo usas
    { url: (videoUrl) => fetch(`https://api.zenkey.my.id/api/download/ytmp3?apikey=zenkey&url=${videoUrl}`).then(res => res.json()), extract: (data) => ({ data: data.result.download.url, isDirect: false }) },
    { url: (videoUrl, title) => fetch(`https://exonity.tech/api/dl/playmp3?query=${title}`).then(res => res.json()), extract: (data) => ({ data: data.result.download, isDirect: false })
    }
];

const videoApis = [
    { url: (videoUrl) => savetube.download(videoUrl, '720'), extract: (data) => ({ data: data.result.download, isDirect: false }) },
    { url: (videoUrl, selectedQuality) => ogmp3.download(videoUrl, selectedQuality, 'video'), extract: (data) => ({ data: data.result.download, isDirect: false }) },
    { url: (videoUrl) => ytmp4(videoUrl), extract: (data) => ({ data, isDirect: true }) },
    { url: (videoUrl) => amdl.download(videoUrl, '720p'), extract: (data) => ({ data: data.result.download, isDirect: false }) },
    { url: (videoUrl) => fetch(`https://api.siputzx.my.id/api/d/ytmp4?url=${videoUrl}`).then(res => res.json()), extract: (data) => ({ data: data.dl, isDirect: false }) },
    { url: (videoUrl) => fetch(`${APIs.neoxr.url}/youtube?url=${videoUrl}&type=video&quality=720p&apikey=${APIs.neoxr.key}`).then(res => res.json()), extract: (data) => ({ data: data.data.url, isDirect: false }) },
    { url: (videoUrl) => fetch(`https://api.fgmods.xyz/api/downloader/ytmp4?url=${videoUrl}&apikey=${APIs.fgmods.key}`).then(res => res.json()), extract: (data) => ({ data: data.result.dl_url, isDirect: false }) },
    // { url: (videoUrl) => fetch(`${apis}/download/ytmp4?url=${encodeURIComponent(videoUrl)}`).then(res => res.json()), extract: (data) => ({ data: data.status ? data.data.download.url : null, isDirect: false }) }, // Descomentar y definir 'apis' si lo usas
    { url: (videoUrl, title) => fetch(`https://exonity.tech/api/dl/playmp4?query=${encodeURIComponent(title)}`).then(res => res.json()), extract: (data) => ({ data: data.result.download, isDirect: false })
    }
];

const downloadMediaFromAPIs = async (apis, videoUrl, title, selectedQuality, format) => {
    let mediaData = null;
    let isDirect = false;
    for (const api of apis) {
        try {
            // Asegúrate de pasar los parámetros correctos a cada API URL.
            // Algunas APIs solo necesitan la URL del video, otras el título, etc.
            const data = await api.url(videoUrl, title, selectedQuality, format);
            const { data: extractedData, isDirect: direct } = api.extract(data);
            if (extractedData) {
                const size = await getFileSize(extractedData);
                // Si la API devuelve un tamaño válido (mayor a 0), úsala
                if (size > 0) { // Modificado para que siempre intente descargar si hay URL
                    mediaData = extractedData;
                    isDirect = direct;
                    break;
                }
            }
        } catch (e) {
            console.log(`Error con API: ${e.message}`); // Muestra el mensaje de error para depuración
            continue;
        }
    }
    return { mediaData, isDirect };
};

// --- Handler (Manejador principal del comando) ---

const handler = async (m, { conn, command, args, text, usedPrefix }) => {
    // 1. Validar la entrada del usuario
    if (!text) {
        return m.reply(`*> ❀ ${await tr("Que está buscando?")} ❀*\n*${await tr("Ingrese el nombre de la canción")}*\n\n*${await tr("Ejemplo:")}*\n${usedPrefix + command} El perdedor - Aventura`);
    }

    // 2. Determinar el tipo de descarga
    const tipoDescarga = command === 'play' || command === 'musica' ? 'audio' :
                         command === 'play2' || command === 'video' ? 'video' :
                         command === 'play3' || command === 'playdoc' ? 'audio (documento)' :
                         command === 'play4' || command === 'playdoc2' ? 'video (documento)' : '';

    // 3. Control de solicitudes concurrentes
    if (userRequests[m.sender]) {
        return await conn.reply(m.chat, `> ❀ ${await tr("Hey")} @${m.sender.split('@')[0]} ${await tr("espera pendejo, ya estás descargando algo")} ❀\n${await tr("Espera a que termine tu solicitud actual antes de hacer otra...")}`, userCaptions.get(m.sender) || m);
    }
    userRequests[m.sender] = true; // Marca que el usuario está haciendo una solicitud

    try {
        // 4. Buscar el video de YouTube
        let videoIdToFind = text.match(youtubeRegexID);
        let yt_play;
        let ytplay2;

        if (videoIdToFind) {
            // Si es un ID de YouTube, busca directamente por ID
            const videoId = videoIdToFind[1];
            const searchResult = await yts({ videoId: videoId });
            yt_play = [searchResult]; // Envuelve el resultado en un array para compatibilidad
            ytplay2 = searchResult;
        } else {
            // Si es texto, realiza una búsqueda
            const searchResults = await yts.search({ query: text, hl: 'es', gl: 'ES' });
            if (!searchResults.videos.length) {
                await m.reply("❌ No encontré resultados para tu búsqueda.");
                return;
            }
            yt_play = searchResults.videos; // Usa el primer resultado de la búsqueda para yt_play
            ytplay2 = searchResults.videos[0]; // Asegúrate de que ytplay2 sea el primer video para la información
        }

        if (!yt_play || !yt_play[0] || !yt_play[0].url) {
            await m.reply("❌ No se pudo obtener información del video de YouTube.");
            return;
        }

        // 5. Enviar mensaje de información del video
        const PlayText = await conn.sendMessage(m.chat, {
            text: `${yt_play[0].title}\n*⇄ㅤ     ◁   ㅤ  ❚❚ㅤ     ▷ㅤ     ↻*\n\n*> ❀ ${await tr("Duración")}:* ${secondString(yt_play[0].duration.seconds)}\n*> ❀ ${await tr("Aguarde un momento en lo que envío su")} ${tipoDescarga}*`,
            contextInfo: {
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363198641161536@newsletter',
                    serverMessageId: '',
                    newsletterName: 'Hokaru Hidaka - Powered @Alba070503'
                },
                forwardingScore: 9999999,
                isForwarded: true,
                mentionedJid: null,
                externalAdReply: {
                    showAdAttribution: true,
                    renderLargerThumbnail: true,
                    title: yt_play[0].title,
                    body: "wm", // Define 'wm' o cámbialo a un valor fijo
                    containsAutoReply: true,
                    mediaType: 1,
                    thumbnailUrl: yt_play[0].thumbnail,
                    sourceUrl: ["nna", "nna2", "nnaa"].getRandom() // Define 'nna', 'nna2', 'nnaa' o cámbialo a un valor fijo
                }
            }
        }, { quoted: m });
        userCaptions.set(m.sender, PlayText);

        // 6. Determinar calidad y formato
        const [_, qualityInput = command === 'play' || command === 'musica' || command === 'play3' ? '320' : '720'] = text.split(' ');
        const audioQualities = ['64', '96', '128', '192', '256', '320'];
        const videoQualities = ['240', '360', '480', '720', '1080'];
        const isAudioCommand = command === 'play' || command === 'musica' || command === 'play3';
        const selectedQuality = (isAudioCommand ? audioQualities : videoQualities).includes(qualityInput) ? qualityInput : (isAudioCommand ? '320' : '720');
        const format = isAudioCommand ? 'mp3' : 'mp4'; // O '720' para video si es un formato específico

        // 7. Descargar y enviar el archivo
        const videoUrl = yt_play[0].url;
        const title = yt_play[0].title;
        let mediaResult;

        if (isAudioCommand) { // Comandos de audio
            mediaResult = await downloadMediaFromAPIs(audioApis, videoUrl, title, selectedQuality, format);
        } else { // Comandos de video
            mediaResult = await downloadMediaFromAPIs(videoApis, videoUrl, title, selectedQuality, format);
        }

        const { mediaData, isDirect } = mediaResult;

        if (mediaData) {
            const fileSize = await getFileSize(mediaData);

            if (command === 'play' || command === 'musica') { // Audio normal
                if (fileSize > LimitAud) {
                    await conn.sendMessage(m.chat, { document: isDirect ? mediaData : { url: mediaData }, mimetype: 'audio/mpeg', fileName: `${title}.mp3` }, { quoted: m });
                } else {
                    await conn.sendMessage(m.chat, { audio: isDirect ? mediaData : { url: mediaData }, mimetype: 'audio/mpeg' }, { quoted: m });
                }
            } else if (command === 'play2' || command === 'video') { // Video normal
                const messageOptions = { fileName: `${title}.mp4`, caption: `> ❀ ${await tr("Aquí está tu video")}\n❀ ${await tr("Título")}: ${title}`, mimetype: 'video/mp4' };
                if (fileSize > LimitVid) {
                    await conn.sendMessage(m.chat, { document: isDirect ? mediaData : { url: mediaData }, ...messageOptions }, { quoted: m });
                } else {
                    await conn.sendMessage(m.chat, { video: isDirect ? mediaData : { url: mediaData }, thumbnail: yt_play[0].thumbnail, ...messageOptions }, { quoted: m });
                }
            } else if (command === 'play3' || command === 'playdoc') { // Audio como documento
                await conn.sendMessage(m.chat, { document: isDirect ? mediaData : { url: mediaData }, mimetype: 'audio/mpeg', fileName: `${title}.mp3`}, { quoted: m });
            } else if (command === 'play4' || command === 'playdoc2') { // Video como documento
                await conn.sendMessage(m.chat, { document: isDirect ? mediaData : { url: mediaData }, fileName: `${title}.mp4`, caption: `> ❀${await tr("Título")}: ${title}`, thumbnail: yt_play[0].thumbnail, mimetype: 'video/mp4'}, { quoted: m })
            }
        } else {
            await m.react('❌');
            await m.reply(`❌ ${await tr("No se pudo descargar el archivo.")} ${await tr("Intenta de nuevo más tarde o con otra búsqueda.")}`);
        }

    } catch (error) {
        console.error("Error en el handler:", error);
        m.react("❌️");
        m.reply(`❌ ${await tr("Ha ocurrido un error al procesar tu solicitud.")}\n${error.message}`);
    } finally {
        // 8. Liberar el bloqueo del usuario
        delete userRequests[m.sender];
        userCaptions.delete(m.sender); // Limpia también la caption del usuario
    }
};

// --- Command and Tag Definitions (Definiciones de comandos y etiquetas) ---

handler.help = ['play', 'play2', 'play3', 'play4', 'playdoc', 'playdoc2'];
handler.tags = ['downloader'];
handler.command = ['play', 'play2', 'play3', 'play4', 'audio', 'video', 'playdoc', 'playdoc2', 'musica'];
handler.register = true; // Asumiendo que 'register' es una propiedad de tu bot para comandos.

export default handler;

// --- Extension of Array Prototype (Extensión del prototipo de Array) ---
// Asegúrate de que esta extensión esté definida globalmente en tu bot o en un archivo de utilidad
if (!Array.prototype.getRandom) {
    Array.prototype.getRandom = function() {
        return this[Math.floor(Math.random() * this.length)];
    };
}
