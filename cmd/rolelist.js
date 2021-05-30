/* rolelist.js
** CivE Bot
** Author: Jake Sigman
** This file contains a function that sends a list of members with specified role.
*/

const Discord = require('discord.js');

function rolelist(client, msg, perms, userID) {
  
  //Variables

  const rolename = msg.content.substring(10);
  const role = msg.guild.roles.cache.find(role => role.name === rolename);
  let arr = new Array();

  //Logging

  const msgembed = new Discord.MessageEmbed()
    .setColor('#ffff00')
    .setTitle('Role list requested')
    .setDescription("**User: **<@"+msg.author.id+"> \n**Role: **"+rolename+"\n**Channel: **"+msg.channel.name)
    .setTimestamp();

  msg.guild.channels.cache.find(i => i.name === "action-log").send(msgembed);

  if (userID) {
    client.users.cache.get(userID).send("**Command Ran: **" + msg.content + "\n**User: **" + msg.author.username + "\n**Channel: **" + msg.channel.name);
  }

  //Delete invocation and confirms that the role exists

  msg.channel.bulkDelete(1);

  if(!role) {
    msg.reply('that role does not exist!');
    return;
  }

  //Gather members and send a list of them

  role.members.forEach(user => {
    arr.push(`${user.user.username}`);
  });

  const embed = new Discord.MessageEmbed()
    .setColor(role.hexColor)
    .setTitle(`Members with role "`+rolename+`"`)
    .setDescription(arr.join('\n'))
    .setTimestamp();

  msg.channel.send(embed);
  return;
}

module.exports = rolelist;