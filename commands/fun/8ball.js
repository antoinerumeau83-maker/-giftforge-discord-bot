const { SlashCommandBuilder } = require('discord.js');
const { baseEmbed } = require('../../utils/embeds');

const REPONSES = [
  "Oui, absolument.", "C'est certain.", "Sans aucun doute.", "Oui.",
  "Probablement.", "Les signes indiquent que oui.",
  "Réponse floue, réessaie.", "Redemande plus tard.", "Je préfère ne pas répondre.",
  "Je ne peux pas prédire ça pour le moment.",
  "N'y compte pas.", "Ma réponse est non.", "Mes sources disent non.", "Très douteux."
];

module.exports = {
  data: new SlashCommandBuilder()
    .setName('8ball')
    .setDescription('Pose une question à la boule magique')
    .addStringOption(o => o.setName('question').setDescription('Ta question').setRequired(true)),
  async execute(interaction) {
    const question = interaction.options.getString('question');
    const reponse = REPONSES[Math.floor(Math.random() * REPONSES.length)];
    await interaction.reply({
      embeds: [baseEmbed().setTitle('🎱 Boule Magique').addFields({ name: 'Question', value: question }, { name: 'Réponse', value: reponse })]
    });
  }
};
