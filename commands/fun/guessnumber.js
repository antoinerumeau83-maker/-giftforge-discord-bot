const { SlashCommandBuilder } = require('discord.js');
const { baseEmbed, errorEmbed } = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('guessnumber')
    .setDescription('Devine un nombre entre 1 et 100 en 6 essais'),
  cooldown: 5,
  async execute(interaction) {
    const target = Math.floor(Math.random() * 100) + 1;
    let attempts = 0;
    const maxAttempts = 6;

    await interaction.reply({ embeds: [baseEmbed().setTitle('🔢 Devine le nombre').setDescription(`Je pense à un nombre entre **1** et **100**. Tu as **${maxAttempts}** essais.\nRéponds directement dans ce salon avec un nombre.`)] });

    const filter = m => m.author.id === interaction.user.id && !isNaN(m.content);
    const collector = interaction.channel.createMessageCollector({ filter, time: 60000, max: maxAttempts });

    collector.on('collect', async m => {
      attempts++;
      const guess = parseInt(m.content);
      if (guess === target) {
        collector.stop('found');
        await m.reply({ embeds: [baseEmbed().setTitle('🎉 Bravo !').setDescription(`Tu as trouvé **${target}** en ${attempts} essai(s) !`)] });
      } else if (attempts >= maxAttempts) {
        collector.stop('failed');
      } else {
        await m.reply({ content: guess < target ? '📈 Plus grand !' : '📉 Plus petit !' });
      }
    });

    collector.on('end', (_, reason) => {
      if (reason === 'failed') {
        interaction.channel.send({ embeds: [errorEmbed(`Dommage, le nombre était **${target}**. Réessaie avec \`/guessnumber\` !`)] });
      }
    });
  }
};
