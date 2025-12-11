import { proto } from '@whiskeysockets/baileys';

export default {
  name: 'back',
  command: ['bck', 'back'],
  tags: 'Group Menu',
  desc: 'Join grup dari link invite atau kirim pesan promosi jika sudah bergabung',
  prefix: true,
  premium: false,

  run: async (conn, msg, { chatInfo }) => {
    const { chatId, senderId } = chatInfo;

    try {
      const { userAdmin } = await exGrup(conn, chatId, senderId);
      if (!userAdmin) {
        return conn.sendMessage(chatId, { text: 'Kamu bukan Admin!' }, { quoted: msg });
      }

      const contextInfo = msg?.message?.extendedTextMessage?.contextInfo;
      const quoted = contextInfo?.quotedMessage;

      let link = quoted?.extendedTextMessage?.matchedText;
      if (!link) {
        const regex = /(https:\/\/chat\.whatsapp\.com\/[0-9A-Za-z]+)/;
        link = quoted?.extendedTextMessage?.text?.match(regex)?.[0];
      }

      if (!link) {
        return conn.sendMessage(chatId, { text: 'Tidak ada link grup valid yang ditemukan di reply.' }, { quoted: msg });
      }

      const inviteCode = link.split('/')[3].split('?')[0];
      const response = await conn.groupGetInviteInfo(inviteCode);

      if (!response) {
        return conn.sendMessage(chatId, { text: 'Tidak bisa mengambil info grup dari link.' }, { quoted: msg });
      }

      const jid = response.id;
      const groups = Object.keys(conn.groupMetadata ? conn.groupMetadata : {});

      const teks = `𝗁𝖺𝗂𝗂 𝗌𝖾𝗆𝗎𝖺 𝗂𝗇𝗂 𝖺𝗄𝗎 𝖻𝗈𝗍 𝗒𝖺𝗐 𝗄𝖺𝗅𝗈 𝗀𝗋𝗈𝗎𝗉 𝗄𝖾𝗌𝗂𝗇𝗂 𝗃𝗈𝗂𝗇 𝗌𝖾𝗋𝗎/𝖺𝗌𝗂𝗄 𝖻𝗂𝗌𝖺 𝖼𝖺𝗋𝗂 𝗍𝖾𝗆𝖾𝗇 𝗃𝗀𝖺
1. 𝗆𝗈𝖻𝗂𝗅𝖾 𝗅𝖾𝗀𝖾𝗇𝖽𝗌 𝗇𝗂 𝗒𝖺𝗐
https://chat.whatsapp.com/INpYEfC4SJN0kpAR2WlnNa?mode=wwt`;

      if (!groups.includes(jid)) {
        await conn.groupAcceptInvite(inviteCode);
        await conn.sendMessage(chatId, { text: `Berhasil join ke grup: ${response.subject}` }, { quoted: msg });
      }

      await conn.sendMessage(jid, { text: teks }, { quoted: msg });
      await conn.sendMessage(chatId, { text: 'Pesan promosi terkirim ke grup tersebut.' }, { quoted: msg });

    } catch (e) {
      return conn.sendMessage(chatId, { text: 'Terjadi error saat memproses link grup.' }, { quoted: msg });
    }
  }
};