const { SlashCommandBuilder } = require('discord.js');
const { baseEmbed } = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder().setName('ping').setDescription('Affiche la latence du bot'),
  async execute(interaction) {
    const sent = await interaction.reply({ content: '🏓 Calcul...', fetchReply: true });
    const latency = sent.createdTimestamp - interaction.createdTimestamp;
    const embed = baseEmbed()
      .setTitle('🏓 Pong !')
      .addFields(
        { name: 'Latence message', value: `${latency}ms`, inline: true },
        { name: 'Latence API', value: `${Math.round(interaction.client.ws.ping)}ms`, inline: true }
      );
    await interaction.editReply({ content: null, embeds: [embed] });
  }
};
