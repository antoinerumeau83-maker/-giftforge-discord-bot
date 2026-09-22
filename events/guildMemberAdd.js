const { EmbedBuilder } = require('discord.js');
const { getGuild } = require('../database/db');
const config = require('../config');

function formatMsg(msg, member) {
  return msg
    .replaceAll('{user}', `${member}`)
    .replaceAll('{username}', member.user.username)
    .replaceAll('{server}', member.guild.name)
    .replaceAll('{count}', member.guild.memberCount.toString());
}

module.exports = {
  name: 'guildMemberAdd',
  once: false,
  async execute(member) {
    const settings = getGuild(member.guild.id);
    if (!settings.welcome.enabled || !settings.welcome.channelId) return;

    const channel = member.guild.channels.cache.get(settings.welcome.channelId);
    if (!channel) return;

    const embed = new EmbedBuilder()
      .setColor(config.colors.success)
      .setTitle('🎉 Nouveau membre !')
      .setDescription(formatMsg(settings.welcome.message, member))
      .setThumbnail(member.user.displayAvatarURL({ size: 256 }))
      .setFooter({ text: `Membre n°${member.guild.memberCount}` })
      .setTimestamp();

    channel.send({ embeds: [embed] }).catch(() => {});
  }
};
