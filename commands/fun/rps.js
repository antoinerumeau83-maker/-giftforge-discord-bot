const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { baseEmbed } = require('../../utils/embeds');

const CHOICES = { pierre: '🪨', feuille: '📄', ciseaux: '✂️' };
function determineWinner(player, bot) {
  if (player === bot) return 'draw';
  if ((player === 'pierre' && bot === 'ciseaux') || (player === 'feuille' && bot === 'pierre') || (player === 'ciseaux' && bot === 'feuille')) return 'player';
  return 'bot';
}

module.exports = {
  data: new SlashCommandBuilder().setName('rps').setDescription('Pierre-Feuille-Ciseaux contre le bot'),
  async execute(interaction) {
    const row = new ActionRowBuilder().addComponents(
      ...Object.entries(CHOICES).map(([key, emoji]) => new ButtonBuilder().setCustomId(`rps_${key}`).setLabel(`${emoji} ${key}`).setStyle(ButtonStyle.Primary))
    );

    const msg = await interaction.reply({ embeds: [baseEmbed().setTitle('🎮 Pierre-Feuille-Ciseaux').setDescription('Choisis ton coup !')], components: [row], fetchReply: true });

    try {
      const i = await msg.awaitMessageComponent({ filter: i => i.user.id === interaction.user.id, time: 30000 });
      const playerChoice = i.customId.replace('rps_', '');
      const botChoice = Object.keys(CHOICES)[Math.floor(Math.random() * 3)];
      const result = determineWinner(playerChoice, botChoice);
      const resultText = result === 'draw' ? '🤝 Égalité !' : result === 'player' ? '🎉 Tu as gagné !' : '💻 Le bot a gagné !';

      await i.update({
        embeds: [baseEmbed().setTitle('🎮 Pierre-Feuille-Ciseaux').setDescription(`Toi : ${CHOICES[playerChoice]} ${playerChoice}\nBot : ${CHOICES[botChoice]} ${botChoice}\n\n**${resultText}**`)],
        components: []
      });
    } catch {
      await interaction.editReply({ content: '⏱️ Temps écoulé.', components: [] });
    }
  }
};
