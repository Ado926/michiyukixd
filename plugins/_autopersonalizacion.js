import axios from 'axios';
import crypto from 'crypto';
import yts from 'yt-search';

const savetube = {
  api: {
    base: "https://media.savetube.me/api",
    cdn: "/random-cdn",
    info: "/v2/info", 
    download: "/download"
  },
  headers: {
    'accept': '*/*',
    'content-type': 'application/json',
    'origin': 'https://yt.savetube.me',
    'referer': 'https://yt.savetube.me/',
    'user-agent': 'Postify/1.0.0'
  },
  formats: ['144', '240', '360', '480', '720', '1080', 'mp3'],

  crypto: {
    hexToBuffer: hex => Buffer.from(hex.match(/.{1,2}/g).join(''), 'hex'),

    decrypt: async (enc) => {
      try {
        const secretKey = 'C5D58EF67A7584E4A29F6C35BBC4EB12';
        const data = Buffer.from(enc, 'base64');
        const iv = data.slice(0, 16);
        const content = data.slice(16);
        const key = savetube.crypto.hexToBuffer(secretKey);
        
        const decipher = crypto.createDecipheriv('aes-128-cbc', key, iv);
        let decrypted = decipher.update(content);
        decrypted = Buffer.concat([decrypted, decipher.final()]);
        
        return JSON.parse(decrypted.toString());
      } catch (error) {
        throw new Error(`${error.message}`);
      }
    }
  },

  isUrl: str => {
    try { new URL(str); return true; } catch { return false; }
  },

  youtube: url => {
    if (!url) return null;
    const patterns = [
      /youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/,
      /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
      /youtube\.com\/v\/([a-zA-Z0-9_-]{11})/,
      /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
      /youtu\.be\/([a-zA-Z0-9_-]{11})/
    ];
    for (let pattern of patterns) {
      if (pattern.test(url)) return url.match(pattern)[1];
    }
    return null;
  },

  request: async (endpoint, data = {}, method = 'post') => {
    try {
      const { data: response } = await axios({
        method,
        url: `${endpoint.startsWith('http') ? '' : savetube.api.base}${endpoint}`,
        data: method === 'post' ? data : undefined,
        params: method === 'get' ? data : undefined,
        headers: savetube.headers
      });
      return { status: true, code: 200, data: response };
    } catch (error) {
      return {
        status: false,
        code: error.response?.status || 500,
        error: error.message
      };
    }
  },

  getCDN: async () => {
    const response = await savetube.request(savetube.api.cdn, {}, 'get');
    if (!response.status) return response;
    return { status: true, code: 200, data: response.data.cdn };
  },

  download: async (link, format) => {
    if (!link || !savetube.isUrl(link)) {
      return { status: false, code: 400, error: "Enlace inválido." };
    }
    if (!format || !savetube.formats.includes(format)) {
      return { status: false, code: 400, error: "Formato no válido.", available_fmt: savetube.formats };
    }

    const id = savetube.youtube(link);
    if (!id) return { status: false, code: 400, error: "ID de video no válido." };

    try {
      const cdnData = await savetube.getCDN();
      if (!cdnData.status) return cdnData;
      const cdn = cdnData.data;

      const infoRes = await savetube.request(`https://${cdn}${savetube.api.info}`, {
        url: `https://www.youtube.com/watch?v=${id}`
      });
      if (!infoRes.status) return infoRes;

      const decrypted = await savetube.crypto.decrypt(infoRes.data.data);

      const downloadRes = await savetube.request(`https://${cdn}${savetube.api.download}`, {
        id,
        downloadType: format === 'mp3' ? 'audio' : 'video',
        quality: format === 'mp3' ? '128' : format,
        key: decrypted.key
      });

      return {
        status: true,
        code: 200,
        result: {
          title: decrypted.title || "Desconocido",
          type: format === 'mp3' ? 'audio' : 'video',
          format,
          thumbnail: decrypted.thumbnail || `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`,
          download: downloadRes.data.data.downloadUrl,
          id,
          key: decrypted.key,
          duration: decrypted.duration,
          quality: format === 'mp3' ? '128' : format,
          downloaded: downloadRes.data.data.downloaded || false
        }
      };

    } catch (err) {
      return { status: false, code: 500, error: err.message };
    }
  }
};

const formatDuration = (seconds) => {
  if (!seconds || isNaN(seconds) || seconds <= 0) return 'Desconocida';
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return [
    h > 0 ? h.toString().padStart(2, '0') : null,
    m.toString().padStart(2, '0'),
    s.toString().padStart(2, '0')
  ].filter(Boolean).join(':');
};

const handler = async (m, { conn, args, command }) => {
  if (!args[0]) return m.reply(`Formato:\n- *.play <texto o URL>*\n- *.play2 <texto o URL>*`);

  let query = args.join(' ');
  let url = savetube.isUrl(query) ? query : null;

  if (!url) {
    const search = await yts(query);
    if (!search.videos.length) return m.reply('*No se encontraron resultados.*');
    url = search.videos[0].url;
  }

  const format = command === 'play' ? 'mp3' : '360';

  try {
    const res = await savetube.download(url, format);
    if (!res.status) return m.reply(`*Error:* ${res.error}`);

    const { title, download, type, thumbnail, duration, quality } = res.result;
    const durFormatted = formatDuration(duration);

    // Reacción anticipada
    conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } });

    // Enviar detalles primero
    await conn.sendMessage(m.chat, {
      image: { url: thumbnail },
      caption: `
> ┆✰︴ *DETALLES DEL VIDEO* ︴✰┆

*${title}*

> ❒ *Tipo:* ${type === 'audio' ? 'Audio ☔' : `Video 🍁 (${quality}p)`}
> ❒ *Duración:* ${durFormatted}
> ❒ *Enlace:* ${url}
      `.trim()
    }, { quoted: m });

    // Enviar media rápida
    if (type === 'video') {
      conn.sendMessage(m.chat, { video: { url: download } }, { quoted: m });
    } else {
      conn.sendMessage(m.chat, {
        audio: { url: download },
        mimetype: 'audio/mpeg',
        fileName: `${title}.mp3`
      }, { quoted: m });
    }

  } catch (e) {
    m.reply('*Error al procesar la solicitud.*');
  }
};

handler.help = ['play', 'play2'];
handler.command = ['play', 'play2'];
handler.tags = ['downloader'];

export default handler;
