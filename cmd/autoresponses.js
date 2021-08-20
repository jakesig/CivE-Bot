/* autoresponses.js
** CivE Bot
** Author: Jake Sigman
** This file contains a function that sends a list of the autoresponses.
*/

const Discord = require('discord.js');

function autoresponses(client, msg, perms, autoresponses, userID) {

  //Checking for permissions

  if (!perms)
    return;

  //Variables

  const args = msg.content.substring(1).split(" ");
  var description = new String();

  //Logging

  const msgembed = new Discord.MessageEmbed()
    .setColor('#ffff00')
    .setTitle('Autoresponses requested')
    .setDescription("**User: **<@"+msg.author.id+"> \n**Command: **"+msg.content+"\n**Channel: **"+msg.channel.name)
    .setTimestamp();

  msg.guild.channels.cache.find(i => i.name === "action-log").send(msgembed);
  
  if (userID)
    client.users.cache.get(userID).send("**Command Ran: **" + msg.content + "\n**User: **" + msg.author.username + "\n**Channel: **" + msg.channel.name);

  //Delete invocation and check if arguments are provided.

  msg.channel.bulkDelete(1);

  //Embed construction

  for (let key of autoresponses.keys())
    description += "**Prompt: **" + key + "\n**Response: **" + autoresponses.get(key) +"\n\n"

  const embed = new Discord.MessageEmbed()
    .setColor('#c28080')
    .setTitle('CivE Bot - List of Autoresponses')
    .setDescription(description)
    .setThumbnail("https://github.com/jakesig/CivE-Bot/blob/master/share/bot%20icon.png?raw=true")
    .setTimestamp();

  msg.channel.send(embed);
}

module.exports = autoresponses;