/* specverify.js
** CivE Bot
** Author: Jake Sigman
** This file contains a function that assigns member the Spectator role.
*/

const Discord = require('discord.js');

function func(client, msg, perms, userID) {
  
  //Checking for permissions

  if (!perms)
    return;

  //Variables

  const user = msg.mentions.users.first();
  const pend = msg.member.guild.roles.cache.find(role => role.name === "Pending Mod Review");
  const spec = msg.member.guild.roles.cache.find(role => role.name === "Spectator");

  //Logging

  const msgembed = new Discord.MessageEmbed()
    .setColor('#ffff00')
    .setTitle('Member verified (Spectator)')
    .setDescription("**User: **<@"+user.id+">")
    .setTimestamp();

  msg.guild.channels.cache.find(i => i.name === "action-log").send(msgembed);
  client.users.cache.get(userID).send("**Command Ran: **" + msg.content + "\n**User: **" + msg.author.username + "\n**Channel: **" + msg.channel.name);

  //Delete invocation

  msg.channel.bulkDelete(1);


  
  //Embed construction

  const embed = new Discord.MessageEmbed()
    .setColor('#c28080')
    .setTitle('Verified ' + user.username + "! (Spectator)")
    .setDescription('Spectator role assigned.')
    .setTimestamp();

  //Confirming that user exists, then assigning respective roles
  
  if (user) {
    const memb = msg.guild.member(user);
    if (memb) {
      memb.roles.remove(pend);
      memb.roles.add(spec);
      msg.channel.send(embed);
    }
    else
      msg.reply("Can't find user.");
  }
  else
    msg.reply("No user mentioned.");
  return;
}

module.exports = func;