const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { successEmbed, errorEmbed } = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('unban')
    .setDescription('Débannit un utilisateur via son ID')
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .addStringOption(o => o.setName('id').setDescription('ID Discord de l\'utilisateur').setRequired(true)),
  async execute(interaction) {
    const id = interaction.options.getString('id');
    try {
      await interaction.guild.members.unban(id);
      await interaction.reply({ embeds: [successEmbed(`L'utilisateur \`${id}\` a été débanni.`)] });
    } catch {
      await interaction.reply({ embeds: [errorEmbed("Impossible de débannir cet ID (introuvable ou non banni).")], ephemeral: true });
    }
  }
};
