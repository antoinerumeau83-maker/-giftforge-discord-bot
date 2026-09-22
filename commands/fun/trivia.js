const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { baseEmbed } = require('../../utils/embeds');

const QUESTIONS = [
  { q: "Quelle est la capitale de la France ?", choices: ["Paris", "Lyon", "Marseille", "Nice"], answer: 0 },
  { q: "Combien de continents y a-t-il sur Terre ?", choices: ["5", "6", "7", "8"], answer: 2 },
  { q: "Quelle planète est surnommée la planète rouge ?", choices: ["Vénus", "Mars", "Jupiter", "Saturne"], answer: 1 },
  { q: "Qui a peint la Joconde ?", choices: ["Van Gogh", "Picasso", "Léonard de Vinci", "Monet"], answer: 2 },
  { q: "Quel est le plus grand océan du monde ?", choices: ["Atlantique", "Indien", "Arctique", "Pacifique"], answer: 3 },
  { q: "En quelle année a eu lieu la Révolution française ?", choices: ["1789", "1799", "1804", "1815"], answer: 0 },
  { q: "Quel langage de programmation est utilisé pour ce bot ?", choices: ["Python", "JavaScript", "Java", "Ruby"], answer: 1 },
  { q: "Combien de joueurs dans une équipe de football sur le terrain ?", choices: ["9", "10", "11", "12"], answer: 2 }
];

module.exports = {
  data: new SlashCommandBuilder().setName('trivia').setDescription('Réponds à une question de culture générale'),
  cooldown: 5,
  async execute(interaction) {
    const question = QUESTIONS[Math.floor(Math.random() * QUESTIONS.length)];
    const row = new ActionRowBuilder().addComponents(
      question.choices.map((c, idx) => new ButtonBuilder().setCustomId(`trivia_${idx}`).setLabel(c).setStyle(ButtonStyle.Secondary))
    );

    const msg = await interaction.reply({ embeds: [baseEmbed().setTitle('🧠 Trivia').setDescription(question.q)], components: [row], fetchReply: true });

    try {
      const i = await msg.awaitMessageComponent({ filter: u => u.user.id === interaction.user.id, time: 20000 });
      const chosen = parseInt(i.customId.split('_')[1]);
      const correct = chosen === question.answer;
      await i.update({
        embeds: [baseEmbed().setTitle('🧠 Trivia').setDescription(`${question.q}\n\n${correct ? '✅ Bonne réponse !' : `❌ Mauvaise réponse. La bonne réponse était **${question.choices[question.answer]}**`}`)],
        components: []
      });
    } catch {
      await interaction.editReply({ embeds: [baseEmbed().setTitle('🧠 Trivia').setDescription(`⏱️ Temps écoulé ! La réponse était **${question.choices[question.answer]}**`)], components: [] });
    }
  }
};
