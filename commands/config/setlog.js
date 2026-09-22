const { SlashCommandBuilder, PermissionFlagsBits, ChannelType } = require('discord.js');
const { successEmbed } = require('../../utils/embeds');
const { updateGuild } = require('../../database/db');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setlog')
    .setDescription('Définit le salon de logs de modération')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .addChannelOption(o => o.setName('salon').setDescription('Salon de logs').addChannelTypes(ChannelType.GuildText).setRequired(true)),
  async execute(interaction) {
    const channel = interaction.options.getChannel('salon');
    updateGuild(interaction.guild.id, g => { g.logChannel = channel.id; });
    await interaction.reply({ embeds: [successEmbed(`Salon de logs défini sur ${channel}.`)] });
  }
};
