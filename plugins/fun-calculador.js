const handler = async (m, { conn, command, text }) => {
  if (!text) return conn.reply(m.chat, `❗ Por favor, menciona a alguien para hacer el test.`, m);

  const percentages = Math.floor(Math.random() * 501);
  let emoji = '';
  let description = '';

  switch (command) {
    case 'gay':
      emoji = '🌈✨';
      if (percentages < 50) {
        description = `😎 *${text.toUpperCase()}* tiene un *${percentages}%* de onda gay.\n> 🕶️ ¡Casi nada, puro estilo straight!`;
      } else if (percentages > 100) {
        description = `🌟 *${text.toUpperCase()}* es un *${percentages}%* arcoíris ambulante ${emoji}.\n> 🌈 ¡Brillando con todo el poder gay!`;
      } else {
        description = `🔥 *${text.toUpperCase()}* marca un *${percentages}%* en el termómetro gay.\n> 💥 Sin duda, el orgullo está presente.`;
      }
      break;

    case 'lesbiana':
      emoji = '💜🎀';
      if (percentages < 50) {
        description = `🌸 *${text.toUpperCase()}* tiene un *${percentages}%* de vibes lesbianas.\n> 🌷 ¡Un poco tímida en el amor!`;
      } else if (percentages > 100) {
        description = `💃 *${text.toUpperCase()}* es un *${percentages}%* huracán lesbiano ${emoji}.\n> 💜 ¡Pura pasión y poder femenino!`;
      } else {
        description = `🌺 *${text.toUpperCase()}* muestra un *${percentages}%* de amor entre chicas.\n> 🌼 ¡Sigue floreciendo el romance!`;
      }
      break;

    case 'pajero':
    case 'pajera':
      emoji = '😈🔥';
      if (percentages < 50) {
        description = `😏 *${text.toUpperCase()}* tiene un *${percentages}%* de nivel fiestero solo.\n> 🕹️ Mejor encuentra otro hobby, ¡hay vida más allá!`;
      } else if (percentages > 100) {
        description = `💦 *${text.toUpperCase()}* es un *${percentages}%* campeón del solo play ${emoji}.\n> 🎮 ¡Experiencia de sobra en solitario!`;
      } else {
        description = `🔥 *${text.toUpperCase()}* alcanza un *${percentages}%* en la escala del placer.\n> 😈 ¡Sigamos en la jugada!`;
      }
      break;

    case 'puto':
    case 'puta':
      emoji = '💥💋';
      if (percentages < 50) {
        description = `😉 *${text.toUpperCase()}* marca un *${percentages}%* en el ranking de seducción.\n> 💌 ¡Sigue intentando conquistar corazones!`;
      } else if (percentages > 100) {
        description = `🔥 *${text.toUpperCase()}* es un *${percentages}%* imán irresistible ${emoji}.\n> 💋 ¡La atracción en su máxima expresión!`;
      } else {
        description = `😘 *${text.toUpperCase()}* tiene un *${percentages}%* de encanto arrollador.\n> 💫 ¡No pares de brillar!`;
      }
      break;

    case 'manco':
    case 'manca':
      emoji = '🦶💨';
      if (percentages < 50) {
        description = `🤡 *${text.toUpperCase()}* tiene un *${percentages}%* de manos flojas.\n> 🛋️ ¡Hora de practicar un poco más!`;
      } else if (percentages > 100) {
        description = `⚡ *${text.toUpperCase()}* es un *${percentages}%* experto inesperado ${emoji}.\n> 🥷 ¡Dominio en el arte del manco!`;
      } else {
        description = `💪 *${text.toUpperCase()}* se defiende con un *${percentages}%* en destreza.\n> 🦾 ¡Sigue mejorando!`;
      }
      break;

    case 'rata':
      emoji = '🧀🐭';
      if (percentages < 50) {
        description = `🐀 *${text.toUpperCase()}* solo tiene un *${percentages}%* de instinto ratonil.\n> 🧀 ¡Nada mal para robar un pedazo de queso!`;
      } else if (percentages > 100) {
        description = `👑 *${text.toUpperCase()}* es un *${percentages}%* rey de las ratas ${emoji}.\n> 🏆 ¡Maestro en escaparse sin dejar rastro!`;
      } else {
        description = `🧹 *${text.toUpperCase()}* tiene un *${percentages}%* en el club de las ratas.\n> 🐾 ¡Siguiendo con el buen queso!`;
      }
      break;

    case 'prostituto':
    case 'prostituta':
      emoji = '💋🤑';
      if (percentages < 50) {
        description = `💼 *${text.toUpperCase()}* tiene un *${percentages}%* en el negocio más antiguo.\n> 💸 ¡A seguir perfeccionando el arte!`;
      } else if (percentages > 100) {
        description = `💃 *${text.toUpperCase()}* es un *${percentages}%* maestro/a del trueque ${emoji}.\n> 🏅 ¡Un/a profesional indiscutible!`;
      } else {
        description = `🎉 *${text.toUpperCase()}* muestra un *${percentages}%* de experiencia en el rubro.\n> 🔥 ¡Nunca es tarde para los negocios!`;
      }
      break;

    default:
      return m.reply(`🚫 Comando desconocido. Usa un comando válido.`);
  }

  const responses = [
    "🎲 El destino ha decidido.",
    "🔮 El oráculo habló.",
    "✨ Resultados inesperados."
  ];

  const response = responses[Math.floor(Math.random() * responses.length)];

  const cal = `🌟 *RESULTADOS DEL TEST* 🌟

${description}

➡️ ${response}`;

  const loadingSteps = [
    "⌛ Calculando... 10%",
    "⏳ Procesando... 30%",
    "⏱️ Casi listo... 60%",
    "⚡ Finalizando... 90%",
    "✅ ¡Listo! 100%"
  ];

  // Envío animación de carga
  const sentMsg = await conn.sendMessage(m.chat, { text: `🚀 Preparando resultados...` }, { quoted: m });

  for (const step of loadingSteps) {
    await new Promise(r => setTimeout(r, 1200));
    await conn.sendMessage(m.chat, { text: step, edit: sentMsg.key, mentions: conn.parseMention(cal) }, { quoted: m });
  }

  await conn.sendMessage(m.chat, { text: cal, mentions: conn.parseMention(cal) }, { quoted: m });
};

handler.help = ['gay <@tag> | <nombre>', 'lesbiana <@tag> | <nombre>', 'pajero <@tag> | <nombre>', 'pajera <@tag> | <nombre>', 'puto <@tag> | <nombre>', 'puta <@tag> | <nombre>', 'manco <@tag> | <nombre>', 'manca <@tag> | <nombre>', 'rata <@tag> | <nombre>', 'prostituta <@tag> | <nombre>', 'prostituto <@tag> | <nombre>'];
handler.tags = ['fun'];
handler.register = true;
handler.group = true;
handler.command = ['gay', 'lesbiana', 'pajero', 'pajera', 'puto', 'puta', 'manco', 'manca', 'rata', 'prostituta', 'prostituto'];

export default handler;