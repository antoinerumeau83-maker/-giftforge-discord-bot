const { SlashCommandBuilder, PermissionFlagsBits, ChannelType } = require('discord.js');
const { successEmbed } = require('../../utils/embeds');
const { updateGuild } = require('../../database/db');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setwelcome')
    .setDescription('Configure le système de bienvenue')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .addSubcommand(sc => sc.setName('activer')
      .setDescription('Active le message de bienvenue')
      .addChannelOption(o => o.setName('salon').setDescription('Salon des messages de bienvenue').addChannelTypes(ChannelType.GuildText).setRequired(true)))
    .addSubcommand(sc => sc.setName('desactiver').setDescription('Désactive le message de bienvenue'))
    .addSubcommand(sc => sc.setName('message')
      .setDescription('Personnalise le message (variables : {user} {username} {server} {count})')
      .addStringOption(o => o.setName('texte').setDescription('Nouveau message').setRequired(true))),
  async execute(interaction) {
    const sub = interaction.options.getSubcommand();

    if (sub === 'activer') {
      const channel = interaction.options.getChannel('salon');
      updateGuild(interaction.guild.id, g => { g.welcome.enabled = true; g.welcome.channelId = channel.id; });
      return interaction.reply({ embeds: [successEmbed(`Bienvenue activée dans ${channel}.`)] });
    }
    if (sub === 'desactiver') {
      updateGuild(interaction.guild.id, g => { g.welcome.enabled = false; });
      return interaction.reply({ embeds: [successEmbed('Message de bienvenue désactivé.')] });
    }
    if (sub === 'message') {
      const texte = interaction.options.getString('texte');
      updateGuild(interaction.guild.id, g => { g.welcome.message = texte; });
      return interaction.reply({ embeds: [successEmbed('Message de bienvenue mis à jour.')] });
    }
  }
};
