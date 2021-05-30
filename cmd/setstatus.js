/* setstatus.js
** CivE Bot
** Author: Jake Sigman
** This file contains a function that sets the status of the bot.
*/

//Library Imports

const Discord = require('discord.js');
const fs = require('fs');

function setstatus(client, msg, perms, userID) {
  
  //Checking for permissions

  if (!perms) {
    return;
  }

  //Determines status to be set, and checks if it's not empty

  const userstatus = msg.content.substring(11);

  if (!userstatus) {
    msg.reply("no status provided!");
  }

  //Logging

  const msgembed = new Discord.MessageEmbed()
    .setColor('#ffff00')
    .setTitle('Status set')
    .setDescription("**User: **<@"+msg.author.id+"> \n**New status: **Playing **"+userstatus+"**"+"\n**Channel: **"+msg.channel.name)
    .setTimestamp();

  msg.guild.channels.cache.find(i => i.name === "action-log").send(msgembed);

  if (userID) {
    client.users.cache.get(userID).send("**Command Ran: **" + msg.content + "\n**User: **" + msg.author.username + "\n**Channel: **" + msg.channel.name);
  }

  //Delete invocation

  msg.channel.bulkDelete(1);
  
  //Embed construction

  const embed = new Discord.MessageEmbed()
    .setColor('#c28080')
    .setTitle('Status set!')
    .setDescription("**New status: **Playing **"+userstatus+"**")
    .setTimestamp();

  msg.channel.send(embed);

  //Save the status in case the bot reboots

  fs.writeFileSync('status.txt', userstatus, 'utf8', (err) => {
    if (err) {
      throw err;
    }
  });

  client.user.setActivity(userstatus);
  
  return;
}

module.exports = setstatus;