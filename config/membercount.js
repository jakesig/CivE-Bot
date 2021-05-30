/* membercount.js
** CivE Bot
** Author: Jake Sigman
** This file contains a function that counts the members in a server (or all of them).
*/

const Discord = require('discord.js');

function membercount(client, specifiedGuild = null) {

  //If a guild is specified, only update member count for that guild

  if (specifiedGuild) {
    const memberCountChannel = specifiedGuild.channels.cache.find(i => i.name.startsWith("Member Count"));
    const memberCount = specifiedGuild.members.cache.filter(member => !member.user.bot).size;
    memberCountChannel.setName("Member Count: " + memberCount);
    return;
  }

  //Otherwise, update member count in each guild

  client.guilds.cache.forEach(guild => {
    const memberCountChannel = guild.channels.cache.find(i => i.name.startsWith("Member Count"));
    const memberCount = guild.members.cache.filter(member => !member.user.bot).size;
    memberCountChannel.setName("Member Count: " + memberCount);
  });
}

module.exports = membercount;