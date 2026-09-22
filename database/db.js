const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, 'db.json');

function loadDB() {
  if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, JSON.stringify({ guilds: {} }, null, 2));
  }
  return JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
}

function saveDB(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

function ensureGuild(guildId) {
  const db = loadDB();
  if (!db.guilds[guildId]) {
    db.guilds[guildId] = {
      premium: false,
      premiumExpires: null,
      logChannel: null,
      welcome: { enabled: false, channelId: null, message: 'Bienvenue {user} sur **{server}** ! Tu es le membre #{count} 🎉' },
      goodbye: { enabled: false, channelId: null, message: '{user} a quitté **{server}**. 👋' },
      warnings: {}
    };
    saveDB(db);
  }
  return db.guilds[guildId];
}

function getGuild(guildId) {
  return ensureGuild(guildId);
}

function updateGuild(guildId, updater) {
  const db = loadDB();
  ensureGuild(guildId);
  updater(db.guilds[guildId]);
  saveDB(db);
  return db.guilds[guildId];
}

function isPremium(guildId) {
  const g = getGuild(guildId);
  if (!g.premium) return false;
  if (g.premiumExpires && Date.now() > g.premiumExpires) {
    updateGuild(guildId, (gg) => { gg.premium = false; gg.premiumExpires = null; });
    return false;
  }
  return true;
}

module.exports = { loadDB, saveDB, ensureGuild, getGuild, updateGuild, isPremium };
