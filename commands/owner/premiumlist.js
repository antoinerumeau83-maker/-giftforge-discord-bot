const { SlashCommandBuilder } = require('discord.js');
const { baseEmbed } = require('../../utils/embeds');
const { loadDB } = require('../../database/db');

module.exports = {
  data: new SlashCommandBuilder().setName('premiumlist').setDescription('[Owner] Liste les serveurs premium'),
  ownerOnly: true,
  async execute(interaction, client) {
    const db = loadDB();
    const premiumGuilds = Object.entries(db.guilds).filter(([, g]) => g.premium);

    if (premiumGuilds.length === 0) {
      return interaction.reply({ embeds: [baseEmbed().setDescription('Aucun serveur premium actuellement.')], ephemeral: true });
    }

    const desc = premiumGuilds.map(([id, g]) => {
      const guild = client.guilds.cache.get(id);
      const name = guild ? guild.name : id;
      const expiry = g.premiumExpires ? `expire <t:${Math.floor(g.premiumExpires / 1000)}:R>` : 'illimité';
      return `**${name}** (\`${id}\`) — ${expiry}`;
    }).join('\n');

    await interaction.reply({ embeds: [baseEmbed().setTitle(`⭐ Serveurs Premium (${premiumGuilds.length})`).setDescription(desc)], ephemeral: true });
  }
};
