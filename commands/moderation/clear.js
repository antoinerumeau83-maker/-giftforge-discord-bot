const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { successEmbed } = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('clear')
    .setDescription('Supprime un nombre de messages dans le salon')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .addIntegerOption(o => o.setName('nombre').setDescription('Nombre de messages (1-100)').setRequired(true).setMinValue(1).setMaxValue(100)),
  async execute(interaction) {
    const amount = interaction.options.getInteger('nombre');
    const deleted = await interaction.channel.bulkDelete(amount, true);
    await interaction.reply({ embeds: [successEmbed(`**${deleted.size}** messages supprimés.`)], ephemeral: true });
  }
};
