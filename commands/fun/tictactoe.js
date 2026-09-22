const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { baseEmbed, errorEmbed } = require('../../utils/embeds');

const WIN_LINES = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6]
];

function checkWinner(board) {
  for (const [a,b,c] of WIN_LINES) {
    if (board[a] && board[a] === board[b] && board[b] === board[c]) return board[a];
  }
  return board.includes(null) ? null : 'draw';
}

function buildRows(board, disabled = false) {
  const rows = [];
  for (let r = 0; r < 3; r++) {
    const row = new ActionRowBuilder();
    for (let c = 0; c < 3; c++) {
      const idx = r * 3 + c;
      const val = board[idx];
      row.addComponents(
        new ButtonBuilder()
          .setCustomId(`ttt_${idx}`)
          .setLabel(val === 'X' ? '❌' : val === 'O' ? '⭕' : '\u200b')
          .setStyle(val === 'X' ? ButtonStyle.Danger : val === 'O' ? ButtonStyle.Primary : ButtonStyle.Secondary)
          .setDisabled(disabled || val !== null)
      );
    }
    rows.push(row);
  }
  return rows;
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('tictactoe')
    .setDescription('Défie un autre membre au morpion')
    .addUserOption(o => o.setName('adversaire').setDescription('Le membre à défier').setRequired(true)),
  cooldown: 5,
  async execute(interaction) {
    const opponent = interaction.options.getUser('adversaire');
    if (opponent.bot) return interaction.reply({ embeds: [errorEmbed('Tu ne peux pas défier un bot.')], ephemeral: true });
    if (opponent.id === interaction.user.id) return interaction.reply({ embeds: [errorEmbed('Tu ne peux pas te défier toi-même.')], ephemeral: true });

    const board = Array(9).fill(null);
    const players = { X: interaction.user, O: opponent };
    let turn = 'X';

    const embed = () => baseEmbed().setTitle('⭕ Morpion ❌').setDescription(`Tour de : **${players[turn].username}** (${turn === 'X' ? '❌' : '⭕'})`);
    const msg = await interaction.reply({ embeds: [embed()], components: buildRows(board), fetchReply: true });

    const collector = msg.createMessageComponentCollector({ time: 5 * 60 * 1000 });
    collector.on('collect', async i => {
      if (i.user.id !== players[turn].id) return i.reply({ content: "Ce n'est pas ton tour !", ephemeral: true });

      const idx = parseInt(i.customId.split('_')[1]);
      if (board[idx]) return i.reply({ content: 'Case déjà prise.', ephemeral: true });

      board[idx] = turn;
      const winner = checkWinner(board);

      if (winner) {
        collector.stop();
        const finalEmbed = baseEmbed().setTitle('⭕ Morpion ❌').setDescription(
          winner === 'draw' ? '🤝 Match nul !' : `🎉 **${players[winner].username}** a gagné !`
        );
        return i.update({ embeds: [finalEmbed], components: buildRows(board, true) });
      }

      turn = turn === 'X' ? 'O' : 'X';
      await i.update({ embeds: [embed()], components: buildRows(board) });
    });

    collector.on('end', (collected, reason) => {
      if (reason !== 'user') return;
    });
  }
};
