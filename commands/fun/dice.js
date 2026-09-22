const { SlashCommandBuilder } = require('discord.js');
const { baseEmbed } = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('dice')
    .setDescription('Lance un ou plusieurs dés')
    .addIntegerOption(o => o.setName('faces').setDescription('Nombre de faces (défaut 6)').setMinValue(2).setMaxValue(1000))
    .addIntegerOption(o => o.setName('quantite').setDescription('Nombre de dés (défaut 1)').setMinValue(1).setMaxValue(20)),
  async execute(interaction) {
    const faces = interaction.options.getInteger('faces') || 6;
    const qty = interaction.options.getInteger('quantite') || 1;
    const rolls = Array.from({ length: qty }, () => Math.floor(Math.random() * faces) + 1);
    const total = rolls.reduce((a, b) => a + b, 0);

    await interaction.reply({
      embeds: [baseEmbed().setTitle('🎲 Lancer de dé(s)').setDescription(`Résultats : **${rolls.join(', ')}**\nTotal : **${total}**`)]
    });
  }
};
