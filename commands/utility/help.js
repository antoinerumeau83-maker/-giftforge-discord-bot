const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');
const config = require('../../config');

const CATEGORY_LABELS = {
  utility: '🛠️ Utilitaire',
  fun: '🎮 Jeux & Fun',
  moderation: '🔨 Modération',
  config: '⚙️ Configuration',
  premium: '⭐ Premium',
  owner: '👑 Propriétaire'
};

module.exports = {
  data: new SlashCommandBuilder().setName('help').setDescription('Affiche la liste des commandes du bot'),
  async execute(interaction) {
    const client = interaction.client;
    const categories = [...new Set(client.commands.map(c => c.category))];

    const buildEmbed = (cat) => {
      const cmds = client.commands.filter(c => c.category === cat);
      const embed = new EmbedBuilder()
        .setColor(config.colors.primary)
        .setTitle(`${CATEGORY_LABELS[cat] || cat} — ${cmds.size} commande(s)`)
        .setDescription(cmds.map(c => `**/${c.data.name}** — ${c.data.description}`).join('\n'))
        .setFooter({ text: `${client.commands.size} commandes au total • Sélectionne une catégorie ci-dessous` });
      return embed;
    };

    const menu = new StringSelectMenuBuilder()
      .setCustomId('help_menu')
      .setPlaceholder('📂 Choisis une catégorie')
      .addOptions(categories.map(cat => ({ label: CATEGORY_LABELS[cat] || cat, value: cat })));

    const row = new ActionRowBuilder().addComponents(menu);
    const msg = await interaction.reply({ embeds: [buildEmbed(categories[0])], components: [row], fetchReply: true });

    const collector = msg.createMessageComponentCollector({ time: 3 * 60 * 1000 });
    collector.on('collect', async i => {
      if (i.user.id !== interaction.user.id) return i.reply({ content: "Ce menu n'est pas pour toi.", ephemeral: true });
      await i.update({ embeds: [buildEmbed(i.values[0])] });
    });
    collector.on('end', () => {
      row.components.forEach(c => c.setDisabled(true));
      msg.edit({ components: [row] }).catch(() => {});
    });
  }
};
