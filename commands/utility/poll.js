const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { baseEmbed } = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('poll')
    .setDescription('Crée un sondage rapide avec boutons Oui/Non')
    .addStringOption(o => o.setName('question').setDescription('La question du sondage').setRequired(true)),
  async execute(interaction) {
    const question = interaction.options.getString('question');
    let yes = 0, no = 0;
    const voters = new Set();

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId('poll_yes').setLabel('👍 Oui').setStyle(ButtonStyle.Success),
      new ButtonBuilder().setCustomId('poll_no').setLabel('👎 Non').setStyle(ButtonStyle.Danger)
    );

    const embed = baseEmbed().setTitle('📊 Sondage').setDescription(question).setFooter({ text: `Créé par ${interaction.user.tag} • 👍 0  👎 0` });
    const msg = await interaction.reply({ embeds: [embed], components: [row], fetchReply: true });

    const collector = msg.createMessageComponentCollector({ time: 5 * 60 * 1000 });
    collector.on('collect', async i => {
      if (voters.has(i.user.id)) {
        return i.reply({ content: 'Tu as déjà voté !', ephemeral: true });
      }
      voters.add(i.user.id);
      if (i.customId === 'poll_yes') yes++; else no++;
      embed.setFooter({ text: `Créé par ${interaction.user.tag} • 👍 ${yes}  👎 ${no}` });
      await i.update({ embeds: [embed] });
    });

    collector.on('end', () => {
      row.components.forEach(b => b.setDisabled(true));
      msg.edit({ components: [row] }).catch(() => {});
    });
  }
};
