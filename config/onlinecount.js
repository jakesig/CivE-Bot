/* onlinecount.js
** CivE Bot
** Author: Jake Sigman
** This file contains a function that counts the online members in a server (or all of them).
*/

const Discord = require('discord.js');

function func(client, oldPr = null, newPr = null, online = 0) {

  //If a guild is specified, only update online count for that guild

  if (newPr && newPr.guild) {

    //Checks if user is a bot

    if (newPr.member.user.bot)
      return;

    //Checks if the old presence is valid

    if (!oldPr)
      return;

    const onlineCountChannel = newPr.guild.channels.cache.find(i => i.name.startsWith("Members Online"));
    const onlineCount = newPr.guild.members.cache.filter(member => member.presence.status !== "offline" && !member.user.bot).size;

    //Booleans to ensure that the name of the channel is only being changed if it has to

    const countChange = online != onlineCount;
    const toOrFromOffline = oldPr.status == "offline" || newPr.status == "offline";

    //Conditionally performs the name change of the channel

    if (countChange && toOrFromOffline) {
      onlineCountChannel.setName("Members Online: " + onlineCount);
      online = onlineCount;
    }
  }

  //Otherwise, update online count in each guild

  client.guilds.cache.forEach(guild => {
    const onlineCountChannel = guild.channels.cache.find(i => i.name.startsWith("Members Online"));
    const onlineCount = guild.members.cache.filter(member => member.presence.status !== "offline" && !member.user.bot).size;
    onlineCountChannel.setName("Members Online: " + onlineCount);
  });
}

module.exports = func;