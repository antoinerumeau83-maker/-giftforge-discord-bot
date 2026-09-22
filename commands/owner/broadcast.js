const { SlashCommandBuilder } = require('discord.js');
const { baseEmbed, successEmbed } = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('broadcast')
    .setDescription("[Owner] Envoie une annonce sur tous les serveurs (salon système)")
    .addStringOption(o => o.setName('message').setDescription('Message à diffuser').setRequired(true)),
  ownerOnly: true,
  async execute(interaction, client) {
    const message = interaction.options.getString('message');
    await interaction.deferReply({ ephemeral: true });

    let sent = 0, failed = 0;
    const embed = baseEmbed().setTitle('📢 Annonce du développeur').setDescription(message);

    for (const guild of client.guilds.cache.values()) {
      const channel = guild.systemChannel || guild.channels.cache.find(c => c.isTextBased?.() && c.permissionsFor(guild.members.me)?.has('SendMessages'));
      if (!channel) { failed++; continue; }
      try { await channel.send({ embeds: [embed] }); sent++; } catch { failed++; }
    }

    await interaction.editReply({ embeds: [successEmbed(`Annonce envoyée sur **${sent}** serveur(s). Échecs : ${failed}.`)] });
  }
};
