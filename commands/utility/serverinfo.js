const { SlashCommandBuilder, ChannelType } = require('discord.js');
const { baseEmbed } = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder().setName('serverinfo').setDescription('Affiche les informations du serveur'),
  async execute(interaction) {
    const guild = interaction.guild;
    if (!guild) return interaction.reply({ content: "Commande utilisable uniquement sur un serveur.", ephemeral: true });

    const textChannels = guild.channels.cache.filter(c => c.type === ChannelType.GuildText).size;
    const voiceChannels = guild.channels.cache.filter(c => c.type === ChannelType.GuildVoice).size;

    const embed = baseEmbed()
      .setTitle(`📊 ${guild.name}`)
      .setThumbnail(guild.iconURL({ size: 256 }))
      .addFields(
        { name: 'Propriétaire', value: `<@${guild.ownerId}>`, inline: true },
        { name: 'Membres', value: `${guild.memberCount}`, inline: true },
        { name: 'Créé le', value: `<t:${Math.floor(guild.createdTimestamp / 1000)}:D>`, inline: true },
        { name: 'Salons texte', value: `${textChannels}`, inline: true },
        { name: 'Salons vocaux', value: `${voiceChannels}`, inline: true },
        { name: 'Rôles', value: `${guild.roles.cache.size}`, inline: true },
        { name: 'Boosts', value: `${guild.premiumSubscriptionCount ?? 0} (niveau ${guild.premiumTier})`, inline: true }
      );

    await interaction.reply({ embeds: [embed] });
  }
};
