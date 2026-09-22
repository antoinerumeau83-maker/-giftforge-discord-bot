const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const config = require('../../config');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('customembed')
    .setDescription('[Premium] Envoie un embed entièrement personnalisé dans un salon')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .addStringOption(o => o.setName('titre').setDescription("Titre de l'embed").setRequired(true))
    .addStringOption(o => o.setName('description').setDescription("Contenu de l'embed").setRequired(true))
    .addStringOption(o => o.setName('couleur').setDescription('Couleur hexadécimale, ex: #FF0000'))
    .addStringOption(o => o.setName('image').setDescription("URL d'une image")),
  premiumOnly: true,
  async execute(interaction) {
    const titre = interaction.options.getString('titre');
    const description = interaction.options.getString('description');
    const couleur = interaction.options.getString('couleur');
    const image = interaction.options.getString('image');

    const embed = new EmbedBuilder().setTitle(titre).setDescription(description).setColor(couleur || config.colors.premium);
    if (image) embed.setImage(image);

    await interaction.channel.send({ embeds: [embed] });
    await interaction.reply({ content: '✅ Embed envoyé.', ephemeral: true });
  }
};
