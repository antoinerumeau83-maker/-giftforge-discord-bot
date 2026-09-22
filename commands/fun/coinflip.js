const { SlashCommandBuilder } = require('discord.js');
const { baseEmbed } = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder().setName('coinflip').setDescription('Lance une pièce'),
  async execute(interaction) {
    const result = Math.random() < 0.5 ? 'Pile 🪙' : 'Face 🪙';
    await interaction.reply({ embeds: [baseEmbed().setTitle('Lancer de pièce').setDescription(`Résultat : **${result}**`)] });
  }
};
