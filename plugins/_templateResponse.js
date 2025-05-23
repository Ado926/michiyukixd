const { areJidsSameUser } = (await import('@whiskeysockets/baileys')).default;

export async function all(m, chatUpdate) {
  if (m.isBaileys || !m.message) return;

  let id = null;

  if (m.message.buttonsResponseMessage) {
    id = m.message.buttonsResponseMessage.selectedButtonId;
    m.text = id;
  } else if (m.message.templateButtonReplyMessage) {
    id = m.message.templateButtonReplyMessage.selectedId;
    m.text = id;
  } else if (m.message.listResponseMessage) {
    id = m.message.listResponseMessage.singleSelectReply?.selectedRowId;
    m.text = id;
  } else if (m.message.interactiveResponseMessage) {
    try {
      const params = JSON.parse(m.message.interactiveResponseMessage.nativeFlowResponseMessage.paramsJson);
      id = params.id;
      m.text = id;
    } catch (e) {
      console.error('Error al procesar interactiveResponseMessage:', e);
      return;
    }
  }

  // Si no es uno de esos tipos, no hacer nada
  if (!id) return;
}