const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelSelectMenuBuilder, ChannelType, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
const { getGuild, updateGuild, isPremium } = require('../../database/db');
const config = require('../../config');

function buildPanelEmbed(guild) {
  const g = getGuild(guild.id);
  const premium = isPremium(guild.id);

  return new EmbedBuilder()
    .setColor(premium ? config.colors.premium : config.colors.primary)
    .setTitle(`⚙️ Panel de configuration — ${guild.name}`)
    .setThumbnail(guild.iconURL({ size: 256 }))
    .addFields(
      { name: '⭐ Statut', value: premium ? 'Premium actif' : 'Standard', inline: true },
      { name: '👋 Bienvenue', value: g.welcome.enabled ? `Activée dans <#${g.welcome.channelId}>` : 'Désactivée', inline: true },
      { name: '📋 Logs', value: g.logChannel ? `<#${g.logChannel}>` : 'Non défini', inline: true }
    )
    .setFooter({ text: 'Utilise les boutons ci-dessous pour configurer le bot' });
}

function buildRows() {
  const row1 = new ActionRowBuilder().addComponents(
    new ButtonBuilder().setCustomId('panel_toggle_welcome').setLabel('👋 Activer/Désactiver bienvenue').setStyle(ButtonStyle.Secondary),
    new ButtonBuilder().setCustomId('panel_edit_message').setLabel('✏️ Éditer le message').setStyle(ButtonStyle.Secondary)
  );
  const row2 = new ActionRowBuilder().addComponents(
    new ChannelSelectMenuBuilder().setCustomId('panel_select_welcome_channel').setPlaceholder('📌 Choisir le salon de bienvenue').addChannelTypes(ChannelType.GuildText)
  );
  return [row1, row2];
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('panel')
    .setDescription('Ouvre le panel de configuration interactif du bot')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
  async execute(interaction) {
    const msg = await interaction.reply({ embeds: [buildPanelEmbed(interaction.guild)], components: buildRows(), fetchReply: true });

    const collector = msg.createMessageComponentCollector({ time: 10 * 60 * 1000 });

    collector.on('collect', async i => {
      if (i.user.id !== interaction.user.id) return i.reply({ content: "Ce panel n'est pas pour toi.", ephemeral: true });

      if (i.customId === 'panel_toggle_welcome') {
        const g = updateGuild(interaction.guild.id, gg => { gg.welcome.enabled = !gg.welcome.enabled; });
        await i.update({ embeds: [buildPanelEmbed(interaction.guild)], components: buildRows() });
      }

      if (i.customId === 'panel_select_welcome_channel') {
        const channelId = i.values[0];
        updateGuild(interaction.guild.id, gg => { gg.welcome.channelId = channelId; gg.welcome.enabled = true; });
        await i.update({ embeds: [buildPanelEmbed(interaction.guild)], components: buildRows() });
      }

      if (i.customId === 'panel_edit_message') {
        const g = getGuild(interaction.guild.id);
        const modal = new ModalBuilder().setCustomId('panel_modal_message').setTitle('Message de bienvenue');
        const input = new TextInputBuilder()
          .setCustomId('welcome_message')
          .setLabel('Variables : {user} {username} {server} {count}')
          .setStyle(TextInputStyle.Paragraph)
          .setValue(g.welcome.message)
          .setRequired(true);
        modal.addComponents(new ActionRowBuilder().addComponents(input));
        await i.showModal(modal);

        try {
          const modalSubmit = await i.awaitModalSubmit({ time: 5 * 60 * 1000, filter: m => m.user.id === interaction.user.id });
          const newMessage = modalSubmit.fields.getTextInputValue('welcome_message');
          updateGuild(interaction.guild.id, gg => { gg.welcome.message = newMessage; });
          await modalSubmit.reply({ content: '✅ Message mis à jour.', ephemeral: true });
          await interaction.editReply({ embeds: [buildPanelEmbed(interaction.guild)], components: buildRows() });
        } catch { /* modal fermé sans réponse */ }
      }
    });

    collector.on('end', () => {
      interaction.editReply({ components: [] }).catch(() => {});
    });
  }
};
