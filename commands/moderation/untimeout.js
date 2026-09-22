const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { successEmbed, errorEmbed } = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('untimeout')
    .setDescription('Retire le timeout d\'un membre')
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .addUserOption(o => o.setName('membre').setDescription('Membre concerné').setRequired(true)),
  async execute(interaction) {
    const target = interaction.options.getUser('membre');
    const member = interaction.guild.members.cache.get(target.id);
    if (!member) return interaction.reply({ embeds: [errorEmbed('Ce membre est introuvable.')], ephemeral: true });

    await member.timeout(null);
    await interaction.reply({ embeds: [successEmbed(`Le timeout de **${target.tag}** a été retiré.`)] });
  }
};
