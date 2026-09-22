const { SlashCommandBuilder } = require('discord.js');
const { baseEmbed, errorEmbed } = require('../../utils/embeds');
const util = require('util');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('eval')
    .setDescription('[Owner] Exécute du code JavaScript')
    .addStringOption(o => o.setName('code').setDescription('Code à exécuter').setRequired(true)),
  ownerOnly: true,
  async execute(interaction, client) {
    const code = interaction.options.getString('code');
    try {
      let result = eval(code);
      if (result instanceof Promise) result = await result;
      const output = typeof result === 'string' ? result : util.inspect(result, { depth: 0 });
      await interaction.reply({ embeds: [baseEmbed().setTitle('✅ Résultat').setDescription(`\`\`\`js\n${output.slice(0, 4000)}\n\`\`\``)], ephemeral: true });
    } catch (err) {
      await interaction.reply({ embeds: [errorEmbed(`\`\`\`js\n${err.message.slice(0, 4000)}\n\`\`\``)], ephemeral: true });
    }
  }
};
