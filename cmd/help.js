/* help.js
** CivE Bot
** Author: Jake Sigman
** This file contains a function that sends the help menu.
*/

//discord.js library import

const Discord = require('discord.js');

function help(client, msg, userID) {
  
  //Logging

  const msgembed = new Discord.MessageEmbed()
    .setColor('#ffff00')
    .setTitle('Help requested')
    .setDescription("**User: **<@"+msg.author.id+"> \n**Command: **"+msg.content+"\n**Channel: **"+msg.channel.name)
    .setTimestamp();

  msg.guild.channels.cache.find(i => i.name === "action-log").send(msgembed);

  if (userID)
    client.users.cache.get(userID).send("**Command Ran: **" + msg.content + "\n**User: **" + msg.author.username + "\n**Channel: **" + msg.channel.name);
  
  //Delete invocation, begin typing

  msg.channel.bulkDelete(1);
  msg.channel.startTyping();

  //Construct two different embeds, depending on the channel

  const mod_embed = new Discord.MessageEmbed()
    .setColor('#c28080')
    .setTitle('CivE Bot List of Commands')
    .setDescription(`!help: *Opens this menu.*
    !ping: *Pings the bot.*
    !git: *Returns git repository information.*
    !kick {@member}: *Kicks member with name member.*
    !ban {@member}: *Bans member with name member.*
    !purge {number}: *Bulk deletes number of messages specified.*
    !echo {channel-name} {message}: *Echoes message in channel specified.*
    !autoresponse {prompt} {response}: *Adds autoresponse to bot.*
    !verify {@member}: *Assigns Civil Engineering role to member.*
    !specverify {@member}: *Assigns Spectator role to member.*
    !setstatus {status}: *Sets the status of the bot.*
    !rolelist {role-name}: *Lists members with role name specified.*
    !poll "Question" "Option 1" "Option 2" etc. : *Sends out poll with reactions.*`)
    .setTimestamp();
  const embed = new Discord.MessageEmbed()
    .setColor('#c28080')
    .setTitle('CivE Bot List of Commands')
    .setDescription(`!help: *Opens this menu.*
    !git: *Returns git repository information.*
    !ping: *Pings the bot.*
    !rolelist {role-name}: *Lists members with role name specified.*
    !poll "Question" "Option 1" "Option 2" etc. : *Sends out poll with reactions.*`)
    .setTimestamp();

  msg.channel.stopTyping();

  if (msg.channel.name === 'mod-chat' || msg.channel.name === 'mod-log')
    return msg.channel.send(mod_embed);
  
  else
    return msg.channel.send(embed);
}

module.exports = help;