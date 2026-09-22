const { SlashCommandBuilder } = require('discord.js');
const { baseEmbed } = require('../../utils/embeds');
const { getGuild, isPremium } = require('../../database/db');
const config = require('../../config');

module.exports = {
  data: new SlashCommandBuilder().setName('premium-status').setDescription('Affiche le statut premium du serveur'),
  async execute(interaction) {
    const g = getGuild(interaction.guild.id);
    const premium = isPremium(interaction.guild.id);

    const embed = baseEmbed(premium ? config.colors.premium : config.colors.primary)
      .setTitle('⭐ Statut Premium')
      .setDescription(premium
        ? `Ce serveur est **Premium** !${g.premiumExpires ? `\nExpire <t:${Math.floor(g.premiumExpires / 1000)}:R>` : '\n(illimité)'}`
        : "Ce serveur n'est pas Premium.\nLe Premium débloque des commandes et fonctionnalités exclusives (embeds personnalisés, etc.).");

    await interaction.reply({ embeds: [embed] });
  }
};
