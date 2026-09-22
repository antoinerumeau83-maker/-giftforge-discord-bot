const { SlashCommandBuilder } = require('discord.js');
const { successEmbed } = require('../../utils/embeds');
const { updateGuild } = require('../../database/db');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('removepremium')
    .setDescription('[Owner] Retire le Premium d\'un serveur')
    .addStringOption(o => o.setName('id_serveur').setDescription('ID du serveur').setRequired(true)),
  ownerOnly: true,
  async execute(interaction) {
    const guildId = interaction.options.getString('id_serveur');
    updateGuild(guildId, g => { g.premium = false; g.premiumExpires = null; });
    await interaction.reply({ embeds: [successEmbed(`Premium retiré pour le serveur \`${guildId}\`.`)], ephemeral: true });
  }
};
