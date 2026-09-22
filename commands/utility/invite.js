const { SlashCommandBuilder } = require('discord.js');
const { baseEmbed } = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder().setName('invite').setDescription("Obtenir le lien d'invitation du bot"),
  async execute(interaction) {
    const link = `https://discord.com/api/oauth2/authorize?client_id=${interaction.client.user.id}&permissions=8&scope=bot%20applications.commands`;
    const embed = baseEmbed().setTitle('🔗 Invite-moi sur ton serveur !').setDescription(`[Clique ici pour m'ajouter](${link})`);
    await interaction.reply({ embeds: [embed] });
  }
};
