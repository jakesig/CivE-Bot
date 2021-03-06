/* kick.js
** CivE Bot
** Author: Jake Sigman
** This file contains a function that kicks a user.
*/


const Discord = require('discord.js');

function kick(client, msg, perms, userID) {
  
  //Checking for permissions

  if (!perms) {
    return;
  }

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

  //Delete invocation and determine user to kick

  msg.channel.bulkDelete(1);
  const user = msg.mentions.users.first();

  //Embed Construction

  const embed = new Discord.MessageEmbed()
    .setColor('#c28080')
    .setTitle('Kicked ' + user.username)
    .setDescription('I love kicking.')
    .setThumbnail("https://github.com/jakesig/CivE-Bot/blob/master/share/bot%20icon.png?raw=true")
    .setTimestamp();

  if (user) {
    const member = msg.guild.member(user);
    if (member) {
      member
        .kick('null')
        .then(() => {
          msg.channel.send(embed);
        })
        .catch(err => {
          msg.reply('I was unable to kick the member');
          console.error(err);
        });
    }
    else {
      msg.reply("That user isn't in this server!");
    }
  }
  else
    msg.reply("You didn't mention the user to kick!");
    
  return;
}

module.exports = kick;