const { SlashCommandBuilder } = require('discord.js');
const { baseEmbed } = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('userinfo')
    .setDescription("Affiche les informations d'un utilisateur")
    .addUserOption(o => o.setName('utilisateur').setDescription('Utilisateur ciblé').setRequired(false)),
  async execute(interaction) {
    const user = interaction.options.getUser('utilisateur') || interaction.user;
    const member = interaction.guild?.members.cache.get(user.id);

    const embed = baseEmbed()
      .setTitle(`👤 ${user.tag}`)
      .setThumbnail(user.displayAvatarURL({ size: 256 }))
      .addFields(
        { name: 'ID', value: user.id, inline: true },
        { name: 'Compte créé le', value: `<t:${Math.floor(user.createdTimestamp / 1000)}:D>`, inline: true }
      );

    if (member) {
      embed.addFields(
        { name: 'A rejoint le', value: `<t:${Math.floor(member.joinedTimestamp / 1000)}:D>`, inline: true },
        { name: 'Rôles', value: member.roles.cache.size > 1 ? member.roles.cache.filter(r => r.id !== interaction.guild.id).map(r => r).join(', ').slice(0, 1000) : 'Aucun' }
      );
    }

    await interaction.reply({ embeds: [embed] });
  }
};
