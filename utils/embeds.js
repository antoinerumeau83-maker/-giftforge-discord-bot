const { EmbedBuilder } = require('discord.js');
const config = require('../config');

function baseEmbed(color = config.colors.primary) {
  return new EmbedBuilder().setColor(color).setTimestamp();
}

function successEmbed(desc) {
  return baseEmbed(config.colors.success).setDescription(`✅ ${desc}`);
}

function errorEmbed(desc) {
  return baseEmbed(config.colors.error).setDescription(`❌ ${desc}`);
}

function premiumEmbed(desc) {
  return baseEmbed(config.colors.premium).setDescription(`⭐ ${desc}`);
}

module.exports = { baseEmbed, successEmbed, errorEmbed, premiumEmbed };
