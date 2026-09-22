const { SlashCommandBuilder } = require('discord.js');
const { baseEmbed } = require('../../utils/embeds');
const { loadDB } = require('../../database/db');

function formatUptime(ms) {
  const s = Math.floor(ms / 1000);
  const days = Math.floor(s / 86400);
  const hours = Math.floor((s % 86400) / 3600);
  const minutes = Math.floor((s % 3600) / 60);
  return `${days}j ${hours}h ${minutes}m`;
}

module.exports = {
  data: new SlashCommandBuilder().setName('botstats').setDescription('[Owner] Statistiques détaillées du bot'),
  ownerOnly: true,
  async execute(interaction, client) {
    const db = loadDB();
    const premiumCount = Object.values(db.guilds).filter(g => g.premium).length;
    const totalMembers = client.guilds.cache.reduce((acc, g) => acc + g.memberCount, 0);
    const mem = process.memoryUsage();

    const embed = baseEmbed()
      .setTitle('📊 Statistiques du bot')
      .addFields(
        { name: 'Serveurs', value: `${client.guilds.cache.size}`, inline: true },
        { name: 'Utilisateurs (total)', value: `${totalMembers}`, inline: true },
        { name: 'Serveurs Premium', value: `${premiumCount}`, inline: true },
        { name: 'Commandes chargées', value: `${client.commands.size}`, inline: true },
        { name: 'Latence API', value: `${Math.round(client.ws.ping)}ms`, inline: true },
        { name: 'Uptime', value: formatUptime(client.uptime), inline: true },
        { name: 'Mémoire RAM', value: `${(mem.heapUsed / 1024 / 1024).toFixed(1)} MB`, inline: true },
        { name: 'Node.js', value: process.version, inline: true },
        { name: 'discord.js', value: require('discord.js').version, inline: true }
      );

    await interaction.reply({ embeds: [embed], ephemeral: true });
  }
};
