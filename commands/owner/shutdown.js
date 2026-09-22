const { SlashCommandBuilder } = require('discord.js');
const { successEmbed } = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder().setName('shutdown').setDescription('[Owner] Éteint proprement le bot'),
  ownerOnly: true,
  async execute(interaction, client) {
    await interaction.reply({ embeds: [successEmbed('Extinction du bot en cours...')], ephemeral: true });
    client.destroy();
    process.exit(0);
  }
};
