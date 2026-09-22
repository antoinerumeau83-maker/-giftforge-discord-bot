const { EmbedBuilder } = require('discord.js');
const { getGuild } = require('../database/db');
const config = require('../config');

function formatMsg(msg, member) {
  return msg
    .replaceAll('{user}', member.user.tag)
    .replaceAll('{username}', member.user.username)
    .replaceAll('{server}', member.guild.name)
    .replaceAll('{count}', member.guild.memberCount.toString());
}

module.exports = {
  name: 'guildMemberRemove',
  once: false,
  async execute(member) {
    const settings = getGuild(member.guild.id);
    if (!settings.goodbye.enabled || !settings.goodbye.channelId) return;

    const channel = member.guild.channels.cache.get(settings.goodbye.channelId);
    if (!channel) return;

    const embed = new EmbedBuilder()
      .setColor(config.colors.error)
      .setTitle('👋 Départ')
      .setDescription(formatMsg(settings.goodbye.message, member))
      .setThumbnail(member.user.displayAvatarURL({ size: 256 }))
      .setTimestamp();

    channel.send({ embeds: [embed] }).catch(() => {});
  }
};
