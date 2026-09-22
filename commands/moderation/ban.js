const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { successEmbed, errorEmbed } = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Bannit un membre du serveur')
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .addUserOption(o => o.setName('membre').setDescription('Membre à bannir').setRequired(true))
    .addStringOption(o => o.setName('raison').setDescription('Raison du bannissement'))
    .addIntegerOption(o => o.setName('jours_messages').setDescription('Supprimer les messages des X derniers jours (0-7)').setMinValue(0).setMaxValue(7)),
  async execute(interaction) {
    const target = interaction.options.getUser('membre');
    const reason = interaction.options.getString('raison') || 'Aucune raison fournie';
    const days = interaction.options.getInteger('jours_messages') || 0;
    const member = interaction.guild.members.cache.get(target.id);

    if (member && !member.bannable) return interaction.reply({ embeds: [errorEmbed("Je ne peux pas bannir ce membre (rôle trop élevé).")], ephemeral: true });

    await interaction.guild.members.ban(target.id, { deleteMessageSeconds: days * 86400, reason });
    await interaction.reply({ embeds: [successEmbed(`**${target.tag}** a été banni.\nRaison : ${reason}`)] });
  }
};
