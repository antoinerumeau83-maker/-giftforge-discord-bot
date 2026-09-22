const { SlashCommandBuilder } = require('discord.js');
const { successEmbed, errorEmbed } = require('../../utils/embeds');
const { updateGuild } = require('../../database/db');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('addpremium')
    .setDescription('[Owner] Active le Premium sur un serveur')
    .addStringOption(o => o.setName('id_serveur').setDescription('ID du serveur').setRequired(true))
    .addIntegerOption(o => o.setName('jours').setDescription('Durée en jours (vide = illimité)')),
  ownerOnly: true,
  async execute(interaction, client) {
    const guildId = interaction.options.getString('id_serveur');
    const days = interaction.options.getInteger('jours');
    const guild = client.guilds.cache.get(guildId);
    if (!guild) return interaction.reply({ embeds: [errorEmbed("Le bot n'est pas présent sur ce serveur.")], ephemeral: true });

    const expires = days ? Date.now() + days * 86400000 : null;
    updateGuild(guildId, g => { g.premium = true; g.premiumExpires = expires; });

    await interaction.reply({ embeds: [successEmbed(`Premium activé pour **${guild.name}**${days ? ` pour ${days} jours` : ' (illimité)'}.`)], ephemeral: true });
  }
};
