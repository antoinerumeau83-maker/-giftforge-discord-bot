const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { successEmbed } = require('../../utils/embeds');
const { updateGuild } = require('../../database/db');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('warn')
    .setDescription('Donne un avertissement à un membre')
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .addUserOption(o => o.setName('membre').setDescription('Membre concerné').setRequired(true))
    .addStringOption(o => o.setName('raison').setDescription('Raison de l\'avertissement').setRequired(true)),
  async execute(interaction) {
    const target = interaction.options.getUser('membre');
    const reason = interaction.options.getString('raison');

    const guildData = updateGuild(interaction.guild.id, (g) => {
      if (!g.warnings[target.id]) g.warnings[target.id] = [];
      g.warnings[target.id].push({ reason, moderator: interaction.user.tag, date: Date.now() });
    });

    const count = guildData.warnings[target.id].length;
    await interaction.reply({ embeds: [successEmbed(`**${target.tag}** a reçu un avertissement (total : ${count}).\nRaison : ${reason}`)] });

    target.send({ content: `⚠️ Tu as reçu un avertissement sur **${interaction.guild.name}**.\nRaison : ${reason}` }).catch(() => {});
  }
};
