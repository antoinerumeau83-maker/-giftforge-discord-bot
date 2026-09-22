const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { baseEmbed } = require('../../utils/embeds');
const { getGuild } = require('../../database/db');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('warnings')
    .setDescription("Affiche les avertissements d'un membre")
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .addUserOption(o => o.setName('membre').setDescription('Membre concerné').setRequired(true)),
  async execute(interaction) {
    const target = interaction.options.getUser('membre');
    const g = getGuild(interaction.guild.id);
    const warnings = g.warnings[target.id] || [];

    if (warnings.length === 0) {
      return interaction.reply({ embeds: [baseEmbed().setDescription(`**${target.tag}** n'a aucun avertissement.`)] });
    }

    const desc = warnings.map((w, idx) => `**${idx + 1}.** ${w.reason} — *par ${w.moderator}* (<t:${Math.floor(w.date / 1000)}:R>)`).join('\n');
    await interaction.reply({ embeds: [baseEmbed().setTitle(`⚠️ Avertissements de ${target.tag}`).setDescription(desc)] });
  }
};
