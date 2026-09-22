const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const { errorEmbed } = require('../../utils/embeds');
const { getGuild } = require('../../database/db');
const config = require('../../config');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('welcometest')
    .setDescription('Teste le message de bienvenue actuel')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
  async execute(interaction) {
    const g = getGuild(interaction.guild.id);
    if (!g.welcome.enabled || !g.welcome.channelId) {
      return interaction.reply({ embeds: [errorEmbed('Le système de bienvenue est désactivé. Configure-le avec `/setwelcome activer`.')], ephemeral: true });
    }

    const member = interaction.member;
    const text = g.welcome.message
      .replaceAll('{user}', `${member}`)
      .replaceAll('{username}', member.user.username)
      .replaceAll('{server}', interaction.guild.name)
      .replaceAll('{count}', interaction.guild.memberCount.toString());

    const embed = new EmbedBuilder()
      .setColor(config.colors.success)
      .setTitle('🎉 Nouveau membre ! (test)')
      .setDescription(text)
      .setThumbnail(member.user.displayAvatarURL({ size: 256 }))
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  }
};
