/* ban.js
** CivE Bot
** Author: Jake Sigman
** This file contains a function that bans a user.
*/

const Discord = require('discord.js');

function func(client, msg, perms, userID) {

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

  //Delete invocation and determine user to ban

  msg.channel.bulkDelete(1);
  const user = msg.mentions.users.first();

  const embed = new Discord.MessageEmbed()
    .setColor('#c28080')
    .setTitle('Banned ' + user.username)
    .setDescription('Banning? Even better!')
    .setTimestamp();

  if (user) {
    const member = msg.guild.member(user);
    if (member) {
      member.ban({ reason: 'Because I said so.', })
        .then(() => {
          msg.channel.send(embed);
        })
        .catch(err => {
          msg.reply('I was unable to ban the member');
          console.error(err);
        });
    }
    else
      msg.reply("That user isn't in this server!");
  }
  else
    msg.reply("You didn't mention the user to ban!");
  return;
}

module.exports = func;