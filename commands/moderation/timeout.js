const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { successEmbed, errorEmbed } = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('timeout')
    .setDescription('Réduit un membre au silence temporairement')
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .addUserOption(o => o.setName('membre').setDescription('Membre concerné').setRequired(true))
    .addIntegerOption(o => o.setName('minutes').setDescription('Durée en minutes').setRequired(true).setMinValue(1).setMaxValue(40320))
    .addStringOption(o => o.setName('raison').setDescription('Raison')),
  async execute(interaction) {
    const target = interaction.options.getUser('membre');
    const minutes = interaction.options.getInteger('minutes');
    const reason = interaction.options.getString('raison') || 'Aucune raison fournie';
    const member = interaction.guild.members.cache.get(target.id);

    if (!member) return interaction.reply({ embeds: [errorEmbed('Ce membre est introuvable.')], ephemeral: true });
    if (!member.moderatable) return interaction.reply({ embeds: [errorEmbed('Je ne peux pas timeout ce membre (rôle trop élevé).')], ephemeral: true });

    await member.timeout(minutes * 60 * 1000, reason);
    await interaction.reply({ embeds: [successEmbed(`**${target.tag}** est en timeout pour **${minutes} min**.\nRaison : ${reason}`)] });
  }
};
