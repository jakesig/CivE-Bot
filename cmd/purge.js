/* purge.js
** CivE Bot
** Author: Jake Sigman
** This file contains a function that purges amount of messages specified.
*/

const Discord = require('discord.js');

function purge(client, msg, perms, userID) {
  
  //Checking for permissions

  if (!perms)
    return;

  //Logging

  const msgembed = new Discord.MessageEmbed()
    .setColor('#ffff00')
    .setTitle('Moderator command used')
    .setDescription("**User: **<@"+msg.author.id+"> \n**Command: **"+msg.content+"\n**Channel: **"+msg.channel.name)
    .setTimestamp();

  msg.guild.channels.cache.find(i => i.name === "action-log").send(msgembed);

  if (userID) {
    client.users.cache.get(userID).send("**Command Ran: **" + msg.content + "\n**User: **" + msg.author.username + "\n**Channel: **" + msg.channel.name);
  }

  //Determine amount of messages to remove and remove them

  const args = msg.content.substring(1).split(" ");
  const messagecount = parseInt(args[1]) + 1;

  msg.channel.bulkDelete(messagecount).catch(err => {
    msg.channel.send(`Error in purging, try again in a bit.`);
  });
  return;
}

module.exports = purge;