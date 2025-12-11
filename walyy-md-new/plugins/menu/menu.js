import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import menuCh from "../@set/setMenu-1.js";
import menuDoc from "../@set/setMenu-2.js";
import menuteks from "../@set/setMenu-3.js";
import menuThumb3 from "../@set/setMenu-4.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const configPath = new URL("../../toolkit/set/config.json", import.meta.url).pathname;
const dbPath = new URL("../../toolkit/db/database.json", import.meta.url).pathname;

const more = String.fromCharCode(8206);
const readmore = more.repeat(4001);

const handlers = { 1: menuCh, 2: menuDoc, 3: menuteks, 4: menuThumb3 };

const loadConfig = () => JSON.parse(fs.readFileSync(configPath, "utf-8"));

function buildMenu(sender, category, prefix) {
  const freshDb = JSON.parse(fs.readFileSync(dbPath, "utf-8"));
  const totalUser = Object.keys(freshDb.Private || {}).length;

  let txt = `
  
ֵ  ִׂ   ۫  ɛ̼᪲ 𝅄   ִ ᘏʚɞᘏ 🎀᪰ ꫶ ˒˒ᝲ ..
𖠗𖠗‎‎ ‎˒˓ ׁ  ૮꒰ ๑• ﻌ ฅ ๑ ꒱ა ۪  ۫  .. 𝄪
  ᨧ 🩰 ׂ ׅ𝗁𝗈𝗅𝖺𝖺𝖺, 𝖺𝗄𝗎 𝗏𝗂𝗍𝖺𝗅 𝖻𝗈𝗍ִ ៶៸ ׅ  ׂ ˒˓
ׅ ׅ ┈─────┈ ׂ ᨒ ┈─────┈ׂ  ׅ ֺ   ۪  ᘏ  
🍓 ֺada yang bisa aku bantuin buat kamu?ʏᴀɴɢ ʙɪꜱᴀ ʙᴀɴᴛᴜ ᴋᴀᴍᴜ ᴍᴀᴜ ᴄᴀʀɪ ɪɴꜰᴏ, ᴅᴏᴡɴʟᴏᴀᴅ, ᴀᴛᴀᴜ ᴘᴇʀɪɴᴛᴀʜ ʟᴀɪɴ ʙɪʟᴀɴɢɪɴ ᴀᴊᴀᴀ >,<
ֺ   ۪  ᘏ ֺ𝗄𝖾𝗍𝗂𝗄 .𝗆𝖾𝗇𝗎 
ֺ   ۪  ᘏ ֺ𝗰𝗿𝗲ִ𝗱𝗶𝘁𝘀꯭ :: 𝘃ִ𝗶𝘁𝘆𝗮𝗮
ֺ ׅ  ᓕ᪶ᓕ  ֺ  ┄ׅ┄꯭─꯭─꯭ֺ─꯭─꯭┄ׅ┄ ♡  ֺ  ᓓᓓ᪶  ׅ\n\n`;
  txt += `${side} ${btn} 𝖻𝗈𝗍 𝗇𝖺𝗆𝖺: ${botFullName}\n`;
  txt += `${side} ${btn} 𝗈𝗐𝗇𝖾𝗋: ${ownerName}\n`;
  txt += `${side} ${btn} 𝗏𝖾𝗋𝗌𝗂: ${version}\n`;

  const categorized = {};
  for (const [name, plugin] of Object.entries(global.plugins)) {
    if (plugin.__path && plugin.__path.includes("/@set/")) continue;
    const tag = loadConfig().pluginCategories[plugin.tags] ? plugin.tags : "Other Menu";
    (categorized[tag] ||= []).push(name);
  }

  const categories = Object.keys(categorized).sort();

  const formatCommands = (title, commands) => {
    let section = `${head} ${Obrack} *${title}* ${Cbrack}\n`;
    commands.sort().forEach(cmd => {
      const prem = global.plugins[cmd]?.premium ? "" : "";
      section += `${side} ${btn} ${prefix}${cmd}${prem}\n`;
    });
    return section + `${foot}${garis}\n\n`;
  };

  if (category) {
    const matched = categories.find(c => c.toLowerCase().includes(category));
    txt += matched
      ? formatCommands(matched, categorized[matched])
      : `Kategori '${category}' tidak ditemukan!`;
  } else {
    for (const cat of categories) txt += formatCommands(cat, categorized[cat]);
  }

  return txt + `${Obrack} ${footer} ${Cbrack}`;
}

function countPlugins() {
  return Object.values(global.plugins).filter(
    p => !(p.__path && p.__path.includes(path.join("plugins", "@set")))
  ).length;
}

const menuModule = {
  name: "menu",
  command: ["menu", "menuall"],
  tags: "Info Menu",
  desc: "Menampilkan menu sesuai mode",
  prefix: true,

  run: async (conn, msg, ctx) => {
    const config = loadConfig();
    const handler = handlers[config.menuSetting.setMenu];

    if (!handler) {
      return conn.sendMessage(
        ctx.chatInfo.chatId,
        { text: `Mode menu tidak valid. Gunakan setmenu ${Object.keys(handlers).join(" atau ")}` },
        { quoted: msg }
      );
    }

    try {
      const category = ctx.args.join(" ").toLowerCase() || null;
      return handler.run(conn, msg, ctx, buildMenu(ctx.chatInfo.pushName, category, ctx.prefix));
    } catch (e) {
      console.error("Menu error:", e);
      await conn.sendMessage(
        ctx.chatInfo.chatId,
        { text: "Terjadi kesalahan saat membuka menu." },
        { quoted: msg }
      );
    }
  },
};

export default { ...menuModule, handlers };