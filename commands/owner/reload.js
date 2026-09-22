const { SlashCommandBuilder } = require('discord.js');
const { successEmbed, errorEmbed } = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder().setName('reload').setDescription('[Owner] Recharge toutes les commandes sans redémarrer le bot'),
  ownerOnly: true,
  async execute(interaction, client) {
    try {
      client.reloadCommands();
      await interaction.reply({ embeds: [successEmbed(`**${client.commands.size}** commandes rechargées avec succès.`)], ephemeral: true });
    } catch (err) {
      await interaction.reply({ embeds: [errorEmbed(`Erreur lors du rechargement : ${err.message}`)], ephemeral: true });
    }
  }
};
