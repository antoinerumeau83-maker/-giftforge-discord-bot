const { SlashCommandBuilder } = require('discord.js');
const { baseEmbed } = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('avatar')
    .setDescription("Affiche l'avatar en grand d'un utilisateur")
    .addUserOption(o => o.setName('utilisateur').setDescription('Utilisateur ciblé').setRequired(false)),
  async execute(interaction) {
    const user = interaction.options.getUser('utilisateur') || interaction.user;
    const embed = baseEmbed().setTitle(`🖼️ Avatar de ${user.username}`).setImage(user.displayAvatarURL({ size: 1024 }));
    await interaction.reply({ embeds: [embed] });
  }
};
