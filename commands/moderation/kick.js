const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { successEmbed, errorEmbed } = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('kick')
    .setDescription('Expulse un membre du serveur')
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
    .addUserOption(o => o.setName('membre').setDescription('Membre à expulser').setRequired(true))
    .addStringOption(o => o.setName('raison').setDescription('Raison de l\'expulsion')),
  async execute(interaction) {
    const target = interaction.options.getUser('membre');
    const reason = interaction.options.getString('raison') || 'Aucune raison fournie';
    const member = interaction.guild.members.cache.get(target.id);

    if (!member) return interaction.reply({ embeds: [errorEmbed('Ce membre est introuvable sur ce serveur.')], ephemeral: true });
    if (!member.kickable) return interaction.reply({ embeds: [errorEmbed("Je ne peux pas expulser ce membre (rôle trop élevé).")], ephemeral: true });

    await member.kick(reason);
    await interaction.reply({ embeds: [successEmbed(`**${target.tag}** a été expulsé.\nRaison : ${reason}`)] });
  }
};
