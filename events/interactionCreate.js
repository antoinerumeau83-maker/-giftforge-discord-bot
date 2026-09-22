const { Collection } = require('discord.js');
const { isOwner } = require('../utils/checks');
const { isPremium } = require('../database/db');
const { errorEmbed, premiumEmbed } = require('../utils/embeds');

module.exports = {
  name: 'interactionCreate',
  once: false,
  async execute(interaction, client) {
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    // --- Commandes réservées au(x) propriétaire(s) du bot ---
    if (command.ownerOnly && !isOwner(interaction.user.id)) {
      return interaction.reply({ embeds: [errorEmbed("Cette commande est réservée au(x) propriétaire(s) du bot.")], ephemeral: true });
    }

    // --- Commandes premium (uniquement pour les serveurs premium) ---
    if (command.premiumOnly && interaction.guildId && !isPremium(interaction.guildId) && !isOwner(interaction.user.id)) {
      return interaction.reply({
        embeds: [premiumEmbed("Cette commande est réservée aux serveurs **Premium**.\nUtilise `/premium-status` pour en savoir plus, ou contacte le propriétaire du bot.")],
        ephemeral: true
      });
    }

    // --- Cooldown simple (3s par défaut, ou command.cooldown en secondes) ---
    const cooldowns = client.cooldowns;
    if (!cooldowns.has(command.data.name)) cooldowns.set(command.data.name, new Collection());
    const timestamps = cooldowns.get(command.data.name);
    const cooldownAmount = (command.cooldown ?? 3) * 1000;
    const now = Date.now();

    if (timestamps.has(interaction.user.id)) {
      const expiresAt = timestamps.get(interaction.user.id) + cooldownAmount;
      if (now < expiresAt) {
        const remaining = ((expiresAt - now) / 1000).toFixed(1);
        return interaction.reply({ embeds: [errorEmbed(`Patiente encore **${remaining}s** avant de réutiliser cette commande.`)], ephemeral: true });
      }
    }
    timestamps.set(interaction.user.id, now);
    setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);

    try {
      await command.execute(interaction, client);
    } catch (err) {
      console.error(`Erreur dans la commande ${interaction.commandName} :`, err);
      const payload = { embeds: [errorEmbed("Une erreur est survenue lors de l'exécution de cette commande.")], ephemeral: true };
      if (interaction.replied || interaction.deferred) await interaction.followUp(payload).catch(() => {});
      else await interaction.reply(payload).catch(() => {});
    }
  }
};
