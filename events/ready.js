const { ActivityType } = require('discord.js');

module.exports = {
  name: 'ready',
  once: true,
  execute(client) {
    console.log(`✅ Connecté en tant que ${client.user.tag}`);
    console.log(`📊 Présent sur ${client.guilds.cache.size} serveur(s)`);

    client.user.setPresence({
      activities: [{ name: `${client.commands.size} commandes | /help`, type: ActivityType.Watching }],
      status: 'online'
    });
  }
};
